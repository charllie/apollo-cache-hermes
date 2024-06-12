"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSerializable = exports.StaticNodeId = void 0;
var tslib_1 = require("tslib");
var util_1 = require("./util");
/**
 * There are a few pre-defined nodes present in all schemas.
 */
var StaticNodeId;
(function (StaticNodeId) {
    StaticNodeId["QueryRoot"] = "ROOT_QUERY";
    StaticNodeId["MutationRoot"] = "ROOT_MUTATION";
    StaticNodeId["SubscriptionRoot"] = "ROOT_SUBSCRIPTION";
})(StaticNodeId = exports.StaticNodeId || (exports.StaticNodeId = {}));
function isSerializable(value, allowUndefined) {
    var e_1, _a, e_2, _b;
    if (util_1.isScalar(value)) {
        // NaN is considered to typeof number
        var isNaNValue = Number.isNaN(value);
        return allowUndefined ? !isNaNValue : !isNaNValue && value !== undefined;
    }
    if (util_1.isObject(value)) {
        try {
            for (var _c = tslib_1.__values(Object.getOwnPropertyNames(value)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var propName = _d.value;
                if (!isSerializable(value[propName], allowUndefined)) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    }
    if (Array.isArray(value)) {
        try {
            for (var value_1 = tslib_1.__values(value), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
                var element = value_1_1.value;
                if (!isSerializable(element, allowUndefined)) {
                    return false;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (value_1_1 && !value_1_1.done && (_b = value_1.return)) _b.call(value_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return true;
    }
    return false;
}
exports.isSerializable = isSerializable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFJQSwrQkFBMEQ7QUFtQjFEOztHQUVHO0FBQ0gsSUFBWSxZQUlYO0FBSkQsV0FBWSxZQUFZO0lBQ3RCLHdDQUF3QixDQUFBO0lBQ3hCLDhDQUE4QixDQUFBO0lBQzlCLHNEQUFzQyxDQUFBO0FBQ3hDLENBQUMsRUFKVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUl2QjtBQThFRCxTQUFnQixjQUFjLENBQUMsS0FBVSxFQUFFLGNBQXdCOztJQUNqRSxJQUFJLGVBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNuQixxQ0FBcUM7UUFDckMsSUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFZLENBQUMsQ0FBQztRQUM5QyxPQUFPLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLEtBQUssS0FBSyxTQUFTLENBQUM7S0FDMUU7SUFFRCxJQUFJLGVBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTs7WUFDbkIsS0FBdUIsSUFBQSxLQUFBLGlCQUFBLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQSxnQkFBQSw0QkFBRTtnQkFBckQsSUFBTSxRQUFRLFdBQUE7Z0JBQ2pCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxFQUFFO29CQUNwRCxPQUFPLEtBQUssQ0FBQztpQkFDZDthQUNGOzs7Ozs7Ozs7UUFDRCxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFOztZQUN4QixLQUFzQixJQUFBLFVBQUEsaUJBQUEsS0FBSyxDQUFBLDRCQUFBLCtDQUFFO2dCQUF4QixJQUFNLE9BQU8sa0JBQUE7Z0JBQ2hCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxFQUFFO29CQUM1QyxPQUFPLEtBQUssQ0FBQztpQkFDZDthQUNGOzs7Ozs7Ozs7UUFDRCxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBMUJELHdDQTBCQyJ9