"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneNodeSnapshot = void 0;
var references_1 = require("../util/references");
var EntitySnapshot_1 = require("./EntitySnapshot");
var ParameterizedValueSnapshot_1 = require("./ParameterizedValueSnapshot");
/**
 * Factory function for cloning nodes to their specific type signatures, while
 * preserving object shapes.
 */
function cloneNodeSnapshot(parent) {
    var inbound = parent.inbound ? new Map(parent.inbound) : undefined;
    var outbound = parent.outbound ? new Map(parent.outbound) : undefined;
    if (parent instanceof EntitySnapshot_1.EntitySnapshot) {
        return new EntitySnapshot_1.EntitySnapshot(parent.data, references_1.referenceValues(inbound), references_1.referenceValues(outbound));
    }
    else if (parent instanceof ParameterizedValueSnapshot_1.ParameterizedValueSnapshot) {
        return new ParameterizedValueSnapshot_1.ParameterizedValueSnapshot(parent.data, references_1.referenceValues(inbound), references_1.referenceValues(outbound));
    }
    else {
        throw new Error("Unknown node type: " + Object.getPrototypeOf(parent).constructor.name);
    }
}
exports.cloneNodeSnapshot = cloneNodeSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbG9uZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFBcUQ7QUFFckQsbURBQWtEO0FBRWxELDJFQUEwRTtBQUUxRTs7O0dBR0c7QUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxNQUFvQjtJQUNwRCxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNyRSxJQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUV4RSxJQUFJLE1BQU0sWUFBWSwrQkFBYyxFQUFFO1FBQ3BDLE9BQU8sSUFBSSwrQkFBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsNEJBQWUsQ0FBQyxPQUFPLENBQUMsRUFBRSw0QkFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7S0FDN0Y7U0FBTSxJQUFJLE1BQU0sWUFBWSx1REFBMEIsRUFBRTtRQUN2RCxPQUFPLElBQUksdURBQTBCLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSw0QkFBZSxDQUFDLE9BQU8sQ0FBQyxFQUFFLDRCQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztLQUN6RztTQUFNO1FBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBc0IsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBTSxDQUFDLENBQUM7S0FDekY7QUFDSCxDQUFDO0FBWEQsOENBV0MifQ==