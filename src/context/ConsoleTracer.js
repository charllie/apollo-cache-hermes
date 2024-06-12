"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleTracer = void 0;
var tslib_1 = require("tslib");
var INDENT = '  ';
/**
 * The default tracer used by the cache.
 *
 * By default it logs only warnings, but a verbose mode can be enabled to log
 * out all cache operations.
 */
var ConsoleTracer = /** @class */ (function () {
    function ConsoleTracer(_verbose, _logger) {
        if (_logger === void 0) { _logger = ConsoleTracer.DefaultLogger; }
        this._verbose = _verbose;
        this._logger = _logger;
        // Used when emulating grouping behavior.
        this._indent = 0;
    }
    ConsoleTracer.prototype.warning = function (message) {
        var metadata = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            metadata[_i - 1] = arguments[_i];
        }
        if (this._verbose)
            return;
        this._emit.apply(this, tslib_1.__spread(['warn', message], metadata));
    };
    ConsoleTracer.prototype.readEnd = function (operation, info) {
        if (!this._verbose)
            return;
        var message = this.formatOperation('read', operation);
        if (info.cacheHit) {
            this._emit('debug', message + " (cached)", info.result);
        }
        else {
            this._emit('info', message, info.result);
        }
    };
    ConsoleTracer.prototype.writeEnd = function (operation, info) {
        var _this = this;
        if (!this._verbose)
            return;
        var payload = info.payload, newSnapshot = info.newSnapshot, warnings = info.warnings;
        var message = this.formatOperation('write', operation);
        // Extended logging for writes that trigger warnings.
        if (warnings) {
            this._group(message, function () {
                var e_1, _a;
                _this._emit('warn', 'payload with warnings:', payload);
                try {
                    for (var warnings_1 = tslib_1.__values(warnings), warnings_1_1 = warnings_1.next(); !warnings_1_1.done; warnings_1_1 = warnings_1.next()) {
                        var warning = warnings_1_1.value;
                        _this._emit('warn', warning);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (warnings_1_1 && !warnings_1_1.done && (_a = warnings_1.return)) _a.call(warnings_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                _this._emit('debug', 'new snapshot:', newSnapshot);
            });
        }
        else {
            this._emit('debug', message, { payload: payload, newSnapshot: newSnapshot });
        }
    };
    ConsoleTracer.prototype.transactionEnd = function (error) {
        if (error) {
            this._emit('warn', "Rolling transaction back due to error:", error);
        }
    };
    // eslint-disable-next-line class-methods-use-this
    ConsoleTracer.prototype.formatOperation = function (action, operation) {
        var _a = operation.info, operationType = _a.operationType, operationName = _a.operationName;
        return action + "(" + operationType + " " + operationName + ")";
    };
    // Internal
    ConsoleTracer.prototype._emit = function (level, message) {
        var _a;
        var metadata = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            metadata[_i - 2] = arguments[_i];
        }
        if (this._indent) {
            for (var i = 0; i < this._indent; i++) {
                message = "" + INDENT + message;
            }
        }
        (_a = this._logger)[level].apply(_a, tslib_1.__spread([message], metadata));
    };
    ConsoleTracer.prototype._group = function (message, callback) {
        this._groupStart(message);
        try {
            callback();
        }
        finally {
            this._groupEnd();
        }
    };
    ConsoleTracer.prototype._groupStart = function (message) {
        if (this._logger.group && this._logger.groupEnd) {
            this._logger.group(message);
        }
        else {
            this._indent += 1;
            this._logger.info(message);
        }
    };
    ConsoleTracer.prototype._groupEnd = function () {
        if (this._logger.group && this._logger.groupEnd) {
            this._logger.groupEnd();
        }
        else {
            this._indent -= 1;
        }
    };
    return ConsoleTracer;
}());
exports.ConsoleTracer = ConsoleTracer;
(function (ConsoleTracer) {
    ConsoleTracer.DefaultLogger = {
        debug: _makeDefaultEmitter('debug'),
        info: _makeDefaultEmitter('info'),
        warn: _makeDefaultEmitter('warn'),
        // Grouping:
        group: _makeDefaultEmitter('group'),
        groupEnd: console.groupEnd ? console.groupEnd.bind(console) : function () { },
    };
})(ConsoleTracer = exports.ConsoleTracer || (exports.ConsoleTracer = {}));
exports.ConsoleTracer = ConsoleTracer;
function _makeDefaultEmitter(level) {
    var method = console[level] || console.log;
    return function defaultLogger(message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        method.call.apply(method, tslib_1.__spread([console, "[Cache] " + message], args));
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uc29sZVRyYWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvbnNvbGVUcmFjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQztBQUVwQjs7Ozs7R0FLRztBQUNIO0lBS0UsdUJBQ1UsUUFBaUIsRUFDakIsT0FBMkQ7UUFBM0Qsd0JBQUEsRUFBQSxVQUFnQyxhQUFhLENBQUMsYUFBYTtRQUQzRCxhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQ2pCLFlBQU8sR0FBUCxPQUFPLENBQW9EO1FBTHJFLHlDQUF5QztRQUNqQyxZQUFPLEdBQUcsQ0FBQyxDQUFDO0lBS2pCLENBQUM7SUFFSiwrQkFBTyxHQUFQLFVBQVEsT0FBZTtRQUFFLGtCQUFrQjthQUFsQixVQUFrQixFQUFsQixxQkFBa0IsRUFBbEIsSUFBa0I7WUFBbEIsaUNBQWtCOztRQUN6QyxJQUFJLElBQUksQ0FBQyxRQUFRO1lBQUUsT0FBTztRQUMxQixJQUFJLENBQUMsS0FBSyxPQUFWLElBQUksb0JBQU8sTUFBTSxFQUFFLE9BQU8sR0FBSyxRQUFRLEdBQUU7SUFDM0MsQ0FBQztJQUVELCtCQUFPLEdBQVAsVUFBUSxTQUE0QixFQUFFLElBQXFCO1FBQ3pELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU87UUFDM0IsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDeEQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFLLE9BQU8sY0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN6RDthQUFNO1lBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMxQztJQUNILENBQUM7SUFFRCxnQ0FBUSxHQUFS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