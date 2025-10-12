export async function loadConfig<T>(path: string, defaultProcessor: (json: Record<string, T>) => void, urlParseProcessor?: () => void) {
    try {
        const res = await fetch(path);
        if (!res.ok)
            return;

        const json: Record<string, T> = await res.json();

        defaultProcessor(json);
        urlParseProcessor?.();
    } catch(error) {
        console.error(error);
    }
}

export async function loadSingleConfig<T>(path: string, defaultProcessor: (json: T) => void, urlParseProcessor?: () => void) {
    try {
        const res = await fetch(path);
        if (!res.ok)
            return;

        const json: T = await res.json();

        defaultProcessor(json);
        urlParseProcessor?.();
    } catch(error) {
        console.error(error);
    }
}