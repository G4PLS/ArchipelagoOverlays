import { Client } from "archipelago.js";

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