import { Cache as CacheInterface } from '@apollo/client/core';

import { CacheSnapshot } from './CacheSnapshot';
import { CacheTransaction } from './CacheTransaction';
import { CacheContext } from './context';
import { UnsatisfiedCacheError } from './errors';
import { GraphSnapshot } from './GraphSnapshot';
import {
  extract,
  migrate,
  MigrationMap,
  prune,
  QueryObserver,
  read,
  restore
} from './operations';
import { QueryResult } from './operations/read';
import { OptimisticUpdateQueue } from './OptimisticUpdateQueue';
import { JsonObject } from './primitive';
import { Queryable } from './Queryable';
import { ChangeId, NodeId, RawOperation, Serializable } from './schema';
import { DocumentNode, setsHaveSomeIntersection } from './util';

export { MigrationMap };
export type TransactionCallback = (transaction: CacheTransaction) => void;

/**
 * The Hermes cache.
 *
 * @see https://github.com/apollographql/apollo-client/issues/1971
 * @see https://github.com/apollographql/apollo-client/blob/2.0-alpha/src/data/cache.ts
 */
export class Cache implements Queryable {
  /** The cache-wide configuration. */
  private _context: CacheContext;

  /** The current version of the cache. */
  private _snapshot: CacheSnapshot;

  /** All active query observers. */
  private _observers: QueryObserver[] = [];

  constructor(config?: CacheContext.Configuration) {
    const initialGraphSnapshot = new GraphSnapshot();
    this._snapshot = new CacheSnapshot(
      initialGraphSnapshot,
      initialGraphSnapshot,
      new OptimisticUpdateQueue()
    );
    this._context = new CacheContext(config);
  }

  transformDocument(document: DocumentNode): DocumentNode {
    return this._context.transformDocument(document);
  }

  restore(
    data: Serializable.GraphSnapshot,
    migrationMap?: MigrationMap,
    verifyQuery?: RawOperation
  ) {
    const { cacheSnapshot, editedNodeIds } = restore(data, this._context);
    const migrated = migrate(cacheSnapshot, migrationMap);
    if (
      verifyQuery &&
      !read(this._context, verifyQuery, migrated.baseline, false).complete
    ) {
      throw new UnsatisfiedCacheError(
        `Restored cache cannot satisfy the verification query`
      );
    }
    this._setSnapshot(migrated, editedNodeIds);
  }

  extract(
    optimistic: boolean,
    pruneQuery?: RawOperation
  ): Serializable.GraphSnapshot {
    const cacheSnapshot = optimistic
      ? this._snapshot.optimistic
      : this._snapshot.baseline;
    return extract(
      pruneQuery
        ? prune(this._context, cacheSnapshot, pruneQuery).snapshot
        : cacheSnapshot,
      this._context
    );
  }

  /**
   * Reads the selection expressed by a query from the cache.
   *
   * TODO: Can we drop non-optimistic reads?
   * https://github.com/apollographql/apollo-client/issues/1971#issuecomment-319402170
   */
  read(query: RawOperation, optimistic?: boolean): QueryResult {
    // TODO: Can we drop non-optimistic reads?
    // https://github.com/apollographql/apollo-client/issues/1971#issuecomment-319402170
    return read(
      this._context,
      query,
      optimistic ? this._snapshot.optimistic : this._snapshot.baseline
    );
  }

  /**
   * Retrieves the current value of the entity identified by `id`.
   */
  getEntity(id: NodeId) {
    return this._snapshot.optimistic.getNodeData(id);
  }

  /**
   * Registers a callback that should be triggered any time the nodes selected
   * by a particular query have changed.
   */
  watch(
    query: RawOperation,
    callback: CacheInterface.WatchCallback
  ): () => void {
    const observer = new QueryObserver(
      this._context,
      query,
      this._snapshot.optimistic,
      callback
    );
    this._observers.push(observer);

    return () => this._removeObserver(observer);
  }

  /**
   * Writes values for a selection to the cache.
   */
  write(query: RawOperation, payload: JsonObject): void {
    this.transaction(t => t.write(query, payload));
  }

  /**
   * Allows the caller to perform a set of changes to the cache in a
   * transactional manner.
   *
   * If a changeId is provided, the transaction will be recorded as an
   * optimistic update.
   *
   * Returns whether the transaction was successful.
   */
  transaction(callback: TransactionCallback): boolean;
  transaction(
    changeIdOrCallback: ChangeId,
    callback: TransactionCallback
  ): boolean;
  transaction(
    changeIdOrCallback: ChangeId | TransactionCallback,
    callback?: TransactionCallback
  ): boolean {
    const { tracer } = this._context;

    let changeId;
    if (typeof callback !== 'function') {
      callback = changeIdOrCallback as TransactionCallback;
    } else {
      changeId = changeIdOrCallback as ChangeId;
    }

    let tracerContext;
    if (tracer.transactionStart) {
      tracerContext = tracer.transactionStart();
    }

    const transaction = new CacheTransaction(
      this._context,
      this._snapshot,
      changeId
    );
    try {
      callback(transaction);
    } catch (error) {
      if (tracer.transactionEnd) {
        if (error instanceof Error) {
          tracer.transactionEnd(error.toString(), tracerContext);
        } else {
          tracer.transactionEnd('unknown error', tracerContext);
        }
      }
      return false;
    }

    const { snapshot, editedNodeIds } = transaction.commit();
    this._setSnapshot(snapshot, editedNodeIds);

    if (tracer.transactionEnd) {
      tracer.transactionEnd(undefined, tracerContext);
    }

    return true;
  }

  /**
   * Roll back a previously enqueued optimistic update.
   */
  rollback(changeId: ChangeId) {
    this.transaction(t => t.rollback(changeId));
  }

  getSnapshot(): CacheSnapshot {
    return this._snapshot;
  }

  /**
   * Resets all data tracked by the cache.
   */
  async reset(): Promise<void> {
    const allIds = new Set(this._snapshot.optimistic.allNodeIds());

    const baseline = new GraphSnapshot();
    const optimistic = baseline;
    const optimisticQueue = new OptimisticUpdateQueue();

    this._setSnapshot(
      new CacheSnapshot(baseline, optimistic, optimisticQueue),
      allIds
    );
  }

  // Internal

  /**
   * Unregister an observer.
   */
  private _removeObserver(observer: QueryObserver): void {
    const index = this._observers.findIndex(o => o === observer);
    if (index < 0) return;
    this._observers.splice(index, 1);
  }

  /**
   * Point the cache to a new snapshot, and let observers know of the change.
   * Call onChange callback if one exist to notify cache users of any change.
   */
  private _setSnapshot(
    snapshot: CacheSnapshot,
    editedNodeIds: Set<NodeId>
  ): void {
    const lastSnapshot = this._snapshot;
    this._snapshot = snapshot;

    if (lastSnapshot) {
      const { strict } = this._context;
      _copyUnaffectedCachedReads(
        lastSnapshot.baseline,
        snapshot.baseline,
        editedNodeIds,
        strict
      );
      // Don't bother copying the optimistic read cache unless it's actually a
      // different snapshot.
      if (snapshot.optimistic !== snapshot.baseline) {
        _copyUnaffectedCachedReads(
          lastSnapshot.optimistic,
          snapshot.optimistic,
          editedNodeIds,
          strict
        );
      }
    }

    let tracerContext;
    if (this._context.tracer.broadcastStart) {
      tracerContext = this._context.tracer.broadcastStart({
        snapshot,
        editedNodeIds
      });
    }

    for (const observer of this._observers) {
      observer.consumeChanges(snapshot.optimistic, editedNodeIds);
    }

    if (this._context.onChange) {
      this._context.onChange(this._snapshot, editedNodeIds);
    }

    if (this._context.tracer.broadcastEnd) {
      this._context.tracer.broadcastEnd(
        { snapshot, editedNodeIds },
        tracerContext
      );
    }
  }
}

/**
 * Preserves cached reads for any queries that do not overlap with the edited
 * entities in the new snapshot.
 *
 * TODO: Can we special case ROOT_QUERY somehow; any fields hanging off of it
 * tend to aggressively bust the cache, when we don't really mean to.
 */
function _copyUnaffectedCachedReads(
  lastSnapshot: GraphSnapshot,
  nextSnapshot: GraphSnapshot,
  editedNodeIds: Set<NodeId>,
  strict: boolean
) {
  for (const [operation, result] of lastSnapshot.readCache) {
    const { complete, entityIds, dynamicNodeIds } = result;
    // We don't care about incomplete results.
    if (!complete) continue;

    // If we're not in strict mode; we can carry completeness forward (and
    // not bother copying results forward, as its cheaper to just fetch again).
    if (!strict) {
      nextSnapshot.readCache.set(operation, { complete: true });
      continue;
    }

    // Nor queries where we don't know which nodes were affected.
    if (!entityIds) continue;

    // If any nodes in the cached read were edited, do not copy.
    if (entityIds && setsHaveSomeIntersection(editedNodeIds, entityIds))
      continue;
    // If any dynamic nodes were edited, also do not copy.
    if (
      dynamicNodeIds &&
      setsHaveSomeIntersection(editedNodeIds, dynamicNodeIds)
    )
      continue;

    nextSnapshot.readCache.set(operation, result);
  }
}
