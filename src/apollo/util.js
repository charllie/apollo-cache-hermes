"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRawOperationFromFragment = exports.buildRawOperationFromQuery = void 0;
var utilities_1 = require("@apollo/client/utilities");
var schema_1 = require("../schema");
/**
 * Builds a query.
 */
function buildRawOperationFromQuery(document, variables, rootId) {
    return {
        rootId: rootId || schema_1.StaticNodeId.QueryRoot,
        document: document,
        variables: variables,
    };
}
exports.buildRawOperationFromQuery = buildRawOperationFromQuery;
function buildRawOperationFromFragment(fragmentDocument, rootId, variables, fragmentName) {
    return {
        rootId: rootId,
        document: utilities_1.getFragmentQueryDocument(fragmentDocument, fragmentName),
        variables: variables,
        fragmentName: fragmentName,
        fromFragmentDocument: true,
    };
}
exports.buildRawOperationFromFragment = buildRawOperationFromFragment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0RBQW9FO0FBR3BFLG9DQUErRDtBQUcvRDs7R0FFRztBQUNILFNBQWdCLDBCQUEwQixDQUFDLFFBQXNCLEVBQUUsU0FBc0IsRUFBRSxNQUFlO0lBQ3hHLE9BQU87UUFDTCxNQUFNLEVBQUUsTUFBTSxJQUFJLHFCQUFZLENBQUMsU0FBUztRQUN4QyxRQUFRLFVBQUE7UUFDUixTQUFTLFdBQUE7S0FDVixDQUFDO0FBQ0osQ0FBQztBQU5ELGdFQU1DO0FBRUQsU0FBZ0IsNkJBQTZCLENBQzNDLGdCQUE4QixFQUM5QixNQUFjLEVBQ2QsU0FBc0IsRUFDdEIsWUFBcUI7SUFFckIsT0FBTztRQUNMLE1BQU0sUUFBQTtRQUNOLFFBQVEsRUFBRSxvQ0FBd0IsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLENBQUM7UUFDbEUsU0FBUyxXQUFBO1FBQ1QsWUFBWSxjQUFBO1FBQ1osb0JBQW9CLEVBQUUsSUFBSTtLQUMzQixDQUFDO0FBQ0osQ0FBQztBQWJELHNFQWFDIn0=