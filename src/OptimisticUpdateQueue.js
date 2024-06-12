"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimisticUpdateQueue = void 0;
var tslib_1 = require("tslib");
var operations_1 = require("./operations");
/**
 * Manages a queue of optimistic updates, and the values they express on top of
 * existing cache snapshots.
 */
var OptimisticUpdateQueue = /** @class */ (function () {
    function OptimisticUpdateQueue(
    /**
     * The queue of updates, in order of oldest (lowest precedence) to newest
     * (highest precedence).
     */
    _updates) {
        if (_updates === void 0) { _updates = []; }
        this._updates = _updates;
    }
    /**
     * Appends a new optimistic update to the queue.
     */
    OptimisticUpdateQueue.prototype.enqueue = function (id, deltas) {
        // TODO: Assert unique change ids.
        return new OptimisticUpdateQueue(tslib_1.__spread(this._updates, [{ id: id, deltas: deltas }]));
    };
    /**
     * Removes an update from the queue.
     */
    OptimisticUpdateQueue.prototype.remove = function (id) {
        return new OptimisticUpdateQueue(this._updates.filter(function (u) { return u.id !== id; }));
    };
    /**
     * Whether there are any updates to apply.
     */
    OptimisticUpdateQueue.prototype.hasUpdates = function () {
        return this._updates.length > 0;
    };
    /**
     * Applies the current optimistic updates to a snapshot.
     */
    OptimisticUpdateQueue.prototype.apply = function (context, snapshot) {
        var e_1, _a, e_2, _b;
        var editor = new operations_1.SnapshotEditor(context, snapshot);
        try {
            for (var _c = tslib_1.__values(this._updates), _d = _c.next(); !_d.done; _d = _c.next()) {
                var update = _d.value;
                try {
                    for (var _e = (e_2 = void 0, tslib_1.__values(update.deltas)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var delta = _f.value;
                        editor.mergePayload(delta.query, delta.payload);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
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
        return editor.commit();
    };
    return OptimisticUpdateQueue;
}());
exports.OptimisticUpdateQueue = OptimisticUpdateQueue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3B0aW1pc3RpY1VwZGF0ZVF1ZXVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiT3B0aW1pc3RpY1VwZGF0ZVF1ZXVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSwyQ0FBOEM7QUFZOUM7OztHQUdHO0FBQ0g7SUFFRTtJQUNFOzs7T0FHRztJQUNLLFFBQW1DO1FBQW5DLHlCQUFBLEVBQUEsV0FBVyxFQUF3QjtRQUFuQyxhQUFRLEdBQVIsUUFBUSxDQUEyQjtJQUMxQyxDQUFDO0lBRUo7O09BRUc7SUFDSCx1Q0FBTyxHQUFQLFVBQVEsRUFBWSxFQUFFLE1BQXVCO1FBQzNDLGtDQUFrQztRQUNsQyxPQUFPLElBQUkscUJBQXFCLGtCQUFLLElBQUksQ0FBQyxRQUFRLEdBQUUsRUFBRSxFQUFFLElBQUEsRUFBRSxNQUFNLFFBQUEsRUFBRSxHQUFFLENBQUM7SUFDdkUsQ0FBQztJQUVEOztPQUVHO0lBQ0gsc0NBQU0sR0FBTixVQUFPLEVBQVk7UUFDakIsT0FBTyxJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQVgsQ0FBVyxDQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQ7O09BRUc7SUFDSCwwQ0FBVSxHQUFWO1FBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gscUNBQUssR0FBTCxVQUFNLE9BQXFCLEVBQUUsUUFBdUI7O1FBQ2xELElBQU0sTUFBTSxHQUFHLElBQUksMkJBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7O1lBQ3JELEtBQXFCLElBQUEsS0FBQSxpQkFBQSxJQUFJLENBQUMsUUFBUSxDQUFBLGdCQUFBLDRCQUFFO2dCQUEvQixJQUFNLE1BQU0sV0FBQTs7b0JBQ2YsS0FBb0IsSUFBQSxvQkFBQSxpQkFBQSxNQUFNLENBQUMsTUFBTSxDQUFBLENBQUEsZ0JBQUEsNEJBQUU7d0JBQTlCLElBQU0sS0FBSyxXQUFBO3dCQUNkLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBcUIsQ0FBQyxDQUFDO3FCQUMvRDs7Ozs7Ozs7O2FBQ0Y7Ozs7Ozs7OztRQUVELE9BQU8sTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFSCw0QkFBQztBQUFELENBQUMsQUE5Q0QsSUE4Q0M7QUE5Q1ksc0RBQXFCIn0=