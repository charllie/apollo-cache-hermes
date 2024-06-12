"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitySnapshot = void 0;
var tslib_1 = require("tslib");
/**
 * Maintains a reference to a single entity within the cached graph, and any
 * bookkeeping metadata associated with it.
 *
 * Note that this houses all the _static_ values for an entity, but none of the
 * parameterized values that may also have been queried for it.
 */
var EntitySnapshot = /** @class */ (function () {
    function EntitySnapshot(
    /** A reference to the entity this snapshot is about. */
    data, 
    /** Other node snapshots that point to this one. */
    inbound, 
    /** The node snapshots that this one points to. */
    outbound) {
        var e_1, _a, e_2, _b;
        this.data = data;
        if (inbound) {
            this.inbound = new Map();
            try {
                for (var inbound_1 = tslib_1.__values(inbound), inbound_1_1 = inbound_1.next(); !inbound_1_1.done; inbound_1_1 = inbound_1.next()) {
                    var reference = inbound_1_1.value;
                    this.inbound.set(reference.id, reference);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (inbound_1_1 && !inbound_1_1.done && (_a = inbound_1.return)) _a.call(inbound_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (outbound) {
            this.outbound = new Map();
            try {
                for (var outbound_1 = tslib_1.__values(outbound), outbound_1_1 = outbound_1.next(); !outbound_1_1.done; outbound_1_1 = outbound_1.next()) {
                    var reference = outbound_1_1.value;
                    this.outbound.set(reference.id, reference);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (outbound_1_1 && !outbound_1_1.done && (_b = outbound_1.return)) _b.call(outbound_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    return EntitySnapshot;
}());
exports.EntitySnapshot = EntitySnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5U25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJFbnRpdHlTbmFwc2hvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBUUE7Ozs7OztHQU1HO0FBQ0g7SUFJRTtJQUNFLHdEQUF3RDtJQUNqRCxJQUFpQjtJQUN4QixtREFBbUQ7SUFDbkQsT0FBeUI7SUFDekIsa0RBQWtEO0lBQ2xELFFBQTBCOztRQUpuQixTQUFJLEdBQUosSUFBSSxDQUFhO1FBTXhCLElBQUksT0FBTyxFQUFFO1lBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOztnQkFDekIsS0FBd0IsSUFBQSxZQUFBLGlCQUFBLE9BQU8sQ0FBQSxnQ0FBQSxxREFBRTtvQkFBNUIsSUFBTSxTQUFTLG9CQUFBO29CQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2lCQUMzQzs7Ozs7Ozs7O1NBQ0Y7UUFFRCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7Z0JBQzFCLEtBQXdCLElBQUEsYUFBQSxpQkFBQSxRQUFRLENBQUEsa0NBQUEsd0RBQUU7b0JBQTdCLElBQU0sU0FBUyxxQkFBQTtvQkFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztpQkFDNUM7Ozs7Ozs7OztTQUNGO0lBQ0gsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQTFCRCxJQTBCQztBQTFCWSx3Q0FBYyJ9