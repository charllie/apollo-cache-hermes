"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheTransaction = void 0;
var tslib_1 = require("tslib");
var Transaction_1 = require("./apollo/Transaction");
var CacheSnapshot_1 = require("./CacheSnapshot");
var nodes_1 = require("./nodes");
var operations_1 = require("./operations");
var schema_1 = require("./schema");
var util_1 = require("./util");
/**
 * Collects a set of edits against a version of the cache, eventually committing
 * them in the form of a new cache snapshot.
 *
 * If a ChangeId is provided, edits will be made on top of the optimistic state
 * (an optimistic update).  Otherwise edits are made against the baseline state.
 */
var CacheTransaction = /** @class */ (function () {
    function CacheTransaction(_context, _snapshot, _optimisticChangeId) {
        this._context = _context;
        this._snapshot = _snapshot;
        this._optimisticChangeId = _optimisticChangeId;
        /** The set of nodes edited throughout the transaction. */
        this._editedNodeIds = new Set();
        /** All edits made throughout the transaction. */
        this._deltas = [];
        /** All queries written during the transaction. */
        this._writtenQueries = new Set();
        this._parentSnapshot = _snapshot;
    }
    CacheTransaction.prototype.isOptimisticTransaction = function () {
        return this._optimisticChangeId ? true : undefined;
    };
    CacheTransaction.prototype.transformDocument = function (document) {
        return this._context.transformDocument(document);
    };
    /**
     * Executes reads against the current values in the transaction.
     */
    CacheTransaction.prototype.read = function (query) {
        return operations_1.read(this._context, query, this._optimisticChangeId ? this._snapshot.optimistic : this._snapshot.baseline);
    };
    /**
     * Merges a payload with the current values in the transaction.
     *
     * If this is an optimistic transaction, edits will be made directly on top of
     * any previous optimistic values.  Otherwise, edits will be made to the
     * baseline state (and any optimistic updates will be replayed over it).
     */
    CacheTransaction.prototype.write = function (query, payload) {
        if (this._optimisticChangeId) {
            this._writeOptimistic(query, payload);
        }
        else {
            this._writeBaseline(query, payload);
        }
    };
    /**
     * Roll back a previously enqueued optimistic update.
     */
    CacheTransaction.prototype.rollback = function (changeId) {
        var current = this._snapshot;
        var optimisticQueue = current.optimisticQueue.remove(changeId);
        current.optimisticQueue = optimisticQueue;
        var optimistic = this._buildOptimisticSnapshot(current.baseline);
        // Invalidate all IDs from the soon-to-be previous optimistic snapshot,
        // since we don't know which IDs were changed by the one we're rolling back.
        var allIds = new Set(current.optimistic.allNodeIds());
        util_1.addToSet(this._editedNodeIds, allIds);
        this._snapshot = new CacheSnapshot_1.CacheSnapshot(current.baseline, optimistic, optimisticQueue);
    };
    /**
     * Complete the transaction, returning the new snapshot and the ids of any
     * nodes that were edited.
     */
    CacheTransaction.prototype.commit = function () {
        this._triggerEntityUpdaters();
        var snapshot = this._snapshot;
        if (this._optimisticChangeId) {
            snapshot = new CacheSnapshot_1.CacheSnapshot(snapshot.baseline, snapshot.optimistic, snapshot.optimisticQueue.enqueue(this._optimisticChangeId, this._deltas));
        }
        return { snapshot: snapshot, editedNodeIds: this._editedNodeIds, writtenQueries: this._writtenQueries };
    };
    CacheTransaction.prototype.getPreviousNodeSnapshot = function (nodeId) {
        var prevSnapshot = this._optimisticChangeId ? this._parentSnapshot.optimistic : this._parentSnapshot.baseline;
        return prevSnapshot.getNodeSnapshot(nodeId);
    };
    CacheTransaction.prototype.getCurrentNodeSnapshot = function (nodeId) {
        var currentSnapshot = this._optimisticChangeId ? this._snapshot.optimistic : this._snapshot.baseline;
        return currentSnapshot.getNodeSnapshot(nodeId);
    };
    /**
     * Emits change events for any callbacks configured via
     * CacheContext#entityUpdaters.
     */
    CacheTransaction.prototype._triggerEntityUpdaters = function () {
        var e_1, _a, e_2, _b;
        var entityUpdaters = this._context.entityUpdaters;
        if (!Object.keys(entityUpdaters).length)
            return;
        // Capture a static set of nodes, as the updaters may add to _editedNodeIds.
        var nodesToEmit = [];
        try {
            for (var _c = tslib_1.__values(this._editedNodeIds), _d = _c.next(); !_d.done; _d = _c.next()) {
                var nodeId = _d.value;
                var node = this.getCurrentNodeSnapshot(nodeId);
                var previous = this.getPreviousNodeSnapshot(nodeId);
                // One of them may be undefined; but we are guaranteed that both represent
                // the same entity.
                var either = node || previous;
                if (!(either instanceof nodes_1.EntitySnapshot))
                    continue; // Only entities
                var typeName = util_1.isObject(either.data) && either.data.__typename;
                if (!typeName && nodeId === schema_1.StaticNodeId.QueryRoot) {
                    typeName = 'Query';
                }
                if (!typeName)
                    continue; // Must have a typename for now.
                var updater = entityUpdaters[typeName];
                if (!updater)
                    continue;
                nodesToEmit.push({
                    updater: updater,
                    node: node && node.data,
                    previous: previous && previous.data,
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!nodesToEmit.length)
            return;
        // TODO: This is weirdly the only place where we assume an Apollo interface.
        // Can we clean this up? :(
        var dataProxy = new Transaction_1.ApolloTransaction(this);
        try {
            for (var nodesToEmit_1 = tslib_1.__values(nodesToEmit), nodesToEmit_1_1 = nodesToEmit_1.next(); !nodesToEmit_1_1.done; nodesToEmit_1_1 = nodesToEmit_1.next()) {
                var _e = nodesToEmit_1_1.value, updater = _e.updater, node = _e.node, previous = _e.previous;
                updater(dataProxy, node, previous);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (nodesToEmit_1_1 && !nodesToEmit_1_1.done && (_b = nodesToEmit_1.return)) _b.call(nodesToEmit_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    /**
     * Merge a payload with the baseline snapshot.
     */
    CacheTransaction.prototype._writeBaseline = function (query, payload) {
        var current = this._snapshot;
        var _a = operations_1.write(this._context, current.baseline, query, payload), baseline = _a.snapshot, editedNodeIds = _a.editedNodeIds, writtenQueries = _a.writtenQueries;
        util_1.addToSet(this._editedNodeIds, editedNodeIds);
        util_1.addToSet(this._writtenQueries, writtenQueries);
        var optimistic = this._buildOptimisticSnapshot(baseline);
        this._snapshot = new CacheSnapshot_1.CacheSnapshot(baseline, optimistic, current.optimisticQueue);
    };
    /**
     * Given a baseline snapshot, build an optimistic one from it.
     */
    CacheTransaction.prototype._buildOptimisticSnapshot = function (baseline) {
        var optimisticQueue = this._snapshot.optimisticQueue;
        if (!optimisticQueue.hasUpdates())
            return baseline;
        var _a = optimisticQueue.apply(this._context, baseline), snapshot = _a.snapshot, editedNodeIds = _a.editedNodeIds;
        util_1.addToSet(this._editedNodeIds, editedNodeIds);
        return snapshot;
    };
    /**
     * Merge a payload with the optimistic snapshot.
     */
    CacheTransaction.prototype._writeOptimistic = function (query, payload) {
        this._deltas.push({ query: query, payload: payload });
        var _a = operations_1.write(this._context, this._snapshot.optimistic, query, payload), optimistic = _a.snapshot, editedNodeIds = _a.editedNodeIds, writtenQueries = _a.writtenQueries;
        util_1.addToSet(this._writtenQueries, writtenQueries);
        util_1.addToSet(this._editedNodeIds, editedNodeIds);
        this._snapshot = new CacheSnapshot_1.CacheSnapshot(this._snapshot.baseline, optimistic, this._snapshot.optimisticQueue);
    };
    return CacheTransaction;
}());
exports.CacheTransaction = CacheTransaction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FjaGVUcmFuc2FjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNhY2hlVHJhbnNhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLG9EQUF5RDtBQUN6RCxpREFBZ0Q7QUFHaEQsaUNBQXVEO0FBQ3ZELDJDQUEyQztBQUczQyxtQ0FBMEc7QUFDMUcsK0JBQTBEO0FBRTFEOzs7Ozs7R0FNRztBQUNIO0lBY0UsMEJBQ1UsUUFBc0IsRUFDdEIsU0FBd0IsRUFDeEIsbUJBQThCO1FBRjlCLGFBQVEsR0FBUixRQUFRLENBQWM7UUFDdEIsY0FBUyxHQUFULFNBQVMsQ0FBZTtRQUN4Qix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQVc7UUFmeEMsMERBQTBEO1FBQ2xELG1CQUFjLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztRQUUzQyxpREFBaUQ7UUFDekMsWUFBTyxHQUFvQixFQUFFLENBQUM7UUFFdEMsa0RBQWtEO1FBQzFDLG9CQUFlLEdBQUcsSUFBSSxHQUFHLEVBQXFCLENBQUM7UUFVckQsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUM7SUFDbkMsQ0FBQztJQUVELGtEQUF1QixHQUF2QjtRQUNFLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsNENBQWlCLEdBQWpCLFVBQWtCLFFBQXNCO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCwrQkFBSSxHQUFKLFVBQUssS0FBbUI7UUFDdEIsT0FBTyxpQkFBSSxDQUNULElBQUksQ0FBQyxRQUFRLEVBQ2IsS0FBSyxFQUNMLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FB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