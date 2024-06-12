"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidEnvironment = void 0;
var errors_1 = require("./errors");
/**
 * Hermes relies on some ES6 functionality: iterators (via Symbol.iterator),
 * Sets, and Maps.
 *
 * Unfortunately, it can be tricky to polyfill correctly (and some environments
 * don't do it properly. Looking at you react-native on android). So, let's make
 * sure that everything is in a happy state, and complain otherwise.
 */
function assertValidEnvironment() {
    var missingBehavior = [];
    if (!_isSymbolPolyfilled())
        missingBehavior.push('Symbol');
    if (!_isSetPolyfilled())
        missingBehavior.push('Set');
    if (!_isMapPolyfilled())
        missingBehavior.push('Map');
    if (!missingBehavior.length)
        return;
    throw new errors_1.InvalidEnvironmentError({
        message: "Hermes requires some ES2015 features that your current environment lacks: "
            + (missingBehavior.join(', ') + ". Please polyfill!"),
        infoUrl: "https://bit.ly/2SGa7uz",
    });
}
exports.assertValidEnvironment = assertValidEnvironment;
function _isSymbolPolyfilled() {
    if (typeof Symbol !== 'function')
        return false;
    if (!Symbol.iterator)
        return false;
    return true;
}
function _isSetPolyfilled() {
    if (typeof Set !== 'function')
        return false;
    if (!_isSymbolPolyfilled())
        return false;
    if (typeof (new Set)[Symbol.iterator] !== 'function')
        return false;
    return true;
}
function _isMapPolyfilled() {
    if (typeof Set !== 'function')
        return false;
    if (!_isSymbolPolyfilled())
        return false;
    if (typeof (new Set)[Symbol.iterator] !== 'function')
        return false;
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbnZpcm9ubWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUQ7QUFFbkQ7Ozs7Ozs7R0FPRztBQUNILFNBQWdCLHNCQUFzQjtJQUNwQyxJQUFNLGVBQWUsR0FBRyxFQUFFLENBQUM7SUFDM0IsSUFBSSxDQUFDLG1CQUFtQixFQUFFO1FBQUUsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7UUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JELElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtRQUFFLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNO1FBQUUsT0FBTztJQUVwQyxNQUFNLElBQUksZ0NBQXVCLENBQUM7UUFDaEMsT0FBTyxFQUFFLDRFQUE0RTtlQUM5RSxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBb0IsQ0FBQTtRQUNyRCxPQUFPLEVBQUUsd0JBQXdCO0tBQ2xDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFaRCx3REFZQztBQUVELFNBQVMsbUJBQW1CO0lBQzFCLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVTtRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQy9DLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUTtRQUFFLE9BQU8sS0FBSyxDQUFDO0lBRW5DLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELFNBQVMsZ0JBQWdCO0lBQ3ZCLElBQUksT0FBTyxHQUFHLEtBQUssVUFBVTtRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQzVDLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ3pDLElBQUksT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFVBQVU7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUVuRSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxTQUFTLGdCQUFnQjtJQUN2QixJQUFJLE9BQU8sR0FBRyxLQUFLLFVBQVU7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUM1QyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUN6QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxVQUFVO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFFbkUsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDIn0=