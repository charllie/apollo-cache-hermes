"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
var tslib_1 = require("tslib");
var CacheSnapshot_1 = require("./CacheSnapshot");
var CacheTransaction_1 = require("./CacheTransaction");
var context_1 = require("./context");
var GraphSnapshot_1 = require("./GraphSnapshot");
var operations_1 = require("./operations");
var OptimisticUpdateQueue_1 = require("./OptimisticUpdateQueue");
var util_1 = require("./util");
/**
 * The Hermes cache.
 *
 * @see https://github.com/apollographql/apollo-client/issues/1971
 * @see https://github.com/apollographql/apollo-client/blob/2.0-alpha/src/data/cache.ts
 */
var Cache = /** @class */ (function () {
    function Cache(config) {
        /** All active query observers. */
        this._observers = [];
        var initialGraphSnapshot = new GraphSnapshot_1.GraphSnapshot();
        this._snapshot = new CacheSnapshot_1.CacheSnapshot(initialGraphSnapshot, initialGraphSnapshot, new OptimisticUpdateQueue_1.OptimisticUpdateQueue());
        this._context = new context_1.CacheContext(config);
    }
    Cache.prototype.transformDocument = function (document) {
        return this._context.transformDocument(document);
    };
    Cache.prototype.restore = function (data, migrationMap, verifyQuery) {
        var _a = operations_1.restore(data, this._context), cacheSnapshot = _a.cacheSnapshot, editedNodeIds = _a.editedNodeIds;
        var migrated = operations_1.migrate(cacheSnapshot, migrationMap);
        if (verifyQuery && !operations_1.read(this._context, verifyQuery, migrated.baseline, false).complete) {
            throw new Error("Restored cache cannot satisfy the verification query");
        }
        this._setSnapshot(migrated, editedNodeIds);
    };
    Cache.prototype.extract = function (optimistic, pruneQuery) {
        var cacheSnapshot = optimistic ? this._snapshot.optimistic : this._snapshot.baseline;
        return operations_1.extract(pruneQuery ? operations_1.prune(this._context, cacheSnapshot, pruneQuery).snapshot : cacheSnapshot, this._context);
    };
    /**
     * Reads the selection expressed by a query from the cache.
     *
     * TODO: Can we drop non-optimistic reads?
     * https://github.com/apollographql/apollo-client/issues/1971#issuecomment-319402170
     */
    Cache.prototype.read = function (query, optimistic) {
        // TODO: Can we drop non-optimistic reads?
        // https://github.com/apollographql/apollo-client/issues/1971#issuecomment-319402170
        return operations_1.read(this._context, query, optimistic ? this._snapshot.optimistic : this._snapshot.baseline);
    };
    /**
     * Retrieves the current value of the entity identified by `id`.
     */
    Cache.prototype.getEntity = function (id) {
        return this._snapshot.optimistic.getNodeData(id);
    };
    /**
     * Registers a callback that should be triggered any time the nodes selected
     * by a particular query have changed.
     */
    Cache.prototype.watch = function (query, callback) {
        var _this = this;
        var observer = new operations_1.QueryObserver(this._context, query, this._snapshot.optimistic, callback);
        this._observers.push(observer);
        return function () { return _this._removeObserver(observer); };
    };
    /**
     * Writes values for a selection to the cache.
     */
    Cache.prototype.write = function (query, payload) {
        this.transaction(function (t) { return t.write(query, payload); });
    };
    Cache.prototype.transaction = function (changeIdOrCallback, callback) {
        var tracer = this._context.tracer;
        var changeId;
        if (typeof callback !== 'function') {
            callback = changeIdOrCallback;
        }
        else {
            changeId = changeIdOrCallback;
        }
        var tracerContext;
        if (tracer.transactionStart) {
            tracerContext = tracer.transactionStart();
        }
        var transaction = new CacheTransaction_1.CacheTransaction(this._context, this._snapshot, changeId);
        try {
            callback(transaction);
        }
        catch (error) {
            if (tracer.transactionEnd) {
                tracer.transactionEnd(error.toString(), tracerContext);
            }
            return false;
        }
        var _a = transaction.commit(), snapshot = _a.snapshot, editedNodeIds = _a.editedNodeIds;
        this._setSnapshot(snapshot, editedNodeIds);
        if (tracer.transactionEnd) {
            tracer.transactionEnd(undefined, tracerContext);
        }
        return true;
    };
    /**
     * Roll back a previously enqueued optimistic update.
     */
    Cache.prototype.rollback = function (changeId) {
        this.transaction(function (t) { return t.rollback(changeId); });
    };
    Cache.prototype.getSnapshot = function () {
        return this._snapshot;
    };
    /**
     * Resets all data tracked by the cache.
     */
    Cache.prototype.reset = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var allIds, baseline, optimistic, optimisticQueue;
            return tslib_1.__generator(this, function (_a) {
                allIds = new Set(this._snapshot.optimistic.allNodeIds());
                baseline = new GraphSnapshot_1.GraphSnapshot();
                optimistic = baseline;
                optimisticQueue = new OptimisticUpdateQueue_1.OptimisticUpdateQueue();
                this._setSnapshot(new CacheSnapshot_1.CacheSnapshot(baseline, optimistic, optimisticQueue), allIds);
                return [2 /*return*/];
            });
        });
    };
    // Internal
    /**
     * Unregister an observer.
     */
    Cache.prototype._removeObserver = function (observer) {
        var index = this._observers.findIndex(function (o) { return o === observer; });
        if (index < 0)
            return;
        this._observers.splice(index, 1);
    };
    /**
     * Point the cache to a new snapshot, and let observers know of the change.
     * Call onChange callback if one exist to notify cache users of any change.
     */
    Cache.prototype._setSnapshot = function (snapshot, editedNodeIds) {
        var e_1, _a;
        var lastSnapshot = this._snapshot;
        this._snapshot = snapshot;
        if (lastSnapshot) {
            var strict = this._context.strict;
            _copyUnaffectedCachedReads(lastSnapshot.baseline, snapshot.baseline, editedNodeIds, strict);
            // Don't bother copying the optimistic read cache unless it's actually a
            // different snapshot.
            if (snapshot.optimistic !== snapshot.baseline) {
                _copyUnaffectedCachedReads(lastSnapshot.optimistic, snapshot.optimistic, editedNodeIds, strict);
            }
        }
        var tracerContext;
        if (this._context.tracer.broadcastStart) {
            tracerContext = this._context.tracer.broadcastStart({ snapshot: snapshot, editedNodeIds: editedNodeIds });
        }
        try {
            for (var _b = tslib_1.__values(this._observers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var observer = _c.value;
                observer.consumeChanges(snapshot.optimistic, editedNodeIds);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (this._context.onChange) {
            this._context.onChange(this._snapshot, editedNodeIds);
        }
        if (this._context.tracer.broadcastEnd) {
            this._context.tracer.broadcastEnd({ snapshot: snapshot, editedNodeIds: editedNodeIds }, tracerContext);
        }
    };
    return Cache;
}());
exports.Cache = Cache;
/**
 * Preserves cached reads for any queries that do not overlap with the edited
 * entities in the new snapshot.
 *
 * TODO: Can we special case ROOT_QUERY somehow; any fields hanging off of it
 * tend to aggressively bust the cache, when we don't really mean to.
 */
function _copyUnaffectedCachedReads(lastSnapshot, nextSnapshot, editedNodeIds, strict) {
    var e_2, _a;
    try {
        for (var _b = tslib_1.__values(lastSnapshot.readCache), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = tslib_1.__read(_c.value, 2), operation = _d[0], result = _d[1];
            var complete = result.complete, entityIds = result.entityIds, dynamicNodeIds = result.dynamicNodeIds;
            // We don't care about incomplete results.
            if (!complete)
                continue;
            // If we're not in strict mode; we can carry completeness forward (and
            // not bother copying results forward, as its cheaper to just fetch again).
            if (!strict) {
                nextSnapshot.readCache.set(operation, { complete: true });
                continue;
            }
            // Nor queries where we don't know which nodes were affected.
            if (!entityIds)
                continue;
            // If any nodes in the cached read were edited, do not copy.
            if (entityIds && util_1.setsHaveSomeIntersection(editedNodeIds, entityIds))
                continue;
            // If any dynamic nodes were edited, also do not copy.
            if (dynamicNodeIds && util_1.setsHaveSomeIntersection(editedNodeIds, dynamicNodeIds))
                continue;
            nextSnapshot.readCache.set(operation, result);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsaURBQWdEO0FBQ2hELHVEQUFzRDtBQUN0RCxxQ0FBeUM7QUFDekMsaURBQWdEO0FBQ2hELDJDQUFtRztBQUVuRyxpRUFBZ0U7QUFJaEUsK0JBQWdFO0FBS2hFOzs7OztHQUtHO0FBQ0g7SUFXRSxlQUFZLE1BQW1DO1FBSC9DLGtDQUFrQztRQUMxQixlQUFVLEdBQW9CLEVBQUUsQ0FBQztRQUd2QyxJQUFNLG9CQUFvQixHQUFHLElBQUksNkJBQWEsRUFBRSxDQUFDO1FBQ2pELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSw2QkFBYSxDQUFDLG9CQUFvQixFQUFFLG9CQUFvQixFQUFFLElBQUksNkNBQXFCLEVBQUUsQ0FBQyxDQUFDO1FBQzVHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxpQ0FBaUIsR0FBakIsVUFBa0IsUUFBc0I7UUFDdEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCx1QkFBTyxHQUFQLFVBQVEsSUFBZ0MsRUFBRSxZQUEyQixFQUFFLFdBQTBCO1FBQ3pGLElBQUEsS0FBbUMsb0JBQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUE3RCxhQUFhLG1CQUFBLEVBQUUsYUFBYSxtQkFBaUMsQ0FBQztRQUN0RSxJQUFNLFFBQVEsR0FBRyxvQkFBTyxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUN0RCxJQUFJLFdBQVcsSUFBSSxDQUFDLGlCQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUU7WUFDdkYsTUFBTSxJQUFJLEtB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