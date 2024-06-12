import { JsonObject, Nil, Scalar } from '../primitive';
export declare function isScalar(value: any): value is Scalar;
export declare function isObject(value: any): value is JsonObject;
export declare function isObjectOrNull(value: any): value is JsonObject | null;
export declare function isNil(value: any): value is Nil;
export declare function isNumber(element: any): element is Number;
export declare function verboseTypeof(value: any): string;
