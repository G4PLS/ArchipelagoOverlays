// TODO: Maybe add a way to provide a custom cutoff/weight function
const hueCache: Map<string, number> = new Map<string, number>();

export function stringToHue(name: string, cutoff: number): number {
    const cache = hueCache.get(name);
    if (cache)
        return cache;

    let total = 0;

    const effectiveCutoff = Math.max(2, cutoff);
    const length = Math.min(name.length, cutoff);

    for (let i = 0; i < length; i++) {
        const weight = 1 - i / (effectiveCutoff - 1)
        if (weight === 0) break; // stop once weight is zero

        const ascii = name.charCodeAt(i);
        total += ascii * weight;
    }

    total %= 360;
    hueCache.set(name, total)

    return total;
}
