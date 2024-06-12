"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheConsistencyError = exports.InvalidPayloadError = exports.OperationError = exports.ConflictingFieldsError = exports.UnsatisfiedCacheError = exports.QueryError = exports.InvalidEnvironmentError = exports.HermesCacheError = void 0;
var tslib_1 = require("tslib");
var makeError = tslib_1.__importStar(require("make-error"));
function _toDetails(messageOrDetails) {
    if (typeof messageOrDetails === 'object')
        return messageOrDetails;
    return { message: messageOrDetails };
}
function _expandMessage(messageOrDetails, template) {
    var _a = _toDetails(messageOrDetails), message = _a.message, details = tslib_1.__rest(_a, ["message"]);
    return tslib_1.__assign(tslib_1.__assign({}, details), { message: template.replace('{{message}}', message) });
}
/**
 * Base error class for all errors emitted by the cache.
 *
 * Note that we rely on make-error so that we can safely extend the built in
 * Error in a cross-platform manner.
 */
var HermesCacheError = /** @class */ (function (_super) {
    tslib_1.__extends(HermesCacheError, _super);
    function HermesCacheError(messageOrDetails) {
        var _this = this;
        var _a = _toDetails(messageOrDetails), message = _a.message, infoUrl = _a.infoUrl;
        _this = _super.call(this, infoUrl ? "[" + infoUrl + "] " + message : message) || this;
        return _this;
    }
    return HermesCacheError;
}(makeError.BaseError));
exports.HermesCacheError = HermesCacheError;
/**
 * The current runtime environment isn't suited to run Hermes.
 */
var InvalidEnvironmentError = /** @class */ (function (_super) {
    tslib_1.__extends(InvalidEnvironmentError, _super);
    function InvalidEnvironmentError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidEnvironmentError;
}(HermesCacheError));
exports.InvalidEnvironmentError = InvalidEnvironmentError;
/**
 * An error with a query - generally occurs when parsing an error.
 */
var QueryError = /** @class */ (function (_super) {
    tslib_1.__extends(QueryError, _super);
    function QueryError(messageOrDetails, 
    // The path within the query where the error occurred.
    path) {
        var _this = _super.call(this, _expandMessage(messageOrDetails, "{{message}} at " + prettyPath(path))) || this;
        _this.path = path;
        return _this;
    }
    return QueryError;
}(HermesCacheError));
exports.QueryError = QueryError;
/**
 * An error with a read query - generally occurs when data in cache is partial
 * or missing.
 */
var UnsatisfiedCacheError = /** @class */ (function (_super) {
    tslib_1.__extends(UnsatisfiedCacheError, _super);
    function UnsatisfiedCacheError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UnsatisfiedCacheError;
}(HermesCacheError));
exports.UnsatisfiedCacheError = UnsatisfiedCacheError;
/**
 * An error thrown when multiple fields within a query disagree about what they
 * are selecting.
 */
var ConflictingFieldsError = /** @class */ (function (_super) {
    tslib_1.__extends(ConflictingFieldsError, _super);
    function ConflictingFieldsError(messageOrDetails, 
    // The path within the query where the error occurred.
    path, 
    // The fields that are conflicting
    fields) {
        var _this = _super.call(this, _expandMessage(messageOrDetails, "Conflicting field definitions: {{message}}"), path) || this;
        _this.path = path;
        _this.fields = fields;
        return _this;
    }
    return ConflictingFieldsError;
}(QueryError));
exports.ConflictingFieldsError = ConflictingFieldsError;
/**
 * An error occurring during a cache operation, associated with a location in
 * the cache.
 */
var OperationError = /** @class */ (function (_super) {
    tslib_1.__extends(OperationError, _super);
    function OperationError(messageOrDetails, 
    // The path from the payload root to the node containing the error.
    prefixPath, 
    // The node id being processed when the error occurred.
    nodeId, 
    // The path within the node where the error occurred.
    path, 
    // A value associated with the error.
    value) {
        var _this = _super.call(this, _expandMessage(messageOrDetails, "{{message}} at " + prettyPath(tslib_1.__spread(prefixPath, path)) + " (node " + nodeId + ")")) || this;
        _this.prefixPath = prefixPath;
        _this.nodeId = nodeId;
        _this.path = path;
        _this.value = value;
        return _this;
    }
    return OperationError;
}(HermesCacheError));
exports.OperationError = OperationError;
/**
 * An error occurring while processing a payload for a write operation.
 */
var InvalidPayloadError = /** @class */ (function (_super) {
    tslib_1.__extends(InvalidPayloadError, _super);
    function InvalidPayloadError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidPayloadError;
}(OperationError));
exports.InvalidPayloadError = InvalidPayloadError;
/**
 * An error occurring as the result of a cache bug.
 */
var CacheConsistencyError = /** @class */ (function (_super) {
    tslib_1.__extends(CacheConsistencyError, _super);
    function CacheConsistencyError(messageOrDetails, 
    // The path from the payload root to the node containing the error.
    prefixPath, 
    // The node id being processed when the error occurred.
    nodeId, 
    // The path within the node where the error occurred.
    path, 
    // A value that is the subject of the error
    value) {
        var _this = _super.call(this, _expandMessage(messageOrDetails, "Hermes BUG: {{message}}"), prefixPath, nodeId, path) || this;
        _this.prefixPath = prefixPath;
        _this.nodeId = nodeId;
        _this.path = path;
        _this.value = value;
        return _this;
    }
    return CacheConsistencyError;
}(OperationError));
exports.CacheConsistencyError = CacheConsistencyError;
/**
 * Renders a path as a pretty string.
 */
function prettyPath(path) {
    return path.length ? path.join('.') : '[]';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXJyb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSw0REFBd0M7QUFXeEMsU0FBUyxVQUFVLENBQUMsZ0JBQWtDO0lBQ3BELElBQUksT0FBTyxnQkFBZ0IsS0FBSyxRQUFRO1FBQUUsT0FBTyxnQkFBZ0IsQ0FBQztJQUNsRSxPQUFPLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLENBQUM7QUFDdkMsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLGdCQUFrQyxFQUFFLFFBQWdCO0lBQzFFLElBQU0sS0FBMEIsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQXBELE9BQU8sYUFBQSxFQUFLLE9BQU8sc0JBQXJCLFdBQXVCLENBQStCLENBQUM7SUFDN0QsNkNBQ0ssT0FBTyxLQUNWLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsSUFDakQ7QUFDSixDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSDtJQUFzQyw0Q0FBbUI7SUFDdkQsMEJBQVksZ0JBQWtDO1FBQTlDLGlCQUdDO1FBRk8sSUFBQSxLQUF1QixVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBakQsT0FBTyxhQUFBLEVBQUUsT0FBTyxhQUFpQyxDQUFDO1FBQzFELFFBQUEsa0JBQU0sT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFJLE9BQU8sVUFBSyxPQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFDOztJQUN2RCxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBTEQsQ0FBc0MsU0FBUyxDQUFDLFNBQVMsR0FLeEQ7QUFMWSw0Q0FBZ0I7QUFPN0I7O0dBRUc7QUFDSDtJQUE2QyxtREFBZ0I7SUFBN0Q7O0lBQStELENBQUM7SUFBRCw4QkFBQztBQUFELENBQUMsQUFBaEUsQ0FBNkMsZ0JBQWdCLEdBQUc7QUFBbkQsMERBQXVCO0FBRXBDOztHQUVHO0FBQ0g7SUFBZ0Msc0NBQWdC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