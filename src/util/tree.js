"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.walkOperation = void 0;
var OperationWalkNode = /** @class */ (function () {
    function OperationWalkNode(parsedOperation, parent) {
        this.parsedOperation = parsedOperation;
        this.parent = parent;
    }
    return OperationWalkNode;
}());
/**
 * Walk and run on ParsedQueryNode and the result.
 * This is used to verify result of the read operation.
 */
function walkOperation(rootOperation, result, visitor) {
    // Perform the walk as a depth-first traversal; and unlike the payload walk,
    // we don't bother tracking the path.
    var stack = [new OperationWalkNode(rootOperation, result)];
    while (stack.length) {
        var _a = stack.pop(), parsedOperation = _a.parsedOperation, parent_1 = _a.parent;
        // We consider null nodes to be skippable (and satisfy the walk).
        if (parent_1 === null)
            continue;
        // Fan-out for arrays.
        if (Array.isArray(parent_1)) {
            // Push in reverse purely for ergonomics: they'll be pulled off in order.
            for (var i = parent_1.length - 1; i >= 0; i--) {
                stack.push(new OperationWalkNode(parsedOperation, parent_1[i]));
            }
            continue;
        }
        var fields = [];
        // TODO: Directives?
        for (var fieldName in parsedOperation) {
            fields.push(fieldName);
            var nextParsedQuery = parsedOperation[fieldName].children;
            if (nextParsedQuery) {
                stack.push(new OperationWalkNode(nextParsedQuery, get(parent_1, fieldName)));
            }
        }
        if (fields.length) {
            var shouldStop = visitor(parent_1, fields);
            if (shouldStop)
                return;
        }
    }
}
exports.walkOperation = walkOperation;
function get(value, key) {
    // Remember: arrays are typeof 'object', too.
    return value !== null && typeof value === 'object' ? value[key] : undefined;
}
exports.get = get;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0E7SUFDRSwyQkFDa0IsZUFBeUMsRUFDekMsTUFBa0I7UUFEbEIsb0JBQWUsR0FBZixlQUFlLENBQTBCO1FBQ3pDLFdBQU0sR0FBTixNQUFNLENBQVk7SUFDakMsQ0FBQztJQUNOLHdCQUFDO0FBQUQsQ0FBQyxBQUxELElBS0M7QUFPRDs7O0dBR0c7QUFDSCxTQUFnQixhQUFhLENBQUMsYUFBdUMsRUFBRSxNQUE4QixFQUFFLE9BQXlCO0lBRTlILDRFQUE0RTtJQUM1RSxxQ0FBcUM7SUFDckMsSUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRTdELE9BQU8sS0FBSyxDQUFDLE1BQU0sRUFBRTtRQUNiLElBQUEsS0FBOEIsS0FBSyxDQUFDLEdBQUcsRUFBRyxFQUF4QyxlQUFlLHFCQUFBLEVBQUUsUUFBTSxZQUFpQixDQUFDO1FBQ2pELGlFQUFpRTtRQUNqRSxJQUFJLFFBQU0sS0FBSyxJQUFJO1lBQUUsU0FBUztRQUU5QixzQkFBc0I7UUFDdEIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQU0sQ0FBQyxFQUFFO1lBQ3pCLHlFQUF5RTtZQUN6RSxLQUFLLElBQUksQ0FBQyxHQUFHLFFBQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzNDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxlQUFlLEVBQUUsUUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMvRDtZQUNELFNBQVM7U0FDVjtRQUVELElBQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixvQkFBb0I7UUFDcEIsS0FBSyxJQUFNLFNBQVMsSUFBSSxlQUFlLEVBQUU7WUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2QixJQUFNLGVBQWUsR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQzVELElBQUksZUFBZSxFQUFFO2dCQUNuQixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxRQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzVFO1NBQ0Y7UUFFRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDakIsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFFBQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzQyxJQUFJLFVBQVU7Z0JBQUUsT0FBTztTQUN4QjtLQUNGO0FBQ0gsQ0FBQztBQW5DRCxzQ0FtQ0M7QUFFRCxTQUFnQixHQUFHLENBQUMsS0FBVSxFQUFFLEdBQWE7SUFDM0MsNkNBQTZDO0lBQzdDLE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQzlFLENBQUM7QUFIRCxrQkFHQyJ9