import { JsonObject, NestedArray, NestedObject } from '../primitive';
import { NodeId } from '../schema';
import { NodeReference, NodeSnapshot } from './NodeSnapshot';
export { NestedArray, NestedObject };
/**
 * Maintains a reference to a single entity within the cached graph, and any
 * bookkeeping metadata associated with it.
 *
 * Note that this houses all the _static_ values for an entity, but none of the
 * parameterized values that may also have been queried for it.
 */
export declare class EntitySnapshot implements NodeSnapshot {
    /** A reference to the entity this snapshot is about. */
    data?: JsonObject | undefined;
    inbound?: Map<NodeId, NodeReference>;
    outbound?: Map<NodeId, NodeReference>;
    constructor(
    /** A reference to the entity this snapshot is about. */
    data?: JsonObject | undefined, 
    /** Other node snapshots that point to this one. */
    inbound?: NodeReference[], 
    /** The node snapshots that this one points to. */
    outbound?: NodeReference[]);
}
