import type { AlertConfig } from "@/SettingsManager";
import { pickRandom, stringToHue } from "@/utility/utils";
import { DisplayManagerItem } from "@/display/DisplayManager";
import { AnimationManager } from "@/settings/AnimationManager";

const animationManager = AnimationManager.getInstance();

export class Alert extends DisplayManagerItem {
    alertConfig: AlertConfig;
    text?: string;
    slot: string;

    constructor(slot: string, config: AlertConfig) {
        super();

        this.alertConfig = config;
        this.text = "";
        this.slot = slot;
    }

    async display(displayContainer: HTMLElement) {
        return new Promise<void>((resolve) => {
            const imageElement: HTMLImageElement | null =
                displayContainer.querySelector("#alert-image");

            if (this.alertConfig.imageSources && imageElement) {
                const sourceString = pickRandom(this.alertConfig.imageSources);

                if (sourceString === "") imageElement.removeAttribute("src");
                else imageElement.src = sourceString;
            }

            const audioElement: HTMLAudioElement | null =
                displayContainer.querySelector("#alert-audio");
            if (this.alertConfig.audioSources && audioElement) {
                const sourceString = pickRandom(this.alertConfig.audioSources);

                if (sourceString === "") audioElement.removeAttribute("src");
                else {
                    audioElement.src = sourceString;
                    audioElement.play();
                }
            }

            const textElement: HTMLElement | null =
                displayContainer.querySelector("#alert-text");
            if (this.text && textElement) {
                textElement.innerHTML = this.text;
            }

            if (this.alertConfig.animation)
                animationManager.applyAnimation(displayContainer, this.alertConfig.animation)

            this.timeout = setTimeout(() => {
                if (this.alertConfig.animation) {
                    animationManager.removeAnimation(displayContainer);

                    if (audioElement) {
                        audioElement.pause();
                        audioElement.currentTime = 0;
                    }
                    displayContainer.offsetWidth;
                }
                resolve();
            }, this.alertConfig.timeout);
        });
    }
}

export class ItemAlert extends Alert {
    constructor(
        itemName: string,
        sender: string,
        slot: string,
        alertConfig: AlertConfig
    ) {
        super(slot, alertConfig);

        const color = stringToHue(sender);
        this.text = `Received <span style="color:${this.alertConfig.color}">${itemName}</span><br>from <span style="color:hsl(${color}, 70%, 50%)">${sender}</span>`;
    }
}

export class DeathAlert extends Alert {
    constructor(source: string, slot: string, alertConfig: AlertConfig) {
        super(slot, alertConfig);

        const color = stringToHue(source);
        this.text = `Received <span style="color:${this.alertConfig.color}">Death</span><br>from <span style="color:hsl(${color}, 70%, 50%)">${source}</span>`;
    }
}

export class GoalAlert extends Alert {
    constructor(
        playerName: string,
        gameName: string,
        slot: string,
        alertConfig: AlertConfig
    ) {
        super(slot, alertConfig);

        const color = stringToHue(playerName);
        this.text = `<span style=color:"hsl(${color}, 70%, 50%)">${playerName}</span> <span style="color: yellow">finished</span> the goal in<br><span style="color: ${this.alertConfig.color}">${gameName}</span>!`;
    }
}

export class CountdownAlert extends Alert {
    constructor(currentValue: number, slot: string, alertConfig: AlertConfig) {
        super(slot, alertConfig);

        if (currentValue === 0)
            this.text = `<span style="color: ${this.alertConfig.color}">GO</span>`;
        else
            this.text = `Starting in <span style="color: ${this.alertConfig.color}">${currentValue}</span>`;
    }
}

export class HintAlert extends Alert {
    constructor(
        entrance: string,
        itemName: string,
        sender: string,
        slot: string,
        alertConfig: AlertConfig
    ) {
        super(slot, alertConfig);

        console.log(entrance);

        const color = stringToHue(sender);
        this.text = `Received <span style="color:${this.alertConfig.color}">${itemName}</span><br>from <span style="color:hsl(${color}, 70%, 50%)">${sender}</span>`;
    }
}

export class ItemChatedAlert extends Alert {
    constructor(slot: string, alertConfig: AlertConfig) {
        super(slot, alertConfig);
    }
}

export class ConnectAlert extends Alert {
    constructor(slot: string, alertConfig: AlertConfig) {
        super(slot, alertConfig);

        const color = stringToHue(slot);
        this.text = `<span style="color:${color}">${slot}</span> connected successfully`;
    }
}

export class DisconnectAlert extends Alert {
    constructor(slot: string, alertConfig: AlertConfig) {
        super(slot, alertConfig);

        const color = stringToHue(slot);
        this.text = `<span style="color:${color}">${slot}</span> disconnected`;
    }
}

export class ConnectionFailedAlert extends Alert {
    constructor(slot: string, alertConfig: AlertConfig) {
        super(slot, alertConfig);
    }
}
