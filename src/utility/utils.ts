import type { Item } from "archipelago.js";

// TODO: Maybe add a way to provide a custom cutoff/weight function
const hueCache: Map<string, number> = new Map<string, number>();

export function stringToHue(name: string, cutoff: number = 10): number {
    const cache = hueCache.get(name);
    if (cache)
        return cache;

    let total = 0;

    const effectiveCutoff = Math.max(2, cutoff);
    const length = Math.min(name.length, cutoff);

    for (let i = 0; i < length; i++) {
        const weight = 1 - i / (effectiveCutoff - 1);
        if (weight === 0) break; // stop once weight is zero

        const ascii = name.charCodeAt(i);
        total += ascii * weight;
    }

    total %= 360;
    hueCache.set(name, total);

    return total;
}

export function pickRandom(arr?: any[]): string {
    if (!arr || arr.length === 0)
        return "";

    const index = Math.floor(Math.random() * arr.length);
    return arr[index].link;
}

export function itemFlagToString(item: Item) {
    if (item.progression)
        return "progression";
    else if (item.trap)
        return "trap";
    else if (item.useful)
        return "useful";
    else if (item.filler)
        return "normal";
    else
        return "undefined";
}