import { getFragmentQueryDocument } from 'apollo-utilities';
import { DocumentNode } from 'graphql'; // eslint-disable-line import/no-extraneous-dependencies

import { JsonObject } from '../primitive';
import { NodeId, RawOperation, StaticNodeId } from '../schema';

/**
 * Builds a query.
 */
export function buildRawOperation(document: DocumentNode, variables?: JsonObject, rootId?: NodeId): RawOperation {
  return {
    rootId: rootId || StaticNodeId.QueryRoot,
    document,
    variables,
  };
}

export function buildRawOperationFromFragmentDocument(
  fragmentDocument: DocumentNode,
  rootId: NodeId,
  variables?: JsonObject,
  fragmentName?: string
): RawOperation {
  return {
    rootId,
    document: getFragmentQueryDocument(fragmentDocument, fragmentName),
    variables,
    fragmentName,
    fromFragmentDocument: true,
  };
}
