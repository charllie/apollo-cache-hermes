import { addTypenameToDocument } from '@apollo/client/utilities';
import * as _ from 'lodash';

import { CacheContext } from '../../../../src/context';
import { GraphSnapshot } from '../../../../src/GraphSnapshot';
import { read } from '../../../../src/operations/read';
import { nodeIdForParameterizedValue } from '../../../../src/operations/SnapshotEditor';
import { write } from '../../../../src/operations/write';
import { JsonObject } from '../../../../src/primitive';
import { NodeId, RawOperation, StaticNodeId } from '../../../../src/schema';
import { query, strictConfig } from '../../../helpers';

const { QueryRoot: QueryRootId } = StaticNodeId;

describe(`context.CacheContext`, () => {
  function queryWithTypename(
    gqlString: string,
    variables?: JsonObject,
    rootId?: NodeId
  ) {
    const rawOperation = query(gqlString, variables, rootId);
    return {
      ...rawOperation,
      document: addTypenameToDocument(rawOperation.document)
    };
  }

  describe(`entity transformation`, () => {
    describe(`no entity transformer`, () => {
      let viewerQuery: RawOperation,
        entityTransformerContext: CacheContext,
        snapshot: GraphSnapshot;
      beforeAll(() => {
        viewerQuery = queryWithTypename(
          `
          query getViewer($id:ID!) {
            viewer(id:$id) {
              id
              name
            }
          }
        `,
          { id: '4' }
        );

        entityTransformerContext = new CacheContext({
          ...strictConfig,
          entityTransformer: undefined
        });
        const empty = new GraphSnapshot();
        snapshot = write(entityTransformerContext, empty, viewerQuery, {
          viewer: {
            __typename: 'viewer',
            id: '4',
            name: 'Bob'
          }
        }).snapshot;
      });

      it(`check helper methods does not exist`, () => {
        const viewerParameterizedId = nodeIdForParameterizedValue(
          QueryRootId,
          ['viewer'],
          { id: '4' }
        );
        expect(
          Object.getPrototypeOf(snapshot.getNodeData(viewerParameterizedId))
        ).to.not.include.all.keys(['getName', 'getId']);
      });
    });

    describe(`mixin additional helper on simple query`, () => {
      let viewerQuery: RawOperation,
        entityTransformerContext: CacheContext,
        snapshot: GraphSnapshot;
      beforeAll(() => {
        viewerQuery = queryWithTypename(`{
          viewer {
            id
            name
          }
        }`);

        function mixinHelperMethods(obj: object, proto: object | null): void {
          if (obj['__typename'] === 'viewer') {
            const newPrototype = _.clone(Object.getPrototypeOf(obj));
            Object.assign(newPrototype, proto);
            Object.setPrototypeOf(obj, newPrototype);
          }
        }

        entityTransformerContext = new CacheContext({
          ...strictConfig,
          entityTransformer: (node: JsonObject): void => {
            mixinHelperMethods(node, {
              getName(this: { id: string; name: string }) {
                return this.name;
              },
              getId(this: { id: string; name: string }) {
                return this.id;
              }
            });
          }
        });
        const empty = new GraphSnapshot();
        snapshot = write(entityTransformerContext, empty, viewerQuery, {
          viewer: {
            __typename: 'viewer',
            id: '0',
            name: 'Bob'
          }
        }).snapshot;
      });

      it(`get information through helper methods`, () => {
        const { result } = read(
          entityTransformerContext,
          viewerQuery,
          snapshot
        );
        const name = (result as any).viewer.getName();
        const id = (result as any).viewer.getId();
        expect(name).to.eq('Bob');
        expect(id).to.eq('0');
      });

      it(`check helper methods exists`, () => {
        expect(
          Object.getPrototypeOf(snapshot.getNodeData(QueryRootId))
        ).to.not.include.all.keys(['getName', 'getId']);
        expect(
          Object.getPrototypeOf(snapshot.getNodeData(QueryRootId).viewer)
        ).to.include.all.keys(['getName', 'getId']);
      });
    });

    describe(`mixin additional helper on nested query`, () => {
      let viewerQuery: RawOperation,
        entityTransformerContext: CacheContext,
        snapshot: GraphSnapshot;
      beforeAll(() => {
        viewerQuery = queryWithTypename(`
          query GetUser {
            user {
              dispatcher
              id
              nickName
              name
              contact {
                address {
                  city
                  state
                }
                phone
              }
            }
            driver {
              id
              name
              shipments
            }
          }
        `);

        interface User {
          dispatcher: boolean;
          id: string;
          name: string;
          nickName: string;
          contact: {
            address: {
              city: string;
              state: string;
            };
            phone: number;
          };
        }

        function mixinHelperMethods(obj: any, proto: object | null): void {
          if (obj['__typename'] === 'user') {
            const newPrototype = _.clone(Object.getPrototypeOf(obj));
            Object.assign(newPrototype, proto);
            Object.setPrototypeOf(obj, newPrototype);
          }
        }

        entityTransformerContext = new CacheContext({
          ...strictConfig,
          entityTransformer: (node: JsonObject): void => {
            mixinHelperMethods(node, {
              getName(this: User) {
                return this.name;
              },
              getId(this: User) {
                return this.id;
              },
              getContact(this: User) {
                return this.contact;
              },
              getJustPhoneNumber(this: User) {
                return this.contact.phone;
              },
              getCity(this: User) {
                return this.contact.address.city;
              }
            });
          }
        });
        const empty = new GraphSnapshot();
        snapshot = write(entityTransformerContext, empty, viewerQuery, {
          user: {
            __typename: 'user',
            dispatcher: true,
            id: '0',
            name: 'Bob',
            nickName: 'B',
            contact: {
              __typename: 'contact',
              address: {
                __typename: 'address',
                city: 'AA',
                state: 'AAAA'
              },
              phone: 1234
            }
          },
          driver: {
            __typename: 'driver',
            id: '1',
            name: 'Bear',
            shipments: [{ id: 0, name: 'portland' }]
          }
        }).snapshot;
      });

      it(`get information through helper methods`, () => {
        const { result } = read(
          entityTransformerContext,
          viewerQuery,
          snapshot
        );
        expect((result as any).user.getName()).to.eq('Bob');
        expect((result as any).user.getId()).to.eq('0');
        expect((result as any).user.getJustPhoneNumber()).to.eq(1234);
        expect((result as any).user.getCity()).to.eq('AA');
      });

      it(`check helper methods exists`, () => {
        expect(
          Object.getPrototypeOf(snapshot.getNodeData(QueryRootId).user)
        ).to.include.all.keys([
          'getName',
          'getId',
          'getJustPhoneNumber',
          'getCity'
        ]);
      });

      it(`check helper method not attached to other entity`, () => {
        expect(
          Object.getPrototypeOf(snapshot.getNodeData(QueryRootId))
        ).to.not.include.all.keys([
          'getName',
          'getId',
          'getJustPhoneNumber',
          'getCity'
        ]);
        expect(
          Object.getPrototypeOf(snapshot.getNodeData('1'))
        ).to.not.include.all.keys([
          'getName',
          'getId',
          'getJustPhoneNumber',
          'getCity'
        ]);
      });
    });

    describe(`mixin additional helper on nested alias query`, () => {
      let viewerQuery: RawOperation,
        entityTransformerContext: CacheContext,
        snapshot: GraphSnapshot;
      beforeAll(() => {
        viewerQuery = queryWithTypename(`
          query GetUser {
            User: user {
              dispatcher
              id
              nickName
              name
              contact {
                address {
                  city
                  state
                }
                phone
              }
            }
            Driver: driver {
              id
              name
              shipments
            }
          }
        `);

        interface User {
          dispatcher: boolean;
          id: string;
          name: string;
          nickName: string;
          contact: {
            address: {
              city: string;
              state: string;
            };
            phone: number;
          };
        }

        function mixinHelperMethods(obj: any, proto: object | null): void {
          if (obj['__typename'] === 'user') {
            const newPrototype = _.clone(Object.getPrototypeOf(obj));
            Object.assign(newPrototype, proto);
            Object.setPrototypeOf(obj, newPrototype);
          }
        }

        entityTransformerContext = new CacheContext({
          ...strictConfig,
          entityTransformer: (node: JsonObject): void => {
            mixinHelperMethods(node, {
              getName(this: User) {
                return this.name;
              },
              getId(this: User) {
                return this.id;
              },
              getContact(this: User) {
                return this.contact;
              },
              getJustPhoneNumber(this: User) {
                return this.contact.phone;
              },
              getCity(this: User) {
                return this.contact.address.city;
              }
            });
          }
        });
        const empty = new GraphSnapshot();
        snapshot = write(entityTransformerContext, empty, viewerQuery, {
          User: {
            __typename: 'user',
            dispatcher: true,
            id: '0',
            name: 'Bob',
            nickName: 'B',
            contact: {
              __typename: 'contact',
              address: {
                __typename: 'address',
                city: 'AA',
                state: 'AAAA'
              },
              phone: 1234
            }
          },
          Driver: {
            __typename: 'driver',
            id: '1',
            name: 'Bear',
            shipments: [{ id: 0, name: 'portland' }]
          }
        }).snapshot;
      });

      it(`get information through helper methods`, () => {
        const { result } = read(
          entityTransformerContext,
          viewerQuery,
          snapshot
        );
        expect((result as any).user.getName()).to.eq('Bob');
        expect((result as any).user.getId()).to.eq('0');
        expect((result as any).user.getJustPhoneNumber()).to.eq(1234);
        expect((result as any).user.getCity()).to.eq('AA');
      });

      it(`check helper methods exists`, () => {
        expect(
          Object.getPrototypeOf(snapshot.getNodeData(QueryRootId).user)
        ).to.include.all.keys([
          'getName',
          'getId',
          'getJustPhoneNumber',
          'getCity'
        ]);
      });

      it(`check helper method not attached to other entity`, () => {
        expect(
          Object.getPrototypeOf(snapshot.getNodeData(QueryRootId))
        ).to.not.include.all.keys([
          'getName',
          'getId',
          'getJustPhoneNumber',
          'getCity'
        ]);
        expect(
          Object.getPrototypeOf(snapshot.getNodeData('1'))
        ).to.not.include.all.keys([
          'getName',
          'getId',
          'getJustPhoneNumber',
          'getCity'
        ]);
      });
    });

    describe(`freeze an object`, () => {
      let viewerQuery: RawOperation,
        entityTransformerContext: CacheContext,
        snapshot: GraphSnapshot;
      beforeAll(() => {
        viewerQuery = queryWithTypename(`{
          viewer {
            id
            name
          }
        }`);

        entityTransformerContext = new CacheContext({
          ...strictConfig,
          entityTransformer: (node: JsonObject): void => {
            Object.freeze(node);
          }
        });
        const empty = new GraphSnapshot();
        snapshot = write(entityTransformerContext, empty, viewerQuery, {
          viewer: {
            __typename: 'viewer',
            id: '0',
            name: 'Bob'
          }
        }).snapshot;
      });

      it(`check that entity is frozen`, () => {
        expect(snapshot.getNodeData(QueryRootId)).to.be.frozen;
        expect(snapshot.getNodeData('0')).to.be.frozen;
      });
    });

    describe(`mixing additional helper on parameterized query`, () => {
      let viewerQuery: RawOperation,
        entityTransformerContext: CacheContext,
        snapshot: GraphSnapshot;
      beforeAll(() => {
        viewerQuery = queryWithTypename(
          `
        query getViewer($id:ID!) {
          viewer(id:$id) {
            id
            name
          }
        }`,
          { id: '4' }
        );

        function mixinHelperMethods(obj: object, proto: object | null): void {
          if (obj['__typename'] === 'viewer') {
            const newPrototype = _.clone(Object.getPrototypeOf(obj));
            Object.assign(newPrototype, proto);
            Object.setPrototypeOf(obj, newPrototype);
          }
        }

        entityTransformerContext = new CacheContext({
          ...strictConfig,
          entityTransformer: (node: JsonObject): void => {
            mixinHelperMethods(node, {
              getName(this: { id: string; name: string }) {
                return this.name;
              },
              getId(this: { id: string; name: string }) {
                return this.id;
              }
            });
          }
        });
        const empty = new GraphSnapshot();
        snapshot = write(entityTransformerContext, empty, viewerQuery, {
          viewer: {
            __typename: 'viewer',
            name: 'Bob',
            id: '4'
          }
        }).snapshot;
      });

      it(`get information through helper methods`, () => {
        const { result } = read(
          entityTransformerContext,
          viewerQuery,
          snapshot
        );
        const name = (result as any).viewer.getName();
        const id = (result as any).viewer.getId();
        expect(name).to.eq('Bob');
        expect(id).to.eq('4');
      });

      it(`check helper methods exists`, () => {
        const viewerParameterizedId = nodeIdForParameterizedValue(
          QueryRootId,
          ['viewer'],
          { id: '4' }
        );
        expect(
          Object.getPrototypeOf(snapshot.getNodeData(viewerParameterizedId))
        ).to.include.all.keys(['getName', 'getId']);
      });
    });
  });
});
