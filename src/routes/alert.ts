import { Alert, ConnectedAlert, ConnectionFailedAlert, CountdownAlert, DeathAlert, DisconnectAlert, GoalAlert, HintAlert, ItemAlert } from '@/lib/displayItems/alertItems';
import { Display } from '@/lib/display';
import '@/styles/pages/alert.css';
import type { Client, ConnectedPacket, Hint, Item, MessageNode, Player } from 'archipelago.js';
import { getAlert } from '@/lib/alert';
import { connect } from '@/lib/archipelago/connection';
import { deconstructUrl } from '@/utils/urlParser';
import { alertUrlParser } from '@/urlParsers/alert';
import { getArchipelagoConfig } from '@/lib/archipelago/config';
import { initializeAnimations } from '@/lib/animation';
import animationConfig from '@/data/animations.json';

const container: HTMLDivElement = document.querySelector(".alert")!;

initializeAnimations(animationConfig);
deconstructUrl(alertUrlParser);

const alertDisplay = new Display<Alert>(container);
alertDisplay.push(new Alert("", getAlert("load")));

connect(getArchipelagoConfig(), (client: Client, slot: string) => {
    client.socket.on("connected", (_: ConnectedPacket) => {
        const alertData = getAlert("connected");

        alertDisplay.push(new ConnectedAlert(slot, alertData));
    });

    client.socket.on("disconnected", () => {
        const alertData = getAlert("disconnect");

        alertDisplay.push(new DisconnectAlert(slot, alertData));
    });

    client.messages.on("countdown", (text: string, value: number, _: MessageNode[]) => {
        if (text.includes("Starting")) {
            alertDisplay.lockQueue();

            setTimeout(() => alertDisplay.unlockQueue());

            return;
        } else if (value === 0) {
            alertDisplay.unlockQueue();
        }

        const alertData = getAlert("countdown");

        const countdownText = value > 0 ? value.toString() : "GO"

        alertDisplay.push(new CountdownAlert(slot, alertData, countdownText), true);
    });

    client.messages.on("goaled", (_: string, player: Player, __: MessageNode[]) => {
        const alertData = getAlert("goal");
        alertDisplay.push(new GoalAlert(slot, alertData, player.name, player.game))
    });

    client.items.on("itemsReceived", (items: Item[], index: number) => {
        if (index != 0) {
            for (const item of items) {
                let alertData = getAlert("undefined-item");

                if (item.filler)
                    alertData = getAlert("filler-item");
                else if (item.progression)
                    alertData = getAlert("progression-item");
                else if (item.useful)
                    alertData = getAlert("useful-item");
                else if (item.trap)
                    alertData = getAlert("trap-item");

                alertDisplay.push(new ItemAlert(slot, alertData, item.name, item.sender.name));
            }
        }
    });

    client.items.on("hintReceived", (hint: Hint) => {
        let alertData = getAlert("hint");

        if (hint.found)
            alertData = getAlert("hint-found"); 

        const item = hint.item;

        alertDisplay.push(new HintAlert(slot, alertData, item.sender.name, item.name, item.locationName))
    });

    client.deathLink.on("deathReceived", (source: string, _time: number, cause?: string) => {
        const alertData = getAlert("death");
        alertDisplay.push(new DeathAlert(slot, alertData, source, cause || "undefined"))
    });
}, (slot: string) => {
    const alertData = getAlert("failed-connection");
    alertDisplay.push(new ConnectionFailedAlert(slot, alertData))
});