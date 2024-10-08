import { GraphSnapshot } from '../../../../../src/GraphSnapshot';
import {
  EntitySnapshot,
  ParameterizedValueSnapshot
} from '../../../../../src/nodes';
import { restore } from '../../../../../src/operations';
import { nodeIdForParameterizedValue } from '../../../../../src/operations/SnapshotEditor';
import { Serializable, StaticNodeId } from '../../../../../src/schema';
import {
  createGraphSnapshot,
  createStrictCacheContext
} from '../../../../helpers';

const { QueryRoot: QueryRootId } = StaticNodeId;

describe(`operations.restore`, () => {
  describe(`nested parameterized references with parameterized value`, () => {
    const parameterizedId = nodeIdForParameterizedValue(
      QueryRootId,
      ['one', 'two'],
      { id: 1 }
    );

    const nestedParameterizedId = nodeIdForParameterizedValue('31', ['four'], {
      extra: true
    });

    let restoreGraphSnapshot: GraphSnapshot,
      originalGraphSnapshot: GraphSnapshot;
    beforeAll(() => {
      const cacheContext = createStrictCacheContext();
      originalGraphSnapshot = createGraphSnapshot(
        {
          one: {
            two: {
              three: {
                id: 31,
                four: { five: 1 }
              }
            }
          }
        },
        `query nested($id: ID!) {
          one {
            two(id: $id) {
              three {
                id
                four(extra: true) {
                  five
                }
              }
            }
          }
        }`,
        cacheContext,
        { id: 1 }
      );

      restoreGraphSnapshot = restore(
        {
          [QueryRootId]: {
            type: Serializable.NodeSnapshotType.EntitySnapshot,
            outbound: [{ id: parameterizedId, path: ['one', 'two'] }]
          },
          [parameterizedId]: {
            type: Serializable.NodeSnapshotType.ParameterizedValueSnapshot,
            inbound: [{ id: QueryRootId, path: ['one', 'two'] }],
            outbound: [{ id: '31', path: ['three'] }],
            data: {}
          },
          '31': {
            type: Serializable.NodeSnapshotType.EntitySnapshot,
            inbound: [{ id: parameterizedId, path: ['three'] }],
            outbound: [{ id: nestedParameterizedId, path: ['four'] }],
            data: {
              id: 31
            }
          },
          [nestedParameterizedId]: {
            type: Serializable.NodeSnapshotType.ParameterizedValueSnapshot,
            inbound: [{ id: '31', path: ['four'] }],
            data: {
              five: 1
            }
          }
        },
        cacheContext
      ).cacheSnapshot.baseline;
    });

    it(`restores GraphSnapshot from JSON serializable object`, () => {
      jestExpect(restoreGraphSnapshot).toEqual(originalGraphSnapshot);
    });

    it(`correctly restores different types of NodeSnapshot`, () => {
      jestExpect(
        restoreGraphSnapshot.getNodeSnapshot(QueryRootId)
      ).toBeInstanceOf(EntitySnapshot);
      jestExpect(
        restoreGraphSnapshot.getNodeSnapshot(parameterizedId)
      ).toBeInstanceOf(ParameterizedValueSnapshot);
      jestExpect(restoreGraphSnapshot.getNodeSnapshot('31')).toBeInstanceOf(
        EntitySnapshot
      );
    });

    it(`restores parameterized NodeSnapshot from JSON serialization object`, () => {
      const parameterizedNode =
        restoreGraphSnapshot.getNodeSnapshot(parameterizedId)!;
      const entityData = restoreGraphSnapshot.getNodeData('31');

      jestExpect(parameterizedNode.inbound).toEqual([
        { id: QueryRootId, path: ['one', 'two'] }
      ]);
      jestExpect(parameterizedNode.outbound).toEqual([
        { id: '31', path: ['three'] }
      ]);
      jestExpect(parameterizedNode.data).not.toBe(undefined);
      jestExpect(parameterizedNode.data!['three']).toBe(entityData);
    });
  });
});
