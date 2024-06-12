"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryObserver = void 0;
var tslib_1 = require("tslib");
var read_1 = require("./read");
/**
 * Observes a query, triggering a callback when nodes within it have changed.
 *
 * @internal
 */
var QueryObserver = /** @class */ (function () {
    function QueryObserver(context, query, snapshot, callback) {
        this._context = context;
        this._query = query;
        this._callback = callback;
        this._update(snapshot);
    }
    /**
     * We expect the cache to tell us whenever there is a new snapshot, and which
     * nodes have changed.
     */
    QueryObserver.prototype.consumeChanges = function (snapshot, changedNodeIds) {
        if (!this._hasUpdate(changedNodeIds))
            return;
        this._update(snapshot);
    };
    /**
     * Whether there are any changed nodes that overlap with the ones we're
     * observing.
     */
    QueryObserver.prototype._hasUpdate = function (_changedNodeIds) {
        var e_1, _a;
        var _b = this._result, complete = _b.complete, entityIds = _b.entityIds, dynamicNodeIds = _b.dynamicNodeIds;
        if (!complete)
            return true;
        // We can't know if we have no ids to test against. Favor updating.
        if (!entityIds)
            return true;
        try {
            for (var _changedNodeIds_1 = tslib_1.__values(_changedNodeIds), _changedNodeIds_1_1 = _changedNodeIds_1.next(); !_changedNodeIds_1_1.done; _changedNodeIds_1_1 = _changedNodeIds_1.next()) {
                var nodeId = _changedNodeIds_1_1.value;
                if (entityIds.has(nodeId))
                    return true;
                if (dynamicNodeIds && dynamicNodeIds.has(nodeId))
                    return true;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_changedNodeIds_1_1 && !_changedNodeIds_1_1.done && (_a = _changedNodeIds_1.return)) _a.call(_changedNodeIds_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
    /**
     * Re-query and trigger the callback.
     */
    QueryObserver.prototype._update = function (snapshot) {
        // Note that if strict mode is disabled, we _do not_ ask for node ids.
        //
        // This effectively circumvents the logic in _hasUpdate (entityIds will be
        // undefined).
        this._result = read_1.read(this._context, this._query, snapshot, this._context.strict);
        this._callback(this._result);
    };
    return QueryObserver;
}());
exports.QueryObserver = QueryObserver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVlcnlPYnNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlF1ZXJ5T2JzZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLCtCQUEyQztBQUkzQzs7OztHQUlHO0FBQ0g7SUFXRSx1QkFBWSxPQUFxQixFQUFFLEtBQW1CLEVBQUUsUUFBdUIsRUFBRSxRQUFrQjtRQUNqRyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUUxQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxzQ0FBYyxHQUFkLFVBQWUsUUFBdUIsRUFBRSxjQUEyQjtRQUNqRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7WUFBRSxPQUFPO1FBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGtDQUFVLEdBQWxCLFVBQW1CLGVBQTRCOztRQUN2QyxJQUFBLEtBQTBDLElBQUksQ0FBQyxPQUFRLEVBQXJELFFBQVEsY0FBQSxFQUFFLFNBQVMsZUFBQSxFQUFFLGNBQWMsb0JBQWtCLENBQUM7UUFDOUQsSUFBSSxDQUFDLFFBQVE7WUFBRSxPQUFPLElBQUksQ0FBQztRQUMzQixtRUFBbUU7UUFDbkUsSUFBSSxDQUFDLFNBQVM7WUFBRSxPQUFPLElBQUksQ0FBQzs7WUFFNUIsS0FBcUIsSUFBQSxvQkFBQSxpQkFBQSxlQUFlLENBQUEsZ0RBQUEsNkVBQUU7Z0JBQWpDLElBQU0sTUFBTSw0QkFBQTtnQkFDZixJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO29CQUFFLE9BQU8sSUFBSSxDQUFDO2dCQUN2QyxJQUFJLGNBQWMsSUFBSSxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFBRSxPQUFPLElBQUksQ0FBQzthQUMvRDs7Ozs7Ozs7O1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQ7O09BRUc7SUFDSywrQkFBTyxHQUFmLFVBQWdCLFFBQXVCO1FBQ3JDLHNFQUFzRTtRQUN0RSxFQUFFO1FBQ0YsMEVBQTBFO1FBQzFFLGNBQWM7UUFDZCxJQUFJLENBQUMsT0FBTyxHQUFHLFdBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVILG9CQUFDO0FBQUQsQ0FBQyxBQTFERCxJQTBEQztBQTFEWSxzQ0FBYSJ9