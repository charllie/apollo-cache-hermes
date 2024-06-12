"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._expandArgument = exports.expandFieldArguments = exports._expandVariables = exports.expandVariables = exports.areChildrenDynamic = exports.parseQuery = exports.VariableArgument = exports.ParsedQueryNode = void 0;
var tslib_1 = require("tslib");
var equality_1 = tslib_1.__importDefault(require("@wry/equality"));
var errors_1 = require("./errors");
var util_1 = require("./util");
/**
 * The GraphQL AST is parsed down into a simple tree containing all information
 * the cache requires to read/write associated payloads.
 *
 * A parsed query has no notion of fragments, or other such redirections; they
 * are flattened into query nodes when parsed.
 */
var ParsedQueryNode = /** @class */ (function () {
    function ParsedQueryNode(
    /** Any child fields. */
    children, 
    /**
     * The name of the field (as defined by the schema).
     *
     * Omitted by default (can be inferred by its key in a node map), unless
     * the field is aliased.
     */
    schemaName, 
    /** The map of the field's arguments and their values, if parameterized. */
    args, 
    /**
     * Whether a (transitive) child contains arguments.  This allows us to
     * ignore whole subtrees in some situations if they were completely static.
     * */
    hasParameterizedChildren) {
        this.children = children;
        this.schemaName = schemaName;
        this.args = args;
        this.hasParameterizedChildren = hasParameterizedChildren;
    }
    return ParsedQueryNode;
}());
exports.ParsedQueryNode = ParsedQueryNode;
/**
 * Represents the location a variable should be used as an argument to a
 * parameterized field.
 *
 * Note that variables can occur _anywhere_ within an argument, not just at the
 * top level.
 */
var VariableArgument = /** @class */ (function () {
    function VariableArgument(
    /** The name of the variable. */
    name) {
        this.name = name;
    }
    return VariableArgument;
}());
exports.VariableArgument = VariableArgument;
/**
 * Parsed a GraphQL AST selection into a tree of ParsedQueryNode instances.
 */
function parseQuery(context, fragments, selectionSet) {
    var variables = new Set();
    var parsedQuery = _buildNodeMap(variables, context, fragments, selectionSet);
    if (!parsedQuery) {
        throw new Error("Parsed a query, but found no fields present; it may use unsupported GraphQL features");
    }
    return { parsedQuery: parsedQuery, variables: variables };
}
exports.parseQuery = parseQuery;
/**
 * Recursively builds a mapping of field names to ParsedQueryNodes for the given
 * selection set.
 */
function _buildNodeMap(variables, context, fragments, selectionSet, path) {
    var e_1, _a;
    if (path === void 0) { path = []; }
    if (!selectionSet)
        return undefined;
    var nodeMap = Object.create(null);
    try {
        for (var _b = tslib_1.__values(selectionSet.selections), _c = _b.next(); !_c.done; _c = _b.next()) {
            var selection = _c.value;
            if (selection.kind === 'Field') {
                // The name of the field (as defined by the query).
                var name_1 = selection.alias ? selection.alias.value : selection.name.value;
                var children = _buildNodeMap(variables, context, fragments, selection.selectionSet, tslib_1.__spread(path, [name_1]));
                var args = void 0, schemaName = void 0;
                // fields marked as @static are treated as if they are a static field in
                // the schema.  E.g. parameters are ignored, and an alias is considered
                // to be truth.
                if (!util_1.fieldHasStaticDirective(selection)) {
                    args = _buildFieldArgs(variables, selection.arguments);
                    schemaName = selection.alias ? selection.name.value : undefined;
                }
                var hasParameterizedChildren = areChildrenDynamic(children);
                var node = new ParsedQueryNode(children, schemaName, args, hasParameterizedChildren);
                nodeMap[name_1] = _mergeNodes(tslib_1.__spread(path, [name_1]), node, nodeMap[name_1]);
            }
            else if (selection.kind === 'FragmentSpread') {
                var fragment = fragments[selection.name.value];
                if (!fragment) {
                    throw new Error("Expected fragment " + selection.name.value + " to be defined");
                }
                var fragmentMap = _buildNodeMap(variables, context, fragments, fragment.selectionSet, path);
                if (fragmentMap) {
                    for (var name_2 in fragmentMap) {
                        nodeMap[name_2] = _mergeNodes(tslib_1.__spread(path, [name_2]), fragmentMap[name_2], nodeMap[name_2]);
                    }
                }
            }
            else if (selection.kind === 'InlineFragment') {
                var fragmentMap = _buildNodeMap(variables, context, fragments, selection.selectionSet, path);
                if (fragmentMap) {
                    for (var name_3 in fragmentMap) {
                        nodeMap[name_3] = _mergeNodes(tslib_1.__spread(path, [name_3]), fragmentMap[name_3], nodeMap[name_3]);
                    }
                }
            }
            else if (context.tracer.warning) {
                context.tracer.warning(selection.kind + " selections are not supported; query may misbehave");
            }
            _collectDirectiveVariables(variables, selection);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return Object.keys(nodeMap).length ? nodeMap : undefined;
}
/**
 * Well, are they?
 */
function areChildrenDynamic(children) {
    if (!children)
        return undefined;
    for (var name_4 in children) {
        var child = children[name_4];
        if (child.hasParameterizedChildren)
            return true;
        if (child.args)
            return true;
        if (child.schemaName)
            return true; // Aliases are dynamic at read time.
    }
    return undefined;
}
exports.areChildrenDynamic = areChildrenDynamic;
/**
 * Build the map of arguments to their natural JS values (or variables).
 */
function _buildFieldArgs(variables, argumentsNode) {
    var e_2, _a;
    if (!argumentsNode)
        return undefined;
    var args = {};
    try {
        for (var argumentsNode_1 = tslib_1.__values(argumentsNode), argumentsNode_1_1 = argumentsNode_1.next(); !argumentsNode_1_1.done; argumentsNode_1_1 = argumentsNode_1.next()) {
            var arg = argumentsNode_1_1.value;
            // Mapped name of argument to it JS value
            args[arg.name.value] = _valueFromNode(variables, arg.value);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (argumentsNode_1_1 && !argumentsNode_1_1.done && (_a = argumentsNode_1.return)) _a.call(argumentsNode_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return Object.keys(args).length ? args : undefined;
}
/**
 * Evaluate a ValueNode and yield its value in its natural JS form.
 */
function _valueFromNode(variables, node) {
    return util_1.valueFromNode(node, function (_a) {
        var value = _a.name.value;
        variables.add(value);
        return new VariableArgument(value);
    });
}
/**
 * Collect the variables in use by any directives on the node.
 */
function _collectDirectiveVariables(variables, node) {
    var e_3, _a, e_4, _b;
    var directives = node.directives;
    if (!directives)
        return;
    try {
        for (var directives_1 = tslib_1.__values(directives), directives_1_1 = directives_1.next(); !directives_1_1.done; directives_1_1 = directives_1.next()) {
            var directive = directives_1_1.value;
            if (!directive.arguments)
                continue;
            try {
                for (var _c = (e_4 = void 0, tslib_1.__values(directive.arguments)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var argument = _d.value;
                    util_1.valueFromNode(argument.value, function (_a) {
                        var value = _a.name.value;
                        variables.add(value);
                    });
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (directives_1_1 && !directives_1_1.done && (_a = directives_1.return)) _a.call(directives_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
}
/**
 * Merges two node definitions; mutating `target` to include children from
 * `source`.
 */
function _mergeNodes(path, target, source) {
    if (!source)
        return target;
    if (!equality_1.default(target.args, source.args)) {
        throw new errors_1.ConflictingFieldsError("parameterization mismatch", path, [target, source]);
    }
    if (target.schemaName !== source.schemaName) {
        throw new errors_1.ConflictingFieldsError("alias mismatch", path, [target, source]);
    }
    if (!source.children)
        return target;
    if (!target.children) {
        target.children = source.children;
    }
    else {
        for (var name_5 in source.children) {
            target.children[name_5] = _mergeNodes(tslib_1.__spread(path, [name_5]), source.children[name_5], target.children[name_5]);
        }
    }
    if (source.hasParameterizedChildren && !target.hasParameterizedChildren) {
        target.hasParameterizedChildren = true;
    }
    return target;
}
/**
 * Replace all instances of VariableArgument contained within a parsed operation
 * with their actual values.
 *
 * This requires that all variables used are provided in `variables`.
 */
function expandVariables(parsed, variables) {
    return _expandVariables(parsed, variables);
}
exports.expandVariables = expandVariables;
function _expandVariables(parsed, variables) {
    if (!parsed)
        return undefined;
    var newMap = {};
    for (var key in parsed) {
        var node = parsed[key];
        if (node.args || node.hasParameterizedChildren) {
            newMap[key] = new ParsedQueryNode(_expandVariables(node.children, variables), node.schemaName, expandFieldArguments(node.args, variables), node.hasParameterizedChildren);
            // No variables to substitute for this subtree.
        }
        else {
            newMap[key] = node;
        }
    }
    return newMap;
}
exports._expandVariables = _expandVariables;
/**
 * Sub values in for any variables required by a field's args.
 */
function expandFieldArguments(args, variables) {
    return args ? _expandArgument(args, variables) : undefined;
}
exports.expandFieldArguments = expandFieldArguments;
function _expandArgument(arg, variables) {
    if (arg instanceof VariableArgument) {
        if (!variables || !(arg.name in variables)) {
            throw new Error("Expected variable $" + arg.name + " to exist for query");
        }
        return variables[arg.name];
    }
    else if (Array.isArray(arg)) {
        return arg.map(function (v) { return _expandArgument(v, variables); });
    }
    else if (util_1.isObject(arg)) {
        var expanded = {};
        for (var key in arg) {
            expanded[key] = _expandArgument(arg[key], variables);
        }
        return expanded;
    }
    else {
        // TS isn't inferring that arg cannot contain any VariableArgument values.
        return arg;
    }
}
exports._expandArgument = _expandArgument;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFyc2VkUXVlcnlOb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUGFyc2VkUXVlcnlOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxtRUFBb0M7QUFHcEMsbUNBQWtEO0FBRWxELCtCQVNnQjtBQUtoQjs7Ozs7O0dBTUc7QUFDSDtJQUNFO0lBQ0Usd0JBQXdCO0lBQ2pCLFFBQXdDO0lBQy9DOzs7OztPQUtHO0lBQ0ksVUFBbUI7SUFDMUIsMkVBQTJFO0lBQ3BFLElBQThCO0lBQ3JDOzs7U0FHSztJQUNFLHdCQUErQjtRQWQvQixhQUFRLEdBQVIsUUFBUSxDQUFnQztRQU94QyxlQUFVLEdBQVYsVUFBVSxDQUFTO1FBRW5CLFNBQUksR0FBSixJQUFJLENBQTBCO1FBSzlCLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBTztJQUNyQyxDQUFDO0lBQ04sc0JBQUM7QUFBRCxDQUFDLEFBbkJELElBbUJDO0FBbkJZLDBDQUFlO0FBbUQ1Qjs7Ozs7O0dBTUc7QUFDSDtJQUNFO0lBQ0UsZ0NBQWdDO0lBQ2hCLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO0lBQzNCLENBQUM7SUFDTix1QkFBQztBQUFELENBQUMsQUFMRCxJQUtDO0FBTFksNENBQWdCO0FBTzdCOztHQUVHO0FBQ0gsU0FBZ0IsVUFBVSxDQUN4QixPQUFxQixFQUNyQixTQUFzQixFQUN0QixZQUE4QjtJQUU5QixJQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO0lBQ3BDLElBQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUMvRSxJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0ZBQXNGLENBQUMsQ0FBQztLQUN6RztJQUVELE9BQU8sRUFBRSxXQUFXLGFBQUEsRUFBRSxTQUFTLFdBQUEsRUFBRSxDQUFDO0FBQ3BDLENBQUM7QUFaRCxn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