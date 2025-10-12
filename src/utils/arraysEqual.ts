export function arraysEqual(a: any[], b: any[]): boolean {
    if (!a || !b)
        return false;

    if (a.length !== b.length)
        return false;

    const sortedA = [...a].sort();
    const sortedB = [...b].sort();

    return sortedA.every((element, index) => element === sortedB[index]);
}