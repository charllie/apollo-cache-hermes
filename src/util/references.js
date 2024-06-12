"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReferenceField = exports.referenceValues = exports.hasNodeReference = exports.addNodeReference = exports.removeNodeReference = void 0;
var tslib_1 = require("tslib");
var equality_1 = tslib_1.__importDefault(require("@wry/equality"));
/**
 * Mutates a snapshot, removing an inbound reference from it.
 *
 * Returns whether all references were removed.
 */
function removeNodeReference(direction, snapshot, id, path) {
    var references = snapshot[direction];
    if (!references)
        return true;
    if (!hasNodeReference(snapshot, direction, id, path)) {
        return false;
    }
    references.delete(id);
    return !references.size;
}
exports.removeNodeReference = removeNodeReference;
/**
 * Mutates a snapshot, adding a new reference to it.
 */
function addNodeReference(direction, snapshot, id, path) {
    if (!snapshot[direction]) {
        snapshot[direction] = new Map();
    }
    var references = snapshot[direction];
    if (!hasNodeReference(snapshot, direction, id, path)) {
        references.set(id, { id: id, path: path });
        return true;
    }
    return false;
}
exports.addNodeReference = addNodeReference;
/**
 * Return true if { id, path } is a valid reference in the node's references
 * array. Otherwise, return false.
 */
function hasNodeReference(snapshot, type, id, path) {
    var references = snapshot[type];
    var reference = references && references.get(id);
    return !!(reference && equality_1.default(reference.path, path));
}
exports.hasNodeReference = hasNodeReference;
/**
 * Return values from reference map
 */
function referenceValues(references) {
    if (!references) {
        return [];
    }
    return Array.from(references.values());
}
exports.referenceValues = referenceValues;
/**
 * Return true if of 'path' points to a valid reference field
 */
function isReferenceField(snapshot, path) {
    var references = snapshot['outbound'];
    return referenceValues(references).some(function (reference) { return equality_1.default(reference.path, path); });
}
exports.isReferenceField = isReferenceField;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlZmVyZW5jZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLG1FQUFvQztBQVFwQzs7OztHQUlHO0FBQ0gsU0FBZ0IsbUJBQW1CLENBQ2pDLFNBQTZCLEVBQzdCLFFBQXNCLEVBQ3RCLEVBQVUsRUFDVixJQUFnQjtJQUVoQixJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdkMsSUFBSSxDQUFDLFVBQVU7UUFBRSxPQUFPLElBQUksQ0FBQztJQUU3QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7UUFDcEQsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDMUIsQ0FBQztBQWZELGtEQWVDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixnQkFBZ0IsQ0FDOUIsU0FBNkIsRUFDN0IsUUFBc0IsRUFDdEIsRUFBVSxFQUNWLElBQWdCO0lBRWhCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDeEIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7S0FDakM7SUFFRCxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO1FBQ25ELFVBQXlDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBQSxFQUFFLElBQUksTUFBQSxFQUFFLENBQUMsQ0FBQztRQUNqRSxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBakJELDRDQWlCQztBQUVEOzs7R0FHRztBQUNILFNBQWdCLGdCQUFnQixDQUM5QixRQUFzQixFQUN0QixJQUF3QixFQUN4QixFQUFVLEVBQ1YsSUFBZ0I7SUFFaEIsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLElBQU0sU0FBUyxHQUFHLFVBQVUsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLGtCQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFURCw0Q0FTQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsZUFBZSxDQUFDLFVBQWtEO0lBQ2hGLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDZixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFMRCwwQ0FLQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsZ0JBQWdCLENBQzlCLFFBQXNCLEVBQ3RCLElBQWdCO0lBRWhCLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QyxPQUFPLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxTQUFTLElBQUksT0FBQSxrQkFBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQTdCLENBQTZCLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBTkQsNENBTUMifQ==