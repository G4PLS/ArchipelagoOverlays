import type { Client, ConnectedPacket, Hint, Item, MessageNode, Player } from "archipelago.js";
import { ConnectAlert, CountdownAlert, DeathAlert, DisconnectAlert, GoalAlert, HintAlert, ItemAlert, type Alert } from "./Alert";
import { ConnectionManager } from "@/ConnectionManager";
import { DisplayManager } from "@/display/DisplayManager";
import { SettingsManager } from "@/SettingsManager";
import { URLParser } from "@/URLParser";
import "@/style.css";
import { itemFlagToString } from "@/utility/utils";

const urlParser = URLParser.getInstance();
await urlParser.deconstructCurrentParams();

const settingsManager = SettingsManager.getInstance();

const displayContainer = document.getElementById("alert-container");
const displayManager = new DisplayManager<Alert>(displayContainer);

const { url, slots, password } = urlParser.archipelagoParams;

// @ts-ignore: unused variable
const connectionManager = new ConnectionManager(url, slots, password, (client: Client, slot: string) => {
    client.items.on("itemsReceived", (items: Item[], index: number) => {
        if (index != 0) { // Change to != 0 to check only newly added things
            for (const item of items) {
                const itemType = itemFlagToString(item);

                const alertSettings = settingsManager.getAlert(`${itemType}-item`);

                displayManager.push(new ItemAlert(item.name, item.sender.name, slot, alertSettings));
            }
        }
    });

    client.messages.on(
        "countdown",
        (text: string, value: number, _nodes: MessageNode[]) => {
            if (text.includes("Starting")) {
                displayManager.lockQueue();

                setTimeout(() => {
                    displayManager.unlockQueue();
                }, value * 1000);

                return;
            }
            else if (value === 0) {
                displayManager.unlockQueue();
            }

            const alertSettings = settingsManager.getAlert("countdown");
            displayManager.push(new CountdownAlert(value, slot, alertSettings), true);
        }
    );

    client.messages.on(
        "goaled",
        (_text: string, player: Player, _nodes: MessageNode[]) => {
            const alertSettings = settingsManager.getAlert("goal");

            displayManager.push(new GoalAlert(player.name, player.game, slot, alertSettings));
        }
    );

    client.messages.on(
        "itemCheated",
        (_text: string, _item: Item, _nodes: MessageNode[]) => {
            console.log("CHEATED");
        }
    );

    client.deathLink.on(
        "deathReceived",
        (source: string, _time: number, _cause?: string) => {
            const alertSettings = settingsManager.getAlert("deathlink");

            displayManager.push(new DeathAlert(source, slot, alertSettings));
        }
    );

    client.items.on("hintReceived", (hint: Hint) => {
        if (hint.found)
            return;

        const item = hint.item;
        const itemType = itemFlagToString(hint.item);

        const alertSettings = settingsManager.getAlert(`${itemType}-hint`);

        displayManager.push(new HintAlert(hint.entrance, item.name, item.sender.name, slot, alertSettings));
    });

    client.socket.on("connected", (packet: ConnectedPacket) => {
        const alertSettings = settingsManager.getAlert("connected");

        displayManager.push(new ConnectAlert(slot, alertSettings));
    });

    client.socket.on("disconnected", () => {
        const alertSettings = settingsManager.getAlert("disconnected");

        displayManager.push(new DisconnectAlert(slot, alertSettings));
    });
});

(window as any).createItemAlert = (type: string = "undefined") => {
    const alertSettings = settingsManager.getAlert(`${type}-item`);
    console.log(alertSettings);

    displayManager.push(new ItemAlert("Test Item", "Player 1", "Player 1", alertSettings));
};

(window as any).createDeathAlert = () => {
    const alertSettings = settingsManager.getAlert("deathlink");

    displayManager.push(new DeathAlert("Player1", "Player 1", alertSettings));
};

(window as any).createGoalAlert = () => {
    const alertSettings = settingsManager.getAlert("goal");

    displayManager.push(new GoalAlert("Player1", "Undertale", "Player 1", alertSettings));
};

(window as any).createCountdownAlert = (currentTimer: number = 10) => {
    const alertSettings = settingsManager.getAlert("countdown");

    displayManager.push(new CountdownAlert(currentTimer, "Player 1", alertSettings));
};