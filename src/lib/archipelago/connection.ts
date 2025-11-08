import type { ArchipelagoInstance } from "@/types/archipelago";
import { Client } from "archipelago.js";

const clients: Map<string, Client> = new Map();

export async function connect(apConfig: ArchipelagoInstance, addHooks?: (client:Client, slot: string) => void, connectionFailed?: (slot: string) => void): Promise<void> {
    if (!apConfig.slots || apConfig.slots.length === 0) {
        if (connectionFailed)
            connectionFailed("ALL");
        return;
    }

    await Promise.allSettled(apConfig.slots.map(slot => createClient(apConfig.url, slot, apConfig.password, addHooks, connectionFailed)));
}

async function createClient(archipelagoUrl: string, slot: string, password?: string, addHooks?: (client:Client, slot: string) => void, connectionFailed?: (slot: string) => void): Promise<void> {
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