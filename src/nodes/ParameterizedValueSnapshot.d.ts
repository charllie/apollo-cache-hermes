import { NestedArray, NestedObject } from '../primitive';
import { NodeId } from '../schema';
import { NodeReference, NodeSnapshot } from './NodeSnapshot';
export { NestedArray, NestedObject };
/**
 * Maintains a reference to the value of a specific parameterized field
 * contained within some other node.
 *
 * These values are stored outside of the entity that contains them, as the
 * entity node is reserved for static values.  At read time, these values are
 * overlaid on top of the static values of the entity that contains them.
 */
export declare class ParameterizedValueSnapshot implements NodeSnapshot {
    /** A reference to the entity this snapshot is about. */
    data?: string | number | boolean | NestedArray<import("../primitive").JsonScalar> | NestedObject<import("../primitive").JsonScalar> | null | undefined;
    inbound?: Map<NodeId, NodeReference>;
    outbound?: Map<NodeId, NodeReference>;
    constructor(
    /** A reference to the entity this snapshot is about. */
    data?: string | number | boolean | NestedArray<import("../primitive").JsonScalar> | NestedObject<import("../primitive").JsonScalar> | null | undefined, 
    /** Other node snapshots that point to this one. */
    inbound?: NodeReference[], 
    /** The node snapshots that this one points to. */
    outbound?: NodeReference[]);
}
