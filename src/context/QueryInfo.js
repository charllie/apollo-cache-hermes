"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryInfo = void 0;
var tslib_1 = require("tslib");
var ParsedQueryNode_1 = require("../ParsedQueryNode");
var util_1 = require("../util");
/**
 * Metadata about a GraphQL document (query/mutation/fragment/etc).
 *
 * We do a fair bit of pre-processing over them, and these objects hang onto
 * that information.
 */
var QueryInfo = /** @class */ (function () {
    function QueryInfo(context, raw) {
        this.document = raw.document;
        this.operation = util_1.getOperationOrDie(raw.document);
        this.operationType = this.operation.operation;
        this.operationName = this.operation.name && this.operation.name.value;
        this.operationSource = this.operation.loc && this.operation.loc.source.body;
        this.fragmentMap = util_1.fragmentMapForDocument(raw.document);
        var _a = ParsedQueryNode_1.parseQuery(context, this.fragmentMap, this.operation.selectionSet), parsedQuery = _a.parsedQuery, variables = _a.variables;
        this.parsed = parsedQuery;
        this.variables = variables;
        this.variableDefaults = util_1.variableDefaultsInOperation(this.operation);
        // Skip verification if rawOperation is constructed from fragments
        // (e.g readFragment/writeFragment) because fragment will not declare
        // variables. Users will have to know to provide `variables` parameter
        if (!raw.fromFragmentDocument) {
            this._assertValid();
        }
    }
    QueryInfo.prototype._assertValid = function () {
        var messages = [];
        var declaredVariables = util_1.variablesInOperation(this.operation);
        this._assertAllVariablesDeclared(messages, declaredVariables);
        this._assertAllVariablesUsed(messages, declaredVariables);
        if (!messages.length)
            return;
        var mainMessage = "Validation errors in " + this.operationType + " " + (this.operationName || '<unknown>');
        throw new Error(mainMessage + ":" + messages.map(function (m) { return "\n * " + m; }).join(''));
    };
    QueryInfo.prototype._assertAllVariablesDeclared = function (messages, declaredVariables) {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__values(this.variables), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_1 = _c.value;
                if (!declaredVariables.has(name_1)) {
                    messages.push("Variable $" + name_1 + " is used, but not declared");
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
    };
    QueryInfo.prototype._assertAllVariablesUsed = function (messages, declaredVariables) {
        var e_2, _a;
        try {
            for (var declaredVariables_1 = tslib_1.__values(declaredVariables), declaredVariables_1_1 = declaredVariables_1.next(); !declaredVariables_1_1.done; declaredVariables_1_1 = declaredVariables_1.next()) {
                var name_2 = declaredVariables_1_1.value;
                if (!this.variables.has(name_2)) {
                    messages.push("Variable $" + name_2 + " is unused");
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (declaredVariables_1_1 && !declaredVariables_1_1.done && (_a = declaredVariables_1.return)) _a.call(declaredVariables_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    return QueryInfo;
}());
exports.QueryInfo = QueryInfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVlcnlJbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUXVlcnlJbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxzREFBMEU7QUFHMUUsZ0NBU2lCO0FBSWpCOzs7OztHQUtHO0FBQ0g7SUE0QkUsbUJBQVksT0FBcUIsRUFBRSxHQUFpQjtRQUNsRCxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyx3QkFBaUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztRQUM5QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN0RSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDNUUsSUFBSSxDQUFDLFdBQVcsR0FBRyw2QkFBc0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbEQsSUFBQSxLQUE2Qiw0QkFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEVBQTdGLFdBQVcsaUJBQUEsRUFBRSxTQUFTLGVBQXVFLENBQUM7UUFDdEcsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGtDQUEyQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVwRSxrRUFBa0U7UUFDbEUscUVBQXFFO1FBQ3JFLHNFQUFzRTtRQUN0RSxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFO1lBQzdCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUNyQjtJQUNILENBQUM7SUFFTyxnQ0FBWSxHQUFwQjtRQUNFLElBQU0sUUFBUSxHQUFhLEVBQUUsQ0FBQztRQUU5QixJQUFNLGlCQUFpQixHQUFHLDJCQUFvQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsMkJBQTJCLENBQUMsUUFBUSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBRTFELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTTtZQUFFLE9BQU87UUFDN0IsSUFBTSxXQUFXLEdBQUcsMEJBQXdCLElBQUksQ0FBQyxhQUFhLFVBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxXQUFXLENBQUUsQ0FBQztRQUN0RyxNQUFNLElBQUksS0FBSyxDQUFJLFdBQVcsU0FBSSxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsVUFBUSxDQUFHLEVBQVgsQ0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBRyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVPLCtDQUEyQixHQUFuQyxVQUFvQyxRQUFrQixFQUFFLGlCQUE4Qjs7O1lBQ3BGLEtBQW1CLElBQUEsS0FBQSxpQkFBQSxJQUFJLENBQUMsU0FBUyxDQUFBLGdCQUFBLDRCQUFFO2dCQUE5QixJQUFNLE1BQUksV0FBQTtnQkFDYixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLE1BQUksQ0FBQyxFQUFFO29CQUNoQyxRQUFRLENBQUMsSUFBSSxDQUFDLGVBQWEsTUFBSSwrQkFBNEIsQ0FBQyxDQUFDO2lCQUM5RDthQUNGOzs7Ozs7Ozs7SUFDSCxDQUFDO0lBRU8sMkNBQXVCLEdBQS9CLFVBQWdDLFFBQWtCLEVBQUUsaUJBQThCOzs7WUFDaEYsS0FBbUIsSUFBQSxzQkFBQSxpQkFBQSxpQkFBaUIsQ0FBQSxvREFBQSxtRkFBRTtnQkFBakMsSUFBTSxNQUFJLDhCQUFBO2dCQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFJLENBQUMsRUFBRTtvQkFDN0IsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFhLE1BQUksZUFBWSxDQUFDLENBQUM7aUJBQzlDO2FBQ0Y7Ozs7Ozs7OztJQUNILENBQUM7SUFFSCxnQkFBQztBQUFELENBQUMsQUE3RUQsSUE2RUM7QUE3RVksOEJBQVMifQ==