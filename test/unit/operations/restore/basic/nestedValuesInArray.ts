import { GraphSnapshot } from '../../../../../src/GraphSnapshot';
import { EntitySnapshot } from '../../../../../src/nodes/EntitySnapshot';
import { restore } from '../../../../../src/operations';
import { Serializable, StaticNodeId } from '../../../../../src/schema';
import {
  createGraphSnapshot,
  createStrictCacheContext
} from '../../../../helpers';

const { QueryRoot: QueryRootId } = StaticNodeId;

describe(`operations.restore`, () => {
  describe(`nested values in an array`, () => {
    let restoreGraphSnapshot: GraphSnapshot,
      originalGraphSnapshot: GraphSnapshot;
    beforeAll(() => {
      const cacheContext = createStrictCacheContext();
      originalGraphSnapshot = createGraphSnapshot(
        {
          one: {
            two: [{ three: { name: 'Gouda' } }, { three: { name: 'Brie' } }]
          }
        },
        `{ 
            one {
              two {
                three { name }
              }
            }
        }`,
        cacheContext
      );

      restoreGraphSnapshot = restore(
        {
          [QueryRootId]: {
            type: Serializable.NodeSnapshotType.EntitySnapshot,
            data: {
              one: {
                two: [{ three: { name: 'Gouda' } }, { three: { name: 'Brie' } }]
              }
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
    });
  });
});
