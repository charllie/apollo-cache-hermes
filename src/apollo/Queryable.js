"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloQueryable = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@apollo/client/core");
var utilities_1 = require("@apollo/client/utilities");
var errors_1 = require("../errors");
var util_1 = require("./util");
/**
 * Apollo-specific interface to the cache.
 */
var ApolloQueryable = /** @class */ (function (_super) {
    tslib_1.__extends(ApolloQueryable, _super);
    function ApolloQueryable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ApolloQueryable.prototype.diff = function (options) {
        var rawOperation = util_1.buildRawOperationFromQuery(options.query, options.variables);
        var _a = this._queryable.read(rawOperation, options.optimistic), result = _a.result, complete = _a.complete;
        if (options.returnPartialData === false && !complete) {
            // TODO: Include more detail with this error.
            throw new errors_1.UnsatisfiedCacheError("diffQuery not satisfied by the cache.");
        }
        return { result: result, complete: complete };
    };
    ApolloQueryable.prototype.read = function (options) {
        var rawOperation = util_1.buildRawOperationFromQuery(options.query, options.variables, options.rootId);
        var _a = this._queryable.read(rawOperation, options.optimistic), result = _a.result, complete = _a.complete;
        if (!complete) {
            // TODO: Include more detail with this error.
            throw new errors_1.UnsatisfiedCacheError("read not satisfied by the cache.");
        }
        return result;
    };
    ApolloQueryable.prototype.readQuery = function (options, optimistic) {
        return this.read({
            query: options.query,
            variables: options.variables,
            optimistic: !!optimistic,
        });
    };
    ApolloQueryable.prototype.readFragment = function (options, optimistic) {
        // TODO: Support nested fragments.
        var rawOperation = util_1.buildRawOperationFromFragment(options.fragment, options.id, options.variables, options.fragmentName);
        return this._queryable.read(rawOperation, optimistic).result;
    };
    ApolloQueryable.prototype.write = function (options) {
        var rawOperation = util_1.buildRawOperationFromQuery(options.query, options.variables, options.dataId);
        this._queryable.write(rawOperation, options.result);
        return core_1.makeReference(rawOperation.rootId);
    };
    ApolloQueryable.prototype.writeQuery = function (options) {
        var rawOperation = util_1.buildRawOperationFromQuery(options.query, options.variables);
        this._queryable.write(rawOperation, options.data);
        return core_1.makeReference(rawOperation.rootId);
    };
    ApolloQueryable.prototype.writeFragment = function (options) {
        // TODO: Support nested fragments.
        var rawOperation = util_1.buildRawOperationFromFragment(options.fragment, options.id, options.variables, options.fragmentName);
        this._queryable.write(rawOperation, options.data);
        return core_1.makeReference(rawOperation.rootId);
    };
    ApolloQueryable.prototype.transformDocument = function (doc) {
        return this._queryable.transformDocument(doc);
    };
    ApolloQueryable.prototype.transformForLink = function (document) {
        // @static directives are for the cache only.
        return utilities_1.removeDirectivesFromDocument([{ name: 'static' }], document);
    };
    ApolloQueryable.prototype.evict = function (_options) {
        throw new Error("evict() is not implemented in Hermes");
    };
    return ApolloQueryable;
}(core_1.ApolloCache));
exports.ApolloQueryable = ApolloQueryable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVlcnlhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUXVlcnlhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSw0Q0FBOEY7QUFDOUYsc0RBQXdFO0FBQ3hFLG9DQUFrRDtBQUlsRCwrQkFBbUY7QUFJbkY7O0dBRUc7QUFDSDtJQUEyRCwyQ0FBd0I7SUFBbkY7O0lBdUZBLENBQUM7SUFuRkMsOEJBQUksR0FBSixVQUFRLE9BQTBCO1FBQ2hDLElBQU0sWUFBWSxHQUFHLGlDQUEwQixDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVFLElBQUEsS0FBdUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBM0UsTUFBTSxZQUFBLEVBQUUsUUFBUSxjQUEyRCxDQUFDO1FBQ3BGLElBQUksT0FBTyxDQUFDLGlCQUFpQixLQUFLLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNwRCw2Q0FBNkM7WUFDN0MsTUFBTSxJQUFJLDhCQUFxQixDQUFDLHVDQUF1QyxDQUFDLENBQUM7U0FDMUU7UUFFRCxPQUFPLEVBQUUsTUFBTSxRQUFBLEVBQUUsUUFBUSxVQUFBLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQsOEJBQUksR0FBSixVQUFLLE9BQTBCO1FBQzdCLElBQU0sWUFBWSxHQUFHLGlDQUEwQixDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUYsSUFBQSxLQUF1QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUEzRSxNQUFNLFlBQUEsRUFBRSxRQUFRLGNBQTJELENBQUM7UUFDcEYsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNiLDZDQUE2QztZQUM3QyxNQUFNLElBQUks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