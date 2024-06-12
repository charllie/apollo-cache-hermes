"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphSnapshot = void 0;
var deepFreeze = require("deep-freeze-strict");
/**
 * Maintains an identity map of all value snapshots that reference into a
 * particular version of the graph.
 *
 * Provides an immutable view into the graph at a point in time.
 *
 * Also provides a place to hang per-snapshot caches off of.
 */
var GraphSnapshot = /** @class */ (function () {
    /**
     * @internal
     */
    function GraphSnapshot(
    // TODO: Profile Object.create(null) vs Map.
    _values) {
        if (_values === void 0) { _values = Object.create(null); }
        this._values = _values;
        /** Cached results for queries. */
        this.readCache = new Map();
    }
    /**
     * Retrieves the value identified by `id`.
     */
    GraphSnapshot.prototype.getNodeData = function (id) {
        var snapshot = this.getNodeSnapshot(id);
        return snapshot ? snapshot.data : undefined;
    };
    /**
     * Returns whether `id` exists as an value in the graph.
     */
    GraphSnapshot.prototype.has = function (id) {
        return id in this._values;
    };
    /**
     * Retrieves the snapshot for the value identified by `id`.
     *
     * @internal
     */
    GraphSnapshot.prototype.getNodeSnapshot = function (id) {
        return this._values[id];
    };
    /**
     * Returns the set of ids present in the snapshot.
     *
     * @internal
     */
    GraphSnapshot.prototype.allNodeIds = function () {
        return Object.keys(this._values);
    };
    /**
     * Freezes the snapshot (generally for development mode)
     *
     * @internal
     */
    GraphSnapshot.prototype.freeze = function () {
        deepFreeze(this._values);
    };
    return GraphSnapshot;
}());
exports.GraphSnapshot = GraphSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhcGhTbmFwc2hvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkdyYXBoU25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0NBQWtEO0FBT2xEOzs7Ozs7O0dBT0c7QUFDSDtJQUtFOztPQUVHO0lBQ0g7SUFDRSw0Q0FBNEM7SUFDckMsT0FBOEM7UUFBOUMsd0JBQUEsRUFBQSxVQUEyQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUE5QyxZQUFPLEdBQVAsT0FBTyxDQUF1QztRQVJ2RCxrQ0FBa0M7UUFDbEIsY0FBUyxHQUFHLElBQUksR0FBRyxFQUEyRCxDQUFDO0lBUTVGLENBQUM7SUFFSjs7T0FFRztJQUNILG1DQUFXLEdBQVgsVUFBWSxFQUFVO1FBQ3BCLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUMsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUM5QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCwyQkFBRyxHQUFILFVBQUksRUFBVTtRQUNaLE9BQU8sRUFBRSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCx1Q0FBZSxHQUFmLFVBQWdCLEVBQVU7UUFDeEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsa0NBQVUsR0FBVjtRQUNFLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCw4QkFBTSxHQUFOO1FBQ0UsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUgsb0JBQUM7QUFBRCxDQUFDLEFBdkRELElBdURDO0FBdkRZLHNDQUFhIn0=