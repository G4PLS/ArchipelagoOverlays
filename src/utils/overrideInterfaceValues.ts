export function overrideValues<T>(original: T, overrides: Partial<T>): T {
    return {...original, ...overrides};
}