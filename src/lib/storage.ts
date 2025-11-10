import type { StorageKey, StorageSchema } from "@/types/storage";

export const storage = {
    get<T extends StorageKey>(key: T): StorageSchema[T]|null {
        const raw = localStorage.getItem(key);

        if (raw === null)
            return null;

        try {
            return JSON.parse(raw) as StorageSchema[T];
        } catch {
            return raw as unknown as StorageSchema[T];
        }
    },
    
    set<T extends StorageKey>(key: T, value: StorageSchema[T]): void {
        const data = typeof value === "string" ? value : JSON.stringify(value);
        localStorage.setItem(key, data);
    },

    remove<T extends StorageKey>(key: T) {
        localStorage.removeItem(key);
    }
}