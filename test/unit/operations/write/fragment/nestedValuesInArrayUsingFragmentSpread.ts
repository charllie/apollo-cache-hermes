import { CacheContext } from '../../../../../src/context';
import { GraphSnapshot } from '../../../../../src/GraphSnapshot';
import { EntitySnapshot } from '../../../../../src/nodes';
import { write } from '../../../../../src/operations/write';
import { NodeId, StaticNodeId } from '../../../../../src/schema';
import { query, strictConfig } from '../../../../helpers';

const { QueryRoot: QueryRootId } = StaticNodeId;

// These are really more like integration tests, given the underlying machinery.
//
// It just isn't very fruitful to unit test the individual steps of the write
// workflow in isolation, given the contextual state that must be passed around.
describe(`operations.write`, () => {
  const context = new CacheContext(strictConfig);
  const empty = new GraphSnapshot();

  describe(`nested values in array using fragment spread`, () => {
    let snapshot: GraphSnapshot, editedNodeIds: Set<NodeId>;
    beforeAll(() => {
      const viewerQuery = query(`
        query getViewer {
          viewer {
            id
            name
            articles {
              ...ShortArticle
            }
          }
        }
        fragment ShortArticle on Article {
          createAt
          title
          details {
            body
            ref
          }
        }
      `);

      const result = write(context, empty, viewerQuery, {
        viewer: {
          id: 123,
          name: 'Gouda',
          articles: [
            {
              createAt: '10/01',
              title: 'Hello',
              details: {
                body: 'Hello - body',
                ref: 'Hello-ref'
              }
            },
            {
              createAt: '10/02',
              title: null,
              details: {
                body: 'world - body',
                ref: null
              }
            }
          ]
        }
      });
      snapshot = result.snapshot;
      editedNodeIds = result.editedNodeIds;
    });

    it(`creates the query root, referencing the entity`, () => {
      jestExpect(snapshot.getNodeData(QueryRootId)).toEqual({
        viewer: {
          id: 123,
          name: 'Gouda',
          articles: [
            {
              createAt: '10/01',
              title: 'Hello',
              details: {
                body: 'Hello - body',
                ref: 'Hello-ref'
              }
            },
            {
              createAt: '10/02',
              title: null,
              details: {
                body: 'world - body',
                ref: null
              }
            }
          ]
        }
      });
    });

    it(`indexes the entity`, () => {
      jestExpect(snapshot.getNodeData('123')).toEqual({
        id: 123,
        name: 'Gouda',
        articles: [
          {
            createAt: '10/01',
            title: 'Hello',
            details: {
              body: 'Hello - body',
              ref: 'Hello-ref'
            }
          },
          {
            createAt: '10/02',
            title: null,
            details: {
              body: 'world - body',
              ref: null
            }
          }
        ]
      });
    });

    it(`emits the root as an EntitySnapshot`, () => {
      jestExpect(snapshot.getNodeSnapshot(QueryRootId)).toBeInstanceOf(
        EntitySnapshot
      );
    });

    it(`emits the entity as an EntitySnapshot`, () => {
      jestExpect(snapshot.getNodeSnapshot('123')).toBeInstanceOf(
        EntitySnapshot
      );
    });

    it(`directly references viewer from the query root`, () => {
      const queryRoot = snapshot.getNodeData(QueryRootId);
      const viewer = snapshot.getNodeData('123');
      jestExpect(queryRoot.viewer).toBe(viewer);
    });

    it(`records the outbound reference from the query root`, () => {
      const queryRoot = snapshot.getNodeSnapshot(QueryRootId)!;
      jestExpect(queryRoot.outbound).toEqual([{ id: '123', path: ['viewer'] }]);
      jestExpect(queryRoot.inbound).toBe(undefined);
    });

    it(`records the inbound reference from referenced entity`, () => {
      const queryRoot = snapshot.getNodeSnapshot('123')!;
      jestExpect(queryRoot.inbound).toEqual([
        { id: QueryRootId, path: ['viewer'] }
      ]);
      jestExpect(queryRoot.outbound).toBe(undefined);
    });

    it(`marks the entity and root as edited`, () => {
      jestExpect(Array.from(editedNodeIds)).toEqual(
        jestExpect.arrayContaining([QueryRootId, '123'])
      );
    });

    it(`only contains the two nodes`, () => {
      jestExpect(snapshot.allNodeIds()).toEqual(
        jestExpect.arrayContaining([QueryRootId, '123'])
      );
    });
  });
});
