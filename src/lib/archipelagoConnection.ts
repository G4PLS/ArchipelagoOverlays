import type { ArchipelagoConfig } from "@/types/archipelagoSettings";
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

    const url = searchParams.get("archipelago-url");
    const slots = searchParams.get("archipelago-slots")?.split(",") || [];
    const password = searchParams.get("archipelago-password");

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

    searchParams.set("archipelago-url", config.url);
    searchParams.set("archipelago-slots", config.slots.join(","));
    searchParams.set("archipelago-password", config.password);
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

export function connect(archipelagoUrl: string, slots: string[], password?: string, addHooks?: (client:Client, slot: string) => void) {
    if (!slots || slots.length === 0)
        return;


    for (const slot of slots)
        createClient(archipelagoUrl, slot, password, addHooks);
}

async function createClient(archipelagoUrl: string, slot: string, password?: string, addHooks?: (client:Client, slot: string) => void) {
    const client = new Client();

    try {
        if (addHooks)
            addHooks(client, slot);

        await client.login(archipelagoUrl, slot, undefined, {password: password||""})

        clients.set(slot, client);
    } catch(error) {
        console.error(error);
    }
}

//#endregion