import type { Item } from "archipelago.js";
import { client, onConnected } from "./archipelago_connection";
import { AlertManager, ItemAlert } from "./alert";
import { SettingsManager } from "./settings";
import "./style.css";

const alertContainer: HTMLElement = document.querySelector("#alert-container")

const manager = new AlertManager(alertContainer);
const settings = await SettingsManager.loadFromLocalConfig("/config.json")

onConnected(() => {
    client.items.on("itemsReceived", (items: Item[], index: number) => {
        console.log(index)
        if (index == 0) {
            for (const item of items) {

                let itemType = "normal"

                if (item.progression)
                    itemType = "progression"
                else if (item.trap)
                    itemType = "trap"
                else if (item.useful)
                    itemType = "useful"

                const alertSettings = settings.getAlertSettings("item-alert", itemType)
                const animationSettings = settings.getAnimationRaw(alertSettings.animation)

                manager.push(new ItemAlert(item, alertSettings, animationSettings))
            }
        }
    });

    client.items.on("hintFound", (hint: Hint) => {
        console.log("HINT FOUND");
    });

    client.items.on("hintReceived", (hint: Hint) => {
        console.log("HINT RECEIVED");
    });

    client.messages.on(
        "countdown",
        (text: string, value: number, nodes: MessageNode[]) => {
            console.log("COUNTDOWN");
        }
    );

    client.messages.on(
        "goaled",
        (text: string, player: Player, nodes: MessageNode[]) => {
            manager.push();
        }
    );

    client.messages.on(
        "itemCheated",
        (text: string, item: Item, nodes: MessageNode[]) => {
            console.log("CHEATED");
        }
    );

    client.deathLink.on(
        "deathReceived",
        (source: string, time: number, cause?: string) => {
            console.log("DEATH");
        }
    );
})