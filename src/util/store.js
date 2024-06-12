"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueFromNode = void 0;
var tslib_1 = require("tslib");
var ts_invariant_1 = require("ts-invariant");
// Note: These functions were originally a part of apollo-utilities, but were
// removed 87c7a2bc as they were unused within the apollo-client project.
function defaultValueFromVariable(_node) {
    throw new ts_invariant_1.InvariantError("Variable nodes are not supported by valueFromNode");
}
/**
 * Evaluate a ValueNode and yield its value in its natural JS form.
 */
function valueFromNode(node, onVariable) {
    var e_1, _a;
    if (onVariable === void 0) { onVariable = defaultValueFromVariable; }
    switch (node.kind) {
        case 'Variable':
            return onVariable(node);
        case 'NullValue':
            return null;
        case 'IntValue':
            return parseInt(node.value);
        case 'FloatValue':
            return parseFloat(node.value);
        case 'ListValue':
            return node.values.map(function (v) { return valueFromNode(v, onVariable); });
        case 'ObjectValue': {
            var value = {};
            try {
                for (var _b = tslib_1.__values(node.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var field = _c.value;
                    value[field.name.value] = valueFromNode(field.value, onVariable);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return value;
        }
        default:
            return node.value;
    }
}
exports.valueFromNode = valueFromNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsNkNBQThDO0FBRzlDLDZFQUE2RTtBQUM3RSx5RUFBeUU7QUFFekUsU0FBUyx3QkFBd0IsQ0FBQyxLQUFtQjtJQUNuRCxNQUFNLElBQUksNkJBQWMsQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO0FBQ2hGLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQWdCLGFBQWEsQ0FDM0IsSUFBZSxFQUNmLFVBQW9EOztJQUFwRCwyQkFBQSxFQUFBLHFDQUFvRDtJQUVwRCxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDakIsS0FBSyxVQUFVO1lBQ2IsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUIsS0FBSyxXQUFXO1lBQ2QsT0FBTyxJQUFJLENBQUM7UUFDZCxLQUFLLFVBQVU7WUFDYixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsS0FBSyxZQUFZO1lBQ2YsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLEtBQUssV0FBVztZQUNkLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxhQUFhLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxFQUE1QixDQUE0QixDQUFDLENBQUM7UUFDNUQsS0FBSyxhQUFhLENBQUMsQ0FBQztZQUNsQixJQUFNLEtBQUssR0FBMkIsRUFBRSxDQUFDOztnQkFDekMsS0FBb0IsSUFBQSxLQUFBLGlCQUFBLElBQUksQ0FBQyxNQUFNLENBQUEsZ0JBQUEsNEJBQUU7b0JBQTVCLElBQU0sS0FBSyxXQUFBO29CQUNkLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2lCQUNsRTs7Ozs7Ozs7O1lBQ0QsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNEO1lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ3JCO0FBQ0gsQ0FBQztBQXpCRCxzQ0F5QkMifQ==