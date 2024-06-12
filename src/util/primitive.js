"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verboseTypeof = exports.isNumber = exports.isNil = exports.isObjectOrNull = exports.isObject = exports.isScalar = void 0;
function isScalar(value) {
    return value === null || typeof value !== 'object';
}
exports.isScalar = isScalar;
function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
exports.isObject = isObject;
function isObjectOrNull(value) {
    return typeof value === 'object' && !Array.isArray(value);
}
exports.isObjectOrNull = isObjectOrNull;
function isNil(value) {
    return value === null || value === undefined || Number.isNaN(value);
}
exports.isNil = isNil;
function isNumber(element) {
    return typeof element === 'number' && !Number.isNaN(element);
}
exports.isNumber = isNumber;
function verboseTypeof(value) {
    if (value === null) {
        return 'null';
    }
    return typeof value;
}
exports.verboseTypeof = verboseTypeof;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWl0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJpbWl0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLFNBQWdCLFFBQVEsQ0FBQyxLQUFVO0lBQ2pDLE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7QUFDckQsQ0FBQztBQUZELDRCQUVDO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLEtBQVU7SUFDakMsT0FBTyxLQUFLLEtBQUssSUFBSSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUUsQ0FBQztBQUZELDRCQUVDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLEtBQVU7SUFDdkMsT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVELENBQUM7QUFGRCx3Q0FFQztBQUVELFNBQWdCLEtBQUssQ0FBQyxLQUFVO0lBQzlCLE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEUsQ0FBQztBQUZELHNCQUVDO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLE9BQVk7SUFDbkMsT0FBTyxPQUFPLE9BQU8sS0FBSyxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFGRCw0QkFFQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxLQUFVO0lBQ3RDLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtRQUNsQixPQUFPLE1BQU0sQ0FBQztLQUNmO0lBQ0QsT0FBTyxPQUFPLEtBQUssQ0FBQztBQUN0QixDQUFDO0FBTEQsc0NBS0MifQ==