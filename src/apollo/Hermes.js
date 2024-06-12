"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hermes = void 0;
var tslib_1 = require("tslib");
var Cache_1 = require("../Cache");
var Queryable_1 = require("./Queryable");
var Transaction_1 = require("./Transaction");
var util_1 = require("./util");
/**
 * Apollo-specific interface to the cache.
 */
var Hermes = /** @class */ (function (_super) {
    tslib_1.__extends(Hermes, _super);
    function Hermes(configuration) {
        var _this = _super.call(this) || this;
        _this._queryable = new Cache_1.Cache(configuration);
        return _this;
    }
    // TODO (yuisu): data can be typed better with update of ApolloCache API
    Hermes.prototype.restore = function (data, migrationMap, verifyOptions) {
        var verifyQuery = verifyOptions && util_1.buildRawOperationFromQuery(verifyOptions.query, verifyOptions.variables);
        this._queryable.restore(data, migrationMap, verifyQuery);
        return this;
    };
    // TODO (yuisu): return can be typed better with update of ApolloCache API
    Hermes.prototype.extract = function (optimistic, pruneOptions) {
        if (optimistic === void 0) { optimistic = false; }
        var pruneQuery = pruneOptions && util_1.buildRawOperationFromQuery(pruneOptions.query, pruneOptions.variables);
        return this._queryable.extract(optimistic, pruneQuery);
    };
    Hermes.prototype.reset = function () {
        return this._queryable.reset();
    };
    Hermes.prototype.removeOptimistic = function (id) {
        this._queryable.rollback(id);
    };
    Hermes.prototype.performTransaction = function (transaction) {
        this._queryable.transaction(function (t) { return transaction(new Transaction_1.ApolloTransaction(t)); });
    };
    Hermes.prototype.recordOptimisticTransaction = function (transaction, id) {
        this._queryable.transaction(id, function (t) { return transaction(new Transaction_1.ApolloTransaction(t)); });
    };
    Hermes.prototype.watch = function (options) {
        var query = util_1.buildRawOperationFromQuery(options.query, options.variables, options.rootId);
        return this._queryable.watch(query, options.callback);
    };
    Hermes.prototype.getCurrentCacheSnapshot = function () {
        return this._queryable.getSnapshot();
    };
    return Hermes;
}(Queryable_1.ApolloQueryable));
exports.Hermes = Hermes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVybWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiSGVybWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFJQSxrQ0FBK0M7QUFLL0MseUNBQThDO0FBQzlDLDZDQUFrRDtBQUNsRCwrQkFBb0Q7QUFFcEQ7O0dBRUc7QUFDSDtJQUE0QixrQ0FBOEI7SUFJeEQsZ0JBQVksYUFBMEM7UUFBdEQsWUFDRSxpQkFBTyxTQUVSO1FBREMsS0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGFBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQzs7SUFDN0MsQ0FBQztJQUVELHdFQUF3RTtJQUN4RSx3QkFBTyxHQUFQLFVBQVEsSUFBUyxFQUFFLFlBQTJCLEVBQUUsYUFBMEM7UUFDeEYsSUFBTSxXQUFXLEdBQUcsYUFBYSxJQUFJLGlDQUEwQixDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDekQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsMEVBQTBFO0lBQzFFLHdCQUFPLEdBQVAsVUFBUSxVQUEyQixFQUFFLFlBQXlDO1FBQXRFLDJCQUFBLEVBQUEsa0JBQTJCO1FBQ2pDLElBQU0sVUFBVSxHQUFHLFlBQVksSUFBSSxpQ0FBMEIsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxRyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsc0JBQUssR0FBTDtRQUNFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRUQsaUNBQWdCLEdBQWhCLFVBQWlCLEVBQVU7UUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELG1DQUFrQixHQUFsQixVQUFtQixXQUF1QztRQUN4RCxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFdBQVcsQ0FBQyxJQUFJLCtCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQXJDLENBQXFDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsNENBQTJCLEdBQTNCLFVBQTRCLFdBQXVDLEVBQUUsRUFBVTtRQUM3RSxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxXQUFXLENBQUMsSUFBSSwrQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFyQyxDQUFxQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELHNCQUFLLEdBQUwsVUFBTSxPQUFvQztRQUN4QyxJQUFNLEtBQUssR0FBRyxpQ0FBMEIsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNGLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsd0NBQXVCLEdBQXZCO1FBQ0UsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQyxBQTlDRCxDQUE0QiwyQkFBZSxHQThDMUM7QUE5Q1ksd0JBQU0ifQ==