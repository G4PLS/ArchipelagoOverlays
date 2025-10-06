import { Client } from "archipelago.js";

export class ConnectionManager {
    private clients: Map<string, Client> = new Map<string, Client>();
    hookEvent: (client: Client, slot: string) => void = () => { };

    constructor(archipelagoUrl: string, slots: string[], password?: string, hookEvent: (client: Client, slot: string) => void = () => { }) {
        this.hookEvent = hookEvent;
        this.setupClients(archipelagoUrl, slots, password);
    }

    private async setupClients(archipelagoUrl: string, slots: string[], password?: string) {
        if (!slots)
            return;

        for (const slot of slots) {
            const client = new Client();

            try {
                this.hookEvents(client, slot);

                await client.login(archipelagoUrl, slot, undefined, { password: password || "" });

                this.clients.set(slot, client);
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    private hookEvents(client: Client, slot: string) {
        this.hookEvent(client, slot);
    }

    public static async testConnections(archipelagoUrl: string, slots: string[], password?: string): Promise<Map<string, boolean>> {
        if (!slots)
            return null;

        const map: Map<string, boolean> = new Map<string, boolean>();

        for(const slot of slots) {
            const client = new Client();

            try {
                await client.login(archipelagoUrl, slot, undefined, {password: password||""});

                map.set(slot, true);
            } 
            catch(error) {
                console.error(error);
                map.set(slot, false);
            }
        }

        return map;
    }
}