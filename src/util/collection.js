"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setsHaveSomeIntersection = exports.lazyImmutableDeepSet = exports.addToSet = exports.pathBeginsWith = exports.deepGet = void 0;
var tslib_1 = require("tslib");
/**
 * Gets a nested value, with support for blank paths.
 */
function deepGet(target, path) {
    var index = 0;
    var length = path.length;
    while (target != null && index < length) {
        target = target[path[index++]];
    }
    return target;
}
exports.deepGet = deepGet;
function pathBeginsWith(target, prefix) {
    if (target.length < prefix.length)
        return false;
    for (var i = 0; i < prefix.length; i++) {
        if (prefix[i] !== target[i])
            return false;
    }
    return true;
}
exports.pathBeginsWith = pathBeginsWith;
/**
 * Adds values to a set, mutating it.
 */
function addToSet(target, source) {
    var e_1, _a;
    try {
        for (var source_1 = tslib_1.__values(source), source_1_1 = source_1.next(); !source_1_1.done; source_1_1 = source_1.next()) {
            var value = source_1_1.value;
            target.add(value);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (source_1_1 && !source_1_1.done && (_a = source_1.return)) _a.call(source_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
exports.addToSet = addToSet;
/**
 * An immutable deep set, where it only creates containers (objects/arrays) if
 * they differ from the _original_ object copied from - even if
 * `_setValue` is called against it multiple times.
 */
function lazyImmutableDeepSet(target, original, path, value) {
    if (!path.length)
        return value;
    var parentNode;
    var targetNode = target;
    var originalNode = original;
    // We assume that the last path component is the key of a value; not a
    // container, so we stop there.
    for (var i = 0; i < path.length; i++) {
        var key = path[i];
        // If the target still references the original's objects, we need to diverge
        if (!targetNode || targetNode === originalNode) {
            if (typeof key === 'number') {
                targetNode = originalNode ? tslib_1.__spread(originalNode) : [];
            }
            else if (typeof key === 'string') {
                targetNode = originalNode ? tslib_1.__assign({}, originalNode) : {};
            }
            else {
                throw new Error("Unknown path type " + JSON.stringify(key) + " in path " + JSON.stringify(path) + " at index " + i);
            }
            if (i === 0) {
                // Make sure we have a reference to the new target. We can keep the
                // reference here because "target" is pointing as currentNode.data.
                target = targetNode;
            }
            else {
                parentNode[path[i - 1]] = targetNode;
            }
        }
        // Regardless, we keep walking deeper.
        parentNode = targetNode;
        targetNode = targetNode[key];
        originalNode = originalNode && originalNode[key];
    }
    // Finally, set the value in our previously or newly cloned target.
    parentNode[path[path.length - 1]] = value;
    return target;
}
exports.lazyImmutableDeepSet = lazyImmutableDeepSet;
function setsHaveSomeIntersection(left, right) {
    var e_2, _a;
    // Walk the smaller set.
    var _b = tslib_1.__read(left.size > right.size ? [right, left] : [left, right], 2), toIterate = _b[0], toCheck = _b[1];
    try {
        for (var toIterate_1 = tslib_1.__values(toIterate), toIterate_1_1 = toIterate_1.next(); !toIterate_1_1.done; toIterate_1_1 = toIterate_1.next()) {
            var value = toIterate_1_1.value;
            if (toCheck.has(value))
                return true;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (toIterate_1_1 && !toIterate_1_1.done && (_a = toIterate_1.return)) _a.call(toIterate_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return false;
}
exports.setsHaveSomeIntersection = setsHaveSomeIntersection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbGxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBOztHQUVHO0FBQ0gsU0FBZ0IsT0FBTyxDQUFDLE1BQVcsRUFBRSxJQUFnQjtJQUNuRCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDTixJQUFBLE1BQU0sR0FBSyxJQUFJLE9BQVQsQ0FBVTtJQUN4QixPQUFPLE1BQU0sSUFBSSxJQUFJLElBQUksS0FBSyxHQUFHLE1BQU0sRUFBRTtRQUN2QyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDaEM7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBUkQsMEJBUUM7QUFFRCxTQUFnQixjQUFjLENBQUMsTUFBa0IsRUFBRSxNQUFrQjtJQUNuRSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU07UUFBRSxPQUFPLEtBQUssQ0FBQztJQUNoRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUM7S0FDM0M7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFORCx3Q0FNQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsUUFBUSxDQUFJLE1BQWMsRUFBRSxNQUFtQjs7O1FBQzdELEtBQW9CLElBQUEsV0FBQSxpQkFBQSxNQUFNLENBQUEsOEJBQUEsa0RBQUU7WUFBdkIsSUFBTSxLQUFLLG1CQUFBO1lBQ2QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNuQjs7Ozs7Ozs7O0FBQ0gsQ0FBQztBQUpELDRCQUlDO0FBRUQ7Ozs7R0FJRztB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