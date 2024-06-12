"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.write = void 0;
var SnapshotEditor_1 = require("./SnapshotEditor");
/**
 * Merges a payload with an existing graph snapshot, generating a new one.
 *
 * Performs the minimal set of edits to generate new immutable versions of each
 * node, while preserving immutability of the parent snapshot.
 */
function write(context, snapshot, raw, payload) {
    var tracerContext;
    if (context.tracer.writeStart) {
        tracerContext = context.tracer.writeStart(raw, payload);
    }
    // We _could_ go purely functional with the editor, but it's honestly pretty
    // convenient to follow the builder function instead - it'd end up passing
    // around a context object anyway.
    var editor = new SnapshotEditor_1.SnapshotEditor(context, snapshot);
    var warnings = editor.mergePayload(raw, payload).warnings;
    var newSnapshot = editor.commit();
    if (context.tracer.writeEnd) {
        context.tracer.writeEnd(context.parseOperation(raw), { payload: payload, newSnapshot: newSnapshot, warnings: warnings }, tracerContext);
    }
    return newSnapshot;
}
exports.write = write;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JpdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3cml0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFLQSxtREFBa0U7QUFFbEU7Ozs7O0dBS0c7QUFDSCxTQUFnQixLQUFLLENBQUMsT0FBcUIsRUFBRSxRQUF1QixFQUFFLEdBQWlCLEVBQUUsT0FBbUI7SUFDMUcsSUFBSSxhQUFhLENBQUM7SUFDbEIsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtRQUM3QixhQUFhLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3pEO0lBRUQsNEVBQTRFO0lBQzVFLDBFQUEwRTtJQUMxRSxrQ0FBa0M7SUFDbEMsSUFBTSxNQUFNLEdBQUcsSUFBSSwrQkFBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3QyxJQUFBLFFBQVEsR0FBSyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsU0FBdEMsQ0FBdUM7SUFDdkQsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRXBDLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDM0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sU0FBQSxFQUFFLFdBQVcsYUFBQSxFQUFFLFFBQVEsVUFBQSxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7S0FDekc7SUFFRCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDO0FBbEJELHNCQWtCQyJ9