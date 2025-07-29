import { type Item, type MessageNode, type Player } from "archipelago.js";
import { client, onConnected } from "../archipelago_connection";
import { AlertManager, ItemAlert, DeathAlert, GoalAlert, CountdownAlert } from "./alert";
import { SettingsManager } from "../settingsManager"
import "../style.css"

const alertContainer: HTMLElement = document.querySelector("#alert-container")

const manager = new AlertManager(alertContainer);
const settings = SettingsManager.getInstance()
await settings.loadConfig("/config.json")

onConnected(() => {
    client.items.on("itemsReceived", (items: Item[], index: number) => {
        if (index != 0) { // Change to != 0 to check only newly added things
            for (const item of items) {

                let itemType = "normal"

                if (item.progression)
                    itemType = "progression"
                else if (item.trap)
                    itemType = "trap"
                else if (item.useful)
                    itemType = "useful"
                else if (item.filler)
                    itemType = "normal"
                else
                    itemType = "undefined"

                const alertSettings = settings.getAlert("item-alert", itemType)

                ItemAlert.createAndPush(manager, item.name, item.sender.name, alertSettings)
            }
        }
    });

    client.messages.on(
        "countdown",
        (text: string, value: number, nodes: MessageNode[]) => {
            console.log("COUNTDOWN", text, value, nodes);
            if (text.includes("Starting"))
                return;

            const alertSettings = settings.getAlert("countdown")

            CountdownAlert.createAndPush(manager, value, alertSettings)
        }
    );

    client.messages.on(
        "goaled",
        (text: string, player: Player, nodes: MessageNode[]) => {
            const alertSettings = settings.getAlert("goal")

            GoalAlert.createAndPush(manager, player.name, player.game, alertSettings)
        }
    );

    client.messages.on(
        "itemCheated",
        (text: string, item: Item, nodes: MessageNode[]) => {
            console.log("CHEATED")
        }
    );

    client.deathLink.on(
        "deathReceived",
        (source: string, time: number, cause?: string) => {
            const alertSettings = settings.getAlert("deathlink")

            DeathAlert.createAndPush(manager, source, alertSettings)
        }
    );
});

(window as any).createItemAlert = (type: string = "undefined") => {
    const alertSettings = settings.getAlert(`${type}-item`)
    console.log(alertSettings);

    ItemAlert.createAndPush(manager, "Test Item", "Player1", alertSettings)
}

(window as any).createDeathAlert = () => {
    const alertSettings = settings.getAlert("deathlink")

    DeathAlert.createAndPush(manager, "Player1", alertSettings)
}

(window as any).createGoalAlert = () => {
    const alertSettings = settings.getAlert("goal")

    GoalAlert.createAndPush(manager, "Player1", "Undertale", alertSettings)
}

(window as any).createCountdownAlert = (currentTimer: number = 10) => {
    const alertSettings = settings.getAlert("countdown")

    CountdownAlert.createAndPush(manager, currentTimer, alertSettings)
}