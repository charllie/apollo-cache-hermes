"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldHasStaticDirective = exports.fieldIsParameterized = exports.fieldHasAlias = exports.fieldIsStatic = exports.selectionSetIsStatic = exports.fragmentMapForDocument = exports.variableDefaultsInOperation = exports.variablesInOperation = exports.getOperationOrDie = void 0;
var tslib_1 = require("tslib");
var utilities_1 = require("@apollo/client/utilities");
var ts_invariant_1 = tslib_1.__importDefault(require("ts-invariant"));
var primitive_1 = require("./primitive");
var store_1 = require("./store");
function getOperationOrDie(document) {
    var def = utilities_1.getOperationDefinition(document);
    ts_invariant_1.default(def, "GraphQL document is missing an operation");
    return def;
}
exports.getOperationOrDie = getOperationOrDie;
/**
 * Returns the names of all variables declared by the operation.
 */
function variablesInOperation(operation) {
    var e_1, _a;
    var names = new Set();
    if (operation.variableDefinitions) {
        try {
            for (var _b = tslib_1.__values(operation.variableDefinitions), _c = _b.next(); !_c.done; _c = _b.next()) {
                var definition = _c.value;
                names.add(definition.variable.name.value);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return names;
}
exports.variablesInOperation = variablesInOperation;
/**
 * Returns the default values of all variables in the operation.
 */
function variableDefaultsInOperation(operation) {
    var e_2, _a;
    var defaults = {};
    if (operation.variableDefinitions) {
        try {
            for (var _b = tslib_1.__values(operation.variableDefinitions), _c = _b.next(); !_c.done; _c = _b.next()) {
                var definition = _c.value;
                if (definition.type.kind === 'NonNullType')
                    continue; // Required.
                var defaultValue = definition.defaultValue;
                defaults[definition.variable.name.value] = primitive_1.isObject(defaultValue) ? store_1.valueFromNode(defaultValue) : null;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    return defaults;
}
exports.variableDefaultsInOperation = variableDefaultsInOperation;
/**
 * Extracts fragments from `document` by name.
 */
function fragmentMapForDocument(document) {
    var e_3, _a;
    var map = {};
    try {
        for (var _b = tslib_1.__values(document.definitions), _c = _b.next(); !_c.done; _c = _b.next()) {
            var definition = _c.value;
            if (definition.kind !== 'FragmentDefinition')
                continue;
            map[definition.name.value] = definition;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return map;
}
exports.fragmentMapForDocument = fragmentMapForDocument;
/**
 * Returns whether a selection set is considered static from the cache's
 * perspective.
 *
 * This is helpful if you want to assert that certain fragments or queries stay
 * static within the cache (and thus, avoid read-time overhead).
 *
 * If the selectionSet contains fragments, you must provide a getter function
 * that exposes them.
 */
function selectionSetIsStatic(selectionSet, fragmentGetter) {
    var e_4, _a;
    try {
        for (var _b = tslib_1.__values(selectionSet.selections), _c = _b.next(); !_c.done; _c = _b.next()) {
            var selection = _c.value;
            if (selection.kind === 'Field') {
                if (!fieldIsStatic(selection))
                    return false;
                if (selection.selectionSet && !selectionSetIsStatic(selection.selectionSet, fragmentGetter))
                    return false;
            }
            else if (selection.kind === 'FragmentSpread') {
                if (!fragmentGetter) {
                    throw new Error("fragmentGetter is required for selection sets with ...fragments");
                }
                var fragmentSet = fragmentGetter(selection.name.value);
                if (!fragmentSet) {
                    throw new Error("Unknown fragment " + selection.name.value + " in isSelectionSetStatic");
                }
                if (!selectionSetIsStatic(fragmentSet, fragmentGetter))
                    return false;
            }
            else if (selection.kind === 'InlineFragment') {
                if (!selectionSetIsStatic(selection.selectionSet, fragmentGetter))
                    return false;
            }
            else {
                throw new Error("Unknown selection type " + selection.kind + " in isSelectionSetStatic");
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return true;
}
exports.selectionSetIsStatic = selectionSetIsStatic;
function fieldIsStatic(field) {
    var isActuallyStatic = !fieldHasAlias(field) && !fieldIsParameterized(field);
    return isActuallyStatic || fieldHasStaticDirective(field);
}
exports.fieldIsStatic = fieldIsStatic;
function fieldHasAlias(field) {
    return !!field.alias;
}
exports.fieldHasAlias = fieldHasAlias;
function fieldIsParameterized(field) {
    return !!(field.arguments && field.arguments.length);
}
exports.fieldIsParameterized = fieldIsParameterized;
function fieldHasStaticDirective(_a) {
    var directives = _a.directives;
    if (!directives)
        return false;
    return directives.some(function (directive) { return directive.name.value === 'static'; });
}
exports.fieldHasStaticDirective = fieldHasStaticDirective;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFXQSxzREFBK0U7QUFDL0Usc0VBQXFDO0FBSXJDLHlDQUF1QztBQUN2QyxpQ0FBd0M7QUFjeEMsU0FBZ0IsaUJBQWlCLENBQy9CLFFBQXNCO0lBRXRCLElBQU0sR0FBRyxHQUFHLGtDQUFzQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLHNCQUFTLENBQUMsR0FBRyxFQUFFLDBDQUEwQyxDQUFDLENBQUM7SUFDM0QsT0FBTyxHQUE4QixDQUFDO0FBQ3hDLENBQUM7QUFORCw4Q0FNQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQUMsU0FBa0M7O0lBQ3JFLElBQU0sS0FBSyxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7SUFDaEMsSUFBSSxTQUFTLENBQUMsbUJBQW1CLEVBQUU7O1lBQ2pDLEtBQXlCLElBQUEsS0FBQSxpQkFBQSxTQUFTLENBQUMsbUJBQW1CLENBQUEsZ0JBQUEsNEJBQUU7Z0JBQW5ELElBQU0sVUFBVSxXQUFBO2dCQUNuQixLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzNDOzs7Ozs7Ozs7S0FDRjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQVRELG9EQVNDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQiwyQkFBMkIsQ0FBQyxTQUFrQzs7SUFDNUUsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLElBQUksU0FBUyxDQUFDLG1CQUFtQixFQUFFOztZQUNqQyxLQUF5QixJQUFBLEtBQUEsaUJBQUEsU0FBUyxDQUFDLG1CQUFtQixDQUFBLGdCQUFBLDRCQUFFO2dCQUFuRCxJQUFNLFVBQVUsV0FBQTtnQkFDbkIsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxhQUFhO29CQUFFLFNBQVMsQ0FBQyxZQUFZ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