import type { ArchipelagoConfig } from "@/types/archipelagoSettings";
import { addToSearchParamIfNoMatch } from "@/utils/addToSearchParamIfMatch";
import { Client } from "archipelago.js";

//#region Configuration

let config: ArchipelagoConfig;

export function loadArchipelagoConfig() {
    const apConfig: ArchipelagoConfig = {
        url: undefined,
        slots: undefined,
        password: undefined
    };

    config = apConfig;

    deconstructArchipelagoUrlParams();
}

export function deconstructArchipelagoUrlParams(params?: URLSearchParams) {
    const searchParams: URLSearchParams = params || new URL(window.location.href).searchParams;

    const url = searchParams.get("ap-url");
    const slots = searchParams.get("ap-slots")?.split(",") || [];
    const password = searchParams.get("ap-password");

    config = {
        url,
        slots,
        password: password
    };
}

export function constructArchipelagoUrlParams(params?: URLSearchParams) {
    const searchParams = params || new URLSearchParams();

    if (!config)
        return searchParams;

    addToSearchParamIfNoMatch(params, "ap-url", config.url || "", "");
    addToSearchParamIfNoMatch(params, "ap-slots", config.slots, []);
    addToSearchParamIfNoMatch(params, "ap-password", config.password || "", "");
}

export function setArchipelagoSettings(override: Partial<ArchipelagoConfig>) {
    config = {
        url: override?.url ?? config.url,
        slots: override?.slots ?? config.slots,
        password: override?.password ?? config.password
    };
}

export function getArchipelagoConfig(): ArchipelagoConfig {
    return config;
}

//#endregion

//#region Connection

const clients: Map<string, Client> = new Map();

export function connect(archipelagoConfig?: ArchipelagoConfig, addHooks?: (client:Client, slot: string) => void, connectionFailed?: (slot: string) => void) {
    const apConfig = archipelagoConfig || config;
    
    if (!apConfig.slots || apConfig.slots.length === 0)
        return;

    for (const slot of apConfig.slots)
        createClient(apConfig.url, slot, apConfig.password, addHooks, connectionFailed);
}

async function createClient(archipelagoUrl: string, slot: string, password?: string, addHooks?: (client:Client, slot: string) => void, connectionFailed?: (slot: string) => void) {
    const client = new Client();

    try {
        if (addHooks)
            addHooks(client, slot);

        await client.login(archipelagoUrl, slot, undefined, {password: password||""})

        clients.set(slot, client);
    } catch(error) {
        console.error(error);
        
        if (connectionFailed)
            connectionFailed(slot);
    }
}

//#endregion