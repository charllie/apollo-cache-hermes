"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._visitSelection = exports._walkAndOverlayDynamicValues = exports.read = void 0;
var tslib_1 = require("tslib");
var schema_1 = require("../schema");
var util_1 = require("../util");
var SnapshotEditor_1 = require("./SnapshotEditor");
function read(context, raw, snapshot, includeNodeIds) {
    var tracerContext;
    if (context.tracer.readStart) {
        tracerContext = context.tracer.readStart(raw);
    }
    var operation = context.parseOperation(raw);
    // Retrieve the previous result (may be partially complete), or start anew.
    var queryResult = snapshot.readCache.get(operation) || {};
    snapshot.readCache.set(operation, queryResult);
    var cacheHit = true;
    if (!queryResult.result) {
        cacheHit = false;
        queryResult.result = snapshot.getNodeData(operation.rootId);
        if (!operation.isStatic) {
            var dynamicNodeIds = new Set();
            queryResult.result = _walkAndOverlayDynamicValues(operation, context, snapshot, queryResult.result, dynamicNodeIds);
            queryResult.dynamicNodeIds = dynamicNodeIds;
        }
        queryResult.entityIds = includeNodeIds ? new Set() : undefined;
        // When strict mode is disabled, we carry completeness forward for observed
        // queries.  Once complete, always complete.
        if (typeof queryResult.complete !== 'boolean') {
            queryResult.complete = _visitSelection(operation, context, queryResult.result, queryResult.entityIds);
        }
    }
    // We can potentially ask for results without node ids first, and then follow
    // up with an ask for them.  In that case, we need to fill in the cache a bit
    // more.
    if (includeNodeIds && !queryResult.entityIds) {
        cacheHit = false;
        var entityIds = new Set();
        var complete = _visitSelection(operation, context, queryResult.result, entityIds);
        queryResult.complete = complete;
        queryResult.entityIds = entityIds;
    }
    if (context.tracer.readEnd) {
        var result = { result: queryResult, cacheHit: cacheHit };
        context.tracer.readEnd(operation, result, tracerContext);
    }
    return queryResult;
}
exports.read = read;
var OverlayWalkNode = /** @class */ (function () {
    function OverlayWalkNode(value, containerId, parsedMap, path) {
        this.value = value;
        this.containerId = containerId;
        this.parsedMap = parsedMap;
        this.path = path;
    }
    return OverlayWalkNode;
}());
/**
 * Walks a parameterized field map, overlaying values at those paths on top of
 * existing results.
 *
 * Overlaid values are objects with prototypes pointing to the original results,
 * and new properties pointing to the parameterized values (or objects that
 * contain them).
 */
function _walkAndOverlayDynamicValues(query, context, snapshot, result, dynamicNodeIds) {
    var _a;
    // Corner case: We stop walking once we reach a parameterized field with no
    // snapshot, but we should also preemptively stop walking if there are no
    // dynamic values to be overlaid
    var rootSnapshot = snapshot.getNodeSnapshot(query.rootId);
    if (util_1.isNil(rootSnapshot))
        return result;
    // TODO: A better approach here might be to walk the outbound references from
    // each node, rather than walking the result set.  We'd have to store the path
    // on parameterized value nodes to make that happen.
    var newResult = _wrapValue(result, context);
    // TODO: This logic sucks.  We'd do much better if we had knowledge of the
    // schema.  Can we layer that on in such a way that we can support uses w/ and
    // w/o a schema compilation step?
    var queue = [new OverlayWalkNode(newResult, query.rootId, query.parsedQuery, [])];
    while (queue.length) {
        var walkNode = queue.pop();
        var value = walkNode.value, parsedMap = walkNode.parsedMap;
        var containerId = walkNode.containerId, path = walkNode.path;
        var valueId = context.entityIdForValue(value);
        if (valueId) {
            containerId = valueId;
            path = [];
        }
        for (var key in parsedMap) {
            var node = parsedMap[key];
            var child = void 0;
            var fieldName = key;
            // This is an alias if we have a schemaName declared.
            fieldName = node.schemaName ? node.schemaName : key;
            var nextContainerId = containerId;
            var nextPath = path;
            if (node.args) {
                var childId = SnapshotEditor_1.nodeIdForParameterizedValue(containerId, tslib_1.__spread(path, [fieldName]), node.args);
                var childSnapshot = snapshot.getNodeSnapshot(childId);
                if (!childSnapshot) {
                    var typeName = value.__typename;
                    if (!typeName && containerId === schema_1.StaticNodeId.QueryRoot) {
                        typeName = 'Query'; // Preserve the default cache's behavior.
                    }
                    // Should we fall back to a redirect?
                    var redirect = util_1.deepGet(context.resolverRedirects, [typeName, fieldName]);
                    if (redirect) {
                        childId = redirect(node.args);
                        if (!util_1.isNil(childId)) {
                            childSnapshot = snapshot.getNodeSnapshot(childId);
                        }
                    }
                }
                // Still no snapshot? Ok we're done here.
                if (!childSnapshot)
                    continue;
                dynamicNodeIds.add(childId);
                nextContainerId = childId;
                nextPath = [];
                child = childSnapshot.data;
            }
            else {
                nextPath = tslib_1.__spread(path, [fieldName]);
                child = value[fieldName];
            }
            // Have we reached a leaf (either in the query, or in the cache)?
            if (_shouldWalkChildren(child, node)) {
                child = _recursivelyWrapValue(child, context);
                var allChildValues = _flattenGraphQLObject(child, nextPath);
                for (var i = 0; i < allChildValues.length; i++) {
                    var item = allChildValues[i];
                    queue.push(new OverlayWalkNode(item.value, nextContainerId, (_a = node.children) !== null && _a !== void 0 ? _a : {}, item.path));
                }
            }
            // Because key is already a field alias, result will be written correctly
            // using alias as key.
            value[key] = child;
        }
    }
    return newResult;
}
exports._walkAndOverlayDynamicValues = _walkAndOverlayDynamicValues;
/**
 *  Check if `value` is an object and if any of its children are parameterized.
 *  We can skip this part of the graph if there are no parameterized children
 *  to resolve.
 */
function _shouldWalkChildren(value, node) {
    return !!node.hasParameterizedChildren && !!node.children && value !== null;
}
/**
 *  Finds all of the actual objects in `value` which can be a single object, an
 *  array of objects, or a multidimensional array of objects, and returns them
 *  as a flat list.
 */
function _flattenGraphQLObject(value, path) {
    if (value === null)
        return [];
    if (!Array.isArray(value))
        return [{ value: value, path: path }];
    var flattened = [];
    for (var i = 0; i < value.length; i++) {
        var item = value[i];
        var list = _flattenGraphQLObject(item, tslib_1.__spread(path, [i]));
        flattened.push.apply(flattened, tslib_1.__spread(list));
    }
    return flattened;
}
function _recursivelyWrapValue(value, context) {
    if (!Array.isArray(value)) {
        return _wrapValue(value, context);
    }
    var newValue = [];
    // Note that we're careful to iterate over all indexes, in case this is a
    // sparse array.
    for (var i = 0; i < value.length; i++) {
        newValue[i] = _recursivelyWrapValue(value[i], context);
    }
    return newValue;
}
function _wrapValue(value, context) {
    if (value === undefined) {
        return {};
    }
    if (Array.isArray(value)) {
        return tslib_1.__spread(value);
    }
    if (util_1.isObject(value)) {
        var newValue = tslib_1.__assign({}, value);
        if (context.entityTransformer && context.entityIdForValue(value)) {
            context.entityTransformer(newValue);
        }
        return newValue;
    }
    return value;
}
/**
 * Determines whether `result` satisfies the properties requested by
 * `selection`.
 */
function _visitSelection(query, context, result, nodeIds) {
    var complete = true;
    if (nodeIds && result !== undefined) {
        nodeIds.add(query.rootId);
    }
    // TODO: Memoize per query, and propagate through cache snapshots.
    util_1.walkOperation(query.info.parsed, result, function (value, fields) {
        var e_1, _a;
        if (value === undefined) {
            complete = false;
        }
        // If we're not including node ids, we can stop the walk right here.
        if (!complete)
            return !nodeIds;
        if (!util_1.isObject(value))
            return false;
        if (nodeIds && util_1.isObject(value)) {
            var nodeId = context.entityIdForValue(value);
            if (nodeId !== undefined) {
                nodeIds.add(nodeId);
            }
        }
        try {
            for (var fields_1 = tslib_1.__values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                var field = fields_1_1.value;
                if (!(field in value)) {
                    complete = false;
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (fields_1_1 && !fields_1_1.done && (_a = fields_1.return)) _a.call(fields_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    });
    return complete;
}
exports._visitSelection = _visitSelection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLG9DQUFrRjtBQUNsRixnQ0FBa0U7QUFFbEUsbURBQStEO0FBdUIvRCxTQUFnQixJQUFJLENBQUMsT0FBcUIsRUFBRSxHQUFpQixFQUFFLFFBQXVCLEVBQUUsY0FBd0I7SUFDOUcsSUFBSSxhQUFhLENBQUM7SUFDbEIsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUM1QixhQUFhLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDL0M7SUFFRCxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRTlDLDJFQUEyRTtJQUMzRSxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFxQyxDQUFDO0lBQy9GLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxXQUEwQixDQUFDLENBQUM7SUFFOUQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO1FBQ3ZCLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsV0FBVyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU1RCxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTtZQUN2QixJQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1lBQ3pDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsNEJBQTRCLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxjQUFlLENBQUMsQ0FBQztZQUNySCxXQUFXLENBQUMsY0FBYyxHQUFH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