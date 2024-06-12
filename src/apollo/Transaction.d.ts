import { Cache, Transaction } from '@apollo/client/core';
import { CacheTransaction } from '../CacheTransaction';
import { GraphSnapshot } from '../GraphSnapshot';
import { JsonValue, PathPart } from '../primitive';
import { NodeId } from '../schema';
import { DocumentNode } from '../util';
import { ApolloQueryable } from './Queryable';
/**
 * Apollo-specific transaction interface.
 */
export declare class ApolloTransaction extends ApolloQueryable<GraphSnapshot> {
    /** The underlying transaction. */
    protected _queryable: CacheTransaction;
    constructor(
    /** The underlying transaction. */
    _queryable: CacheTransaction);
    reset(): Promise<void>;
    removeOptimistic(_id: string): void;
    performTransaction(transaction: Transaction<GraphSnapshot>): void;
    recordOptimisticTransaction(_transaction: Transaction<GraphSnapshot>, _id: string): void;
    watch(_query: Cache.WatchOptions): () => void;
    restore(): any;
    extract(): any;
    updateListOfReferences: (containerId: NodeId, pathToParameterizedField: PathPart[], { writeFragment, writeFragmentName }: {
        writeFragment: DocumentNode;
        writeFragmentName?: string | undefined;
    }, { readFragment, readFragmentName }: {
        readFragment: DocumentNode;
        readFragmentName?: string | undefined;
    }, updateFieldCallback: (previousList: JsonValue[], fieldArgs?: {
        [argName: string]: string;
    } | undefined) => any) => void;
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
    updateParameterizedReferences(containerId: NodeId, pathToParameterizedField: PathPart[], { writeFragment, writeFragmentName }: {
        writeFragment: DocumentNode;
        writeFragmentName?: string;
    }, { readFragment, readFragmentName }: {
        readFragment: DocumentNode;
        readFragmentName?: string;
    }, updateFieldCallback: (previousList: JsonValue[], fieldArgs?: {
        [argName: string]: string;
    }) => any): void;
}
