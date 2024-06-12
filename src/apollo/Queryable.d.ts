import { ApolloCache, Cache, DataProxy, Reference } from '@apollo/client/core';
import { Queryable } from '../Queryable';
import { DocumentNode } from '../util';
/**
 * Apollo-specific interface to the cache.
 */
export declare abstract class ApolloQueryable<TSerialized> extends ApolloCache<TSerialized> {
    /** The underlying Hermes cache. */
    protected abstract _queryable: Queryable;
    diff<T>(options: Cache.DiffOptions): Cache.DiffResult<T | any>;
    read(options: Cache.ReadOptions): any;
    readQuery<QueryType, TVariables = any>(options: DataProxy.Query<TVariables, QueryType>, optimistic?: true): QueryType;
    readFragment<FragmentType, TVariables = any>(options: DataProxy.Fragment<TVariables, FragmentType>, optimistic?: true): FragmentType | null;
    write(options: Cache.WriteOptions): Reference | undefined;
    writeQuery<TData = any, TVariables = any>(options: Cache.WriteQueryOptions<TData, TVariables>): Reference | undefined;
    writeFragment<TData = any, TVariables = any>(options: Cache.WriteFragmentOptions<TData, TVariables>): Reference | undefined;
    transformDocument(doc: DocumentNode): DocumentNode;
    transformForLink(document: DocumentNode): DocumentNode;
    evict(_options: Cache.EvictOptions): boolean;
}
