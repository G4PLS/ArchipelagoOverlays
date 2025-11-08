import { valueEquals } from "./valueEquals";

export function addIfMatch<T>(params: URLSearchParams, key: string, value: T, baseValue: T | T[]) {
    const baseValues = Array.isArray(baseValue) ? baseValue : [baseValue];

    const matches = baseValues.some(b => valueEquals(value, b));

    if (matches)
        params.set(key, String(value));
}

export function addIfNoMatch<T>(params: URLSearchParams, key: string, value: T, baseValue: T | T[]) {
    const baseValues = Array.isArray(baseValue) ? baseValue : [baseValue];

    const matches = baseValues.some(b => valueEquals(value, b));

    if (!matches)
        params.set(key, String(value));
}