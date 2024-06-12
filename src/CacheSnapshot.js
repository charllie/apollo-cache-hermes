"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheSnapshot = void 0;
/**
 * Maintains an immutable, point-in-time view of the cache.
 *
 * We make CacheSnapshot a class instead of an interface because
 * to garuntee consistentcy of properties and their order. This
 * improves performance as JavaScript VM can do better optimization.
 */
var CacheSnapshot = /** @class */ (function () {
    function CacheSnapshot(
    /** The base snapshot for this version of the cache. */
    baseline, 
    /** The optimistic view of this version of this cache (may be base). */
    optimistic, 
    /** Individual optimistic updates for this version. */
    optimisticQueue) {
        this.baseline = baseline;
        this.optimistic = optimistic;
        this.optimisticQueue = optimisticQueue;
    }
    return CacheSnapshot;
}());
exports.CacheSnapshot = CacheSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FjaGVTbmFwc2hvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNhY2hlU25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0E7Ozs7OztHQU1HO0FBQ0g7SUFDRTtJQUNFLHVEQUF1RDtJQUNoRCxRQUF1QjtJQUM5Qix1RUFBdUU7SUFDaEUsVUFBeUI7SUFDaEMsc0RBQXNEO0lBQy9DLGVBQXNDO1FBSnRDLGFBQVEsR0FBUixRQUFRLENBQWU7UUFFdkIsZUFBVSxHQUFWLFVBQVUsQ0FBZTtRQUV6QixvQkFBZSxHQUFmLGVBQWUsQ0FBdUI7SUFDNUMsQ0FBQztJQUNOLG9CQUFDO0FBQUQsQ0FBQyxBQVRELElBU0M7QUFUWSxzQ0FBYSJ9