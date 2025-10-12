import { valueEquals } from "./valueEquals";

export function addToSearchParamIfMatch<T>(params: URLSearchParams, key: string, value: T, baseValue: T) {
    if(valueEquals(value, baseValue))
        params.set(key, String(value));
}

export function addToSearchParamIfNoMatch<T>(params: URLSearchParams, key: string, value: T, baseValue: T) {
    if(!valueEquals(value, baseValue))
        params.set(key, String(value));
}