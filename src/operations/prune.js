"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prune = void 0;
var GraphSnapshot_1 = require("../GraphSnapshot");
var read_1 = require("./read");
var write_1 = require("./write");
/**
 * Return a new graph snapshot pruned to just the shape of the given query
 */
function prune(context, snapshot, raw) {
    var queryResult = read_1.read(context, raw, snapshot);
    var pruned = write_1.write(context, new GraphSnapshot_1.GraphSnapshot(), raw, queryResult.result && queryResult.complete ? queryResult.result : {});
    return {
        snapshot: pruned.snapshot,
        complete: queryResult.complete,
    };
}
exports.prune = prune;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJ1bmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcnVuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxrREFBaUQ7QUFJakQsK0JBQThCO0FBQzlCLGlDQUFnQztBQUVoQzs7R0FFRztBQUNILFNBQWdCLEtBQUssQ0FBQyxPQUFxQixFQUFFLFFBQXVCLEVBQUUsR0FBaUI7SUFDckYsSUFBTSxXQUFXLEdBQUcsV0FBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakQsSUFBTSxNQUFNLEdBQUcsYUFBSyxDQUNsQixPQUFPLEVBQ1AsSUFBSSw2QkFBYSxFQUFFLEVBQ25CLEdBQUcsRUFDSCxXQUFXLENBQUMsTUFBTSxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQWdCLENBQ25GLENBQUM7SUFDRixPQUFPO1FBQ0wsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO1FBQ3pCLFFBQVEsRUFBRSxXQUFXLENBQUMsUUFBUTtLQUMvQixDQUFDO0FBQ0osQ0FBQztBQVpELHNCQVlDIn0=