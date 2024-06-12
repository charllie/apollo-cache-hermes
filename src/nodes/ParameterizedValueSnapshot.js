"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterizedValueSnapshot = void 0;
var tslib_1 = require("tslib");
/**
 * Maintains a reference to the value of a specific parameterized field
 * contained within some other node.
 *
 * These values are stored outside of the entity that contains them, as the
 * entity node is reserved for static values.  At read time, these values are
 * overlaid on top of the static values of the entity that contains them.
 */
var ParameterizedValueSnapshot = /** @class */ (function () {
    function ParameterizedValueSnapshot(
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
    return ParameterizedValueSnapshot;
}());
exports.ParameterizedValueSnapshot = ParameterizedValueSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFyYW1ldGVyaXplZFZhbHVlU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJQYXJhbWV0ZXJpemVkVmFsdWVTbmFwc2hvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBUUE7Ozs7Ozs7R0FPRztBQUNIO0lBSUU7SUFDRSx3REFBd0Q7SUFDakQsSUFBZ0I7SUFDdkIsbURBQW1EO0lBQ25ELE9BQXlCO0lBQ3pCLGtEQUFrRDtJQUNsRCxRQUEwQjs7UUFKbkIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQU12QixJQUFJLE9BQU8sRUFBRTtZQUNYLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7Z0JBQ3pCLEtBQXdCLElBQUEsWUFBQSxpQkFBQSxPQUFPLENBQUEsZ0NBQUEscURBQUU7b0JBQTVCLElBQU0sU0FBUyxvQkFBQTtvQkFDbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztpQkFDM0M7Ozs7Ozs7OztTQUNGO1FBRUQsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O2dCQUMxQixLQUF3QixJQUFBLGFBQUEsaUJBQUEsUUFBUSxDQUFBLGtDQUFBLHdEQUFFO29CQUE3QixJQUFNLFNBQVMscUJBQUE7b0JBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7aUJBQzVDOzs7Ozs7Ozs7U0FDRjtJQUNILENBQUM7SUFDSCxpQ0FBQztBQUFELENBQUMsQUExQkQsSUEwQkM7QUExQlksZ0VBQTBCIn0=