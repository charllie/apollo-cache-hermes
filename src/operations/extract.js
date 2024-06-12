"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extract = void 0;
var tslib_1 = require("tslib");
var nodes_1 = require("../nodes");
var schema_1 = require("../schema");
var util_1 = require("../util");
/**
 * Create serializable representation of GraphSnapshot.
 *
 * The output still contains 'undefined' value as it is expected that caller
 * will perform JSON.stringify which will strip off 'undefined' value or
 * turn it into 'null' if 'undefined' is in an array.
 *
 * @throws Will throw an error if there is no corresponding node type
 */
function extract(graphSnapshot, cacheContext) {
    var result = {};
    var entities = graphSnapshot._values;
    // We don't need to check for hasOwnProperty because data._values is
    // created with prototype of 'null'
    for (var id in entities) {
        var nodeSnapshot = entities[id];
        var outbound = nodeSnapshot.outbound, inbound = nodeSnapshot.inbound;
        var type = void 0;
        if (nodeSnapshot instanceof nodes_1.EntitySnapshot) {
            type = 0 /* EntitySnapshot */;
        }
        else if (nodeSnapshot instanceof nodes_1.ParameterizedValueSnapshot) {
            type = 1 /* ParameterizedValueSnapshot */;
        }
        else {
            throw new Error(nodeSnapshot.constructor.name + " does not have corresponding enum value in Serializable.NodeSnapshotType");
        }
        var serializedEntity = { type: type };
        if (outbound) {
            serializedEntity.outbound = util_1.referenceValues(outbound);
        }
        if (inbound) {
            serializedEntity.inbound = util_1.referenceValues(inbound);
        }
        // Extract data value
        var extractedData = extractSerializableData(graphSnapshot, nodeSnapshot);
        if (extractedData !== undefined) {
            if (cacheContext.tracer.warning) {
                try {
                    if (!schema_1.isSerializable(extractedData, /* allowUndefined */ true)) {
                        cacheContext.tracer.warning("Data at entityID " + id + " is unserializable");
                    }
                }
                catch (error) {
                    cacheContext.tracer.warning("Data at entityID " + id + " is unserializable because of stack overflow");
                    cacheContext.tracer.warning(error);
                }
            }
            serializedEntity.data = extractedData;
        }
        result[id] = serializedEntity;
    }
    return result;
}
exports.extract = extract;
function extractSerializableData(graphSnapshot, nodeSnapshot) {
    var e_1, _a;
    // If there is no outbound, then data is a value
    // 'data' can also be undefined or null even though there exist an
    // outbound reference (e.g referencing ParameterizedValueSnapshot).
    // We can simply skip extraction of such data.
    if (!nodeSnapshot.outbound || !nodeSnapshot.data) {
        return nodeSnapshot.data;
    }
    // Type annotation is needed otherwise type of entity.data is not nullable
    // and so does extractedData which will cause an error when we assing 'null'.
    var extractedData = nodeSnapshot.data;
    try {
        // Set all the outbound path (e.g reference) to undefined.
        for (var _b = tslib_1.__values(util_1.referenceValues(nodeSnapshot.outbound)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var outbound = _c.value;
            // Only reference to EntitySnapshot is recorded in the data property
            // So we didn't end up set the value to be 'undefined' in the output
            // in every case
            if (graphSnapshot.getNodeSnapshot(outbound.id) instanceof nodes_1.EntitySnapshot) {
                // we have to write out 'null' here to differentiate between
                // data doesn't exist and data is a reference.
                //
                // In the case of parameterized field hanging off of a root
                // the data at the ROOTQUERY node will be undefined with outbound
                // reference to the parameterized node.
                extractedData = util_1.lazyImmutableDeepSet(extractedData, nodeSnapshot.data, outbound.path, outbound.path.length === 0 ? null : undefined);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return extractedData;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4dHJhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLGtDQUFvRjtBQUVwRixvQ0FBeUQ7QUFDekQsZ0NBQWdFO0FBRWhFOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0IsT0FBTyxDQUFDLGFBQTRCLEVBQUUsWUFBMEI7SUFDOUUsSUFBTSxNQUFNLEdBQStCLEVBQUUsQ0FBQztJQUM5QyxJQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDO0lBQ3ZDLG9FQUFvRTtJQUNwRSxtQ0FBbUM7SUFDbkMsS0FBSyxJQUFNLEVBQUUsSUFBSSxRQUFRLEVBQUU7UUFDekIsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFCLElBQUEsUUFBUSxHQUFjLFlBQVksU0FBMUIsRUFBRSxPQUFPLEdBQUssWUFBWSxRQUFqQixDQUFrQjtRQUUzQyxJQUFJLElBQUksU0FBK0IsQ0FBQztRQUN4QyxJQUFJLFlBQVksWUFBWSxzQkFBYyxFQUFFO1lBQzFDLElBQUkseUJBQStDLENBQUM7U0FDckQ7YUFBTSxJQUFJLFlBQVksWUFBWSxrQ0FBMEIsRUFBRTtZQUM3RCxJQUFJLHFDQUEyRCxDQUFDO1NBQ2pFO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFJLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSw2RUFBMEUsQ0FBQyxDQUFDO1NBQzdIO1FBRUQsSUFBTSxnQkFBZ0IsR0FBOEIsRUFBRSxJQUFJLE1BQUEsRUFBRSxDQUFDO1FBRTdELElBQUksUUFBUSxFQUFFO1lBQ1osZ0JBQWdCLENBQUMsUUFBUSxHQUFHLHNCQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDdkQ7UUFFRCxJQUFJLE9BQU8sRUFBRTtZQUNYLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxzQkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3JEO1FBRUQscUJBQXFCO1FBQ3JCLElBQU0sYUFBYSxHQUFHLHVCQUF1QixDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUMzRSxJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQUU7WUFDL0IsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtnQkFDL0IsSUFBSTtvQkFDRixJQUFJLENBQUMsdUJBQWMsQ0FBQyxhQUFhLEVBQUUsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQzdELFlBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHNCQUFvQixFQUFFLHVCQUFvQixDQUFDLENBQUM7cUJBQ3pFO2lCQUNGO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNkLFlBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHNCQUFvQixFQUFFLGlEQUE4QyxDQUFDLENBQUM7b0JBQ2xHLFlBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNwQzthQUNGO1lBQ0QsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQztTQUN2QztRQUVELE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQztLQUMvQjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFoREQsMEJBZ0RDO0FBRUQsU0FBUyx1QkFBdUIsQ0FBQyxhQUE0QixFQUFFLFlBQTBCOztJQUN2RixnREFBZ0Q7SUFDaEQsa0VBQWtFO0lBQ2xFLG1FQUFtRTtJQUNuRSw4Q0FBOEM7SUFDOUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFO1FBQ2hELE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQztLQUMxQjtJQUVELDBFQUEwRTtJQUMxRSw2RUFBNkU7SUFDN0UsSUFBSSxhQUFhLEdBQXFCLFlBQVksQ0FBQyxJQUFJLENBQUM7O1FBRXhELDBEQUEwRDtRQUMxRCxLQUF1QixJQUFBLEtBQUEsaUJBQUEsc0JBQWUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUEsZ0JBQUEsNEJBQUU7WUFBMUQsSUFBTSxRQUFRLFdBQUE7WUFDakIsb0VBQW9FO1lBQ3BFLG9FQUFvRTtZQUNwRSxnQkFBZ0I7WUFDaEIsSUFBSSxhQUFhLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsWUFBWSxzQkFBYyxFQUFFO2dCQUN4RSw0REFBNEQ7Z0JBQzVELDhDQUE4QztnQkFDOUMsRUFBRTtnQkFDRiwyREFBMkQ7Z0JBQzNELGlFQUFpRTtnQkFDakUsdUNBQXVDO2dCQUN2QyxhQUFhLEdBQUcsMkJBQW9CLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDdEk7U0FDRjs7Ozs7Ozs7O0lBRUQsT0FBTyxhQUFhLENBQUM7QUFDdkIsQ0FBQyJ9