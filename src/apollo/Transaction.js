"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloTransaction = void 0;
var tslib_1 = require("tslib");
var lodash = require("lodash");
var util_1 = require("../util");
var Queryable_1 = require("./Queryable");
function getOriginalFieldArguments(id) {
    // Split `${containerId}❖${JSON.stringify(path)}❖${JSON.stringify(args)}`
    var idComponents = id.split('❖');
    if (idComponents.length < 3) {
        return undefined;
    }
    return JSON.parse(idComponents[2]);
}
/**
 * Apollo-specific transaction interface.
 */
var ApolloTransaction = /** @class */ (function (_super) {
    tslib_1.__extends(ApolloTransaction, _super);
    function ApolloTransaction(
    /** The underlying transaction. */
    _queryable) {
        var _this = _super.call(this) || this;
        _this._queryable = _queryable;
        _this.updateListOfReferences = _this.updateParameterizedReferences;
        return _this;
    }
    ApolloTransaction.prototype.reset = function () {
        throw new Error("reset() is not allowed within a transaction");
    };
    ApolloTransaction.prototype.removeOptimistic = function (_id) {
        throw new Error("removeOptimistic() is not allowed within a transaction");
    };
    ApolloTransaction.prototype.performTransaction = function (transaction) {
        transaction(this);
    };
    ApolloTransaction.prototype.recordOptimisticTransaction = function (_transaction, _id) {
        throw new Error("recordOptimisticTransaction() is not allowed within a transaction");
    };
    ApolloTransaction.prototype.watch = function (_query) {
        throw new Error("watch() is not allowed within a transaction");
    };
    ApolloTransaction.prototype.restore = function () {
        throw new Error("restore() is not allowed within a transaction");
    };
    ApolloTransaction.prototype.extract = function () {
        throw new Error("extract() is not allowed within a transaction");
    };
    /**
     * A helper function to be used when doing EntityUpdate.
     * The method enable users to iterate different parameterized at an editPath
     * of a given container Id.
     *
     * The 'updateFieldCallback' is a callback to compute new value given previous
     * list of references and an object literal of parameterized arguments at the
     * given path.
     *
     * @param containerId {string} an id of a container node to look for editPath.
     * @param pathToParameterizedField {(string|number)[]} an array of paths to
     *    parameterized field in container.
     */
    ApolloTransaction.prototype.updateParameterizedReferences = function (containerId, pathToParameterizedField, _a, _b, updateFieldCallback) {
        var e_1, _c;
        var writeFragment = _a.writeFragment, writeFragmentName = _a.writeFragmentName;
        var readFragment = _b.readFragment, readFragmentName = _b.readFragmentName;
        var currentContainerNode = this._queryable.getCurrentNodeSnapshot(containerId);
        if (!currentContainerNode || !currentContainerNode.outbound) {
            return;
        }
        try {
            for (var _d = tslib_1.__values(util_1.referenceValues(currentContainerNode.outbound)), _e = _d.next(); !_e.done; _e = _d.next()) {
                var _f = _e.value, outboundId = _f.id, path = _f.path;
                if (lodash.isEqual(pathToParameterizedField, path)) {
                    var fieldArguments = getOriginalFieldArguments(outboundId);
                    if (fieldArguments) {
                        var cacheResult = void 0;
                        try {
                            cacheResult = this.readFragment({
                                id: containerId,
                                fragment: readFragment,
                                fragmentName: readFragmentName,
                                variables: fieldArguments,
                            }, this._queryable.isOptimisticTransaction());
                        }
                        catch (error) {
                            continue;
                        }
                        var previousData = util_1.deepGet(cacheResult, path);
                        // if previousData is not object or null or array,
                        // we won't allow the field to be updated
                        if (!Array.isArray(previousData) && typeof previousData !== 'object') {
                            var details = util_1.verboseTypeof(previousData) + " at ContainerId " + containerId + " with readFragment " + readFragmentName;
                            throw new Error("updateParameterizedReferences() expects previousData to be an array or object instead got " + details);
                        }
                        var updateData = updateFieldCallback(previousData, fieldArguments);
                        if (updateData !== previousData) {
                            this.writeFragment({
                                id: outboundId,
                                fragment: writeFragment,
                                fragmentName: writeFragmentName,
                                variables: fieldArguments,
                                data: updateData,
                            });
                        }
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_c = _d.return)) _c.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return ApolloTransaction;
}(Queryable_1.ApolloQueryable));
exports.ApolloTransaction = ApolloTransaction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUcmFuc2FjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsOENBQWlEO0FBTWpELGdDQUFnRjtBQUVoRix5Q0FBOEM7QUFFOUMsU0FBUyx5QkFBeUIsQ0FBQyxFQUFVO0lBQzNDLHlFQUF5RTtJQUN6RSxJQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDM0IsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsQ0FBQztBQUVEOztHQUVHO0FBQ0g7SUFBdUMsNkNBQThCO0lBRW5FO0lBQ0Usa0NBQWtDO0lBQ3hCLFVBQTRCO1FBRnhDLFlBSUUsaUJBQU8sU0FDUjtRQUhXLGdCQUFVLEdBQVYsVUFBVSxDQUFrQjtRQWlDeEMsNEJBQXNCLEdBQUcsS0FBSSxDQUFDLDZCQUE2QixDQUFDOztJQTlCNUQsQ0FBQztJQUVELGlDQUFLLEdBQUw7UUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELDRDQUFnQixHQUFoQixVQUFpQixHQUFXO1FBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQsOENBQWtCLEdBQWxCLFVBQW1CLFdBQXVDO1FBQ3hELFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsdURBQTJCLEdBQTNCLFVBQTRCLFlBQXdDLEVBQUUsR0FBVztRQUMvRSxNQUFNLElBQUksS0FBSyxDQUFDLG1FQUFtRSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVELGlDQUFLLEdBQUwsVUFBTSxNQUEwQjtRQUM5QixNQUFN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