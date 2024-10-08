import { extract } from '../../../../../src/operations/extract';
import { nodeIdForParameterizedValue } from '../../../../../src/operations/SnapshotEditor';
import { Serializable, StaticNodeId } from '../../../../../src/schema';
import {
  createGraphSnapshot,
  createStrictCacheContext
} from '../../../../helpers';

const { QueryRoot: QueryRootId } = StaticNodeId;

describe(`operations.extract`, () => {
  describe(`top-level values with nested parameterized value`, () => {
    let extractResult: Serializable.GraphSnapshot;
    beforeAll(() => {
      const cacheContext = createStrictCacheContext();
      const snapshot = createGraphSnapshot(
        {
          one: [
            {
              four: 'FOUR',
              two: [
                {
                  three: {
                    id: '30',
                    name: 'Three0',
                    extraValue: '30-42'
                  }
                },
                {
                  three: {
                    id: '31',
                    name: 'Three1',
                    extraValue: '31-42'
                  }
                },
                null
              ]
            },
            null
          ]
        },
        `query getAFoo($id: ID!) {
          one {
            four
            two {
              three(id: $id, withExtra: true) {
                id name extraValue
              }
            }
          }
        }`,
        cacheContext,
        { id: 1 }
      );

      extractResult = extract(snapshot, cacheContext);
    });

    it(`extracts JSON serialization object`, () => {
      const parameterizedId0 = nodeIdForParameterizedValue(
        QueryRootId,
        ['one', 0, 'two', 0, 'three'],
        { id: 1, withExtra: true }
      );

      const parameterizedId1 = nodeIdForParameterizedValue(
        QueryRootId,
        ['one', 0, 'two', 1, 'three'],
        { id: 1, withExtra: true }
      );

      jestExpect(extractResult).toEqual({
        [QueryRootId]: {
          type: Serializable.NodeSnapshotType.EntitySnapshot,
          outbound: [
            { id: parameterizedId0, path: ['one', 0, 'two', 0, 'three'] },
            { id: parameterizedId1, path: ['one', 0, 'two', 1, 'three'] }
          ],
          data: {
            one: [
              {
                four: 'FOUR',
                two: [undefined, undefined, null]
              },
              null
            ]
          }
        },
        [parameterizedId0]: {
          type: Serializable.NodeSnapshotType.ParameterizedValueSnapshot,
          inbound: [{ id: QueryRootId, path: ['one', 0, 'two', 0, 'three'] }],
          outbound: [{ id: '30', path: [] }],
          data: null
        },
        '30': {
          type: Serializable.NodeSnapshotType.EntitySnapshot,
          inbound: [{ id: parameterizedId0, path: [] }],
          data: {
            id: '30',
            name: 'Three0',
            extraValue: '30-42'
          }
        },
        [parameterizedId1]: {
          type: Serializable.NodeSnapshotType.ParameterizedValueSnapshot,
          inbound: [{ id: QueryRootId, path: ['one', 0, 'two', 1, 'three'] }],
          outbound: [{ id: '31', path: [] }],
          data: null
        },
        '31': {
          type: Serializable.NodeSnapshotType.EntitySnapshot,
          inbound: [{ id: parameterizedId1, path: [] }],
          data: {
            id: '31',
            name: 'Three1',
            extraValue: '31-42'
          }
        }
      });
    });
  });
});
