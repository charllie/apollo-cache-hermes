"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationCacheKey = exports.defaultEntityIdMapper = exports._makeEntityIdMapper = exports.CacheContext = void 0;
var tslib_1 = require("tslib");
var utilities_1 = require("@apollo/client/utilities");
var equality_1 = tslib_1.__importDefault(require("@wry/equality"));
var ParsedQueryNode_1 = require("../ParsedQueryNode");
var util_1 = require("../util");
var ConsoleTracer_1 = require("./ConsoleTracer");
var QueryInfo_1 = require("./QueryInfo");
/**
 * Configuration and shared state used throughout the cache's operation.
 */
var CacheContext = /** @class */ (function () {
    function CacheContext(config) {
        if (config === void 0) { config = {}; }
        /** All currently known & processed GraphQL documents. */
        this._queryInfoMap = new Map();
        /** All currently known & parsed queries, for identity mapping. */
        this._operationMap = new Map();
        // Infer dev mode from NODE_ENV, by convention.
        var nodeEnv = typeof process !== 'undefined' ? process.env.NODE_ENV : 'development';
        this.entityIdForValue = _makeEntityIdMapper(config.entityIdForNode);
        this.entityTransformer = config.entityTransformer;
        this.freezeSnapshots = 'freeze' in config ? !!config.freeze : nodeEnv !== 'production';
        this.strict = typeof config.strict === 'boolean' ? config.strict : true;
        this.verbose = !!config.verbose;
        this.resolverRedirects = config.resolverRedirects || {};
        this.onChange = config.onChange;
        this.entityUpdaters = config.entityUpdaters || {};
        this.tracer = config.tracer || new ConsoleTracer_1.ConsoleTracer(!!config.verbose, config.logger);
        this.addTypename = config.addTypename || false;
    }
    /**
     * Performs any transformations of operation documents.
     *
     * Cache consumers should call this on any operation document prior to calling
     * any other method in the cache.
     */
    CacheContext.prototype.transformDocument = function (document) {
        if (this.addTypename && !document.hasBeenTransformed) {
            var transformedDocument = utilities_1.addTypenameToDocument(document);
            transformedDocument.hasBeenTransformed = true;
            return transformedDocument;
        }
        return document;
    };
    /**
     * Returns a memoized & parsed operation.
     *
     * To aid in various cache lookups, the result is memoized by all of its
     * values, and can be used as an identity for a specific operation.
     */
    CacheContext.prototype.parseOperation = function (raw) {
        var e_1, _a;
        // It appears like Apollo or someone upstream is cloning or otherwise
        // modifying the queries that are passed down.  Thus, the operation source
        // is a more reliable cache key…
        var cacheKey = operationCacheKey(raw.document, raw.fragmentName);
        var operationInstances = this._operationMap.get(cacheKey);
        if (!operationInstances) {
            operationInstances = [];
            this._operationMap.set(cacheKey, operationInstances);
        }
        try {
            // Do we already have a copy of this guy?
            for (var operationInstances_1 = tslib_1.__values(operationInstances), operationInstances_1_1 = operationInstances_1.next(); !operationInstances_1_1.done; operationInstances_1_1 = operationInstances_1.next()) {
                var instance = operationInstances_1_1.value;
                if (instance.rootId !== raw.rootId)
                    continue;
                if (!equality_1.default(instance.variables, raw.variables))
                    continue;
                return instance;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (operationInstances_1_1 && !operationInstances_1_1.done && (_a = operationInstances_1.return)) _a.call(operationInstances_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var updateRaw = tslib_1.__assign(tslib_1.__assign({}, raw), { document: this.transformDocument(raw.document) });
        var info = this._queryInfo(cacheKey, updateRaw);
        var fullVariables = tslib_1.__assign(tslib_1.__assign({}, info.variableDefaults), updateRaw.variables);
        var operation = {
            info: info,
            rootId: updateRaw.rootId,
            parsedQuery: ParsedQueryNode_1.expandVariables(info.parsed, fullVariables),
            isStatic: !ParsedQueryNode_1.areChildrenDynamic(info.parsed),
            variables: updateRaw.variables,
        };
        operationInstances.push(operation);
        return operation;
    };
    /**
     * Retrieves a memoized QueryInfo for a given GraphQL document.
     */
    CacheContext.prototype._queryInfo = function (cacheKey, raw) {
        if (!this._queryInfoMap.has(cacheKey)) {
            this._queryInfoMap.set(cacheKey, new QueryInfo_1.QueryInfo(this, raw));
        }
        return this._queryInfoMap.get(cacheKey);
    };
    return CacheContext;
}());
exports.CacheContext = CacheContext;
/**
 * Wrap entityIdForNode so that it coerces all values to strings.
 */
function _makeEntityIdMapper(mapper) {
    if (mapper === void 0) { mapper = defaultEntityIdMapper; }
    return function entityIdForNode(node) {
        if (!util_1.isObject(node))
            return undefined;
        // We don't trust upstream implementations.
        var entityId = mapper(node);
        if (typeof entityId === 'string')
            return entityId;
        if (typeof entityId === 'number')
            return String(entityId);
        return undefined;
    };
}
exports._makeEntityIdMapper = _makeEntityIdMapper;
function defaultEntityIdMapper(node) {
    return node.id;
}
exports.defaultEntityIdMapper = defaultEntityIdMapper;
function operationCacheKey(document, fragmentName) {
    if (fragmentName) {
        return fragmentName + "\u2756" + document.loc.source.body;
    }
    return document.loc.source.body;
}
exports.operationCacheKey = operationCacheKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FjaGVDb250ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ2FjaGVDb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxzREFBaUU7QUFDakUsbUVBQW9DO0FBSXBDLHNEQUF5RTtBQUd6RSxnQ0FBaUQ7QUFFakQsaURBQWdEO0FBQ2hELHlDQUF3QztBQTJJeEM7O0dBRUc7QUFDSDtJQXFDRSxzQkFBWSxNQUF1QztRQUF2Qyx1QkFBQSxFQUFBLFdBQXVDO1FBTG5ELHlEQUF5RDtRQUN4QyxrQkFBYSxHQUFHLElBQUksR0FBRyxFQUFxQixDQUFDO1FBQzlELGtFQUFrRTtRQUNqRCxrQkFBYSxHQUFHLElBQUksR0FBRyxFQUErQixDQUFDO1FBR3RFLCtDQUErQztRQUMvQyxJQUFNLE9BQU8sR0FBRyxPQUFPLE9BQU8sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7UUFFdEYsSUFBSSxDQUFDLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ2xELElBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxZQUFZLENBQUM7UUFFdkYsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLE1BQU0sQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDeEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNoQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxD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