import type { ArchipelagoInstance } from "@/types/archipelago";
import { overrideValues } from "@/utils/overrideInterfaceValues";
import { addIfNoMatch } from "@/utils/searchParams";

let config: ArchipelagoInstance = {
    url: undefined,
    slots: undefined,
    password: undefined
};

export function deconstructArchipelagoParams(params: URLSearchParams) {
    config = {
        url: params.get("ap-url"),
        slots: params.get("ap-slots")?.split(",") || [],
        password: params.get("ap-password")
    }
}

export function constructArchipelagoParams(params: URLSearchParams) {
    if (!config)
        return

    addIfNoMatch(params, "ap-url", config.url, [undefined, ""]);
    addIfNoMatch(params, "ap-slots", config.slots, [undefined, []]);
    addIfNoMatch(params, "ap-password", config.password, [undefined, ""]);
}

export function setArchipelagoConfig(override: Partial<ArchipelagoInstance>) {
    config = overrideValues<ArchipelagoInstance>(config, override);
}

export function getArchipelagoConfig(): ArchipelagoInstance {
    return config;
}