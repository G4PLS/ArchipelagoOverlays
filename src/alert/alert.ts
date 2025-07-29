import type { AlertConfig } from "../settingsManager";
import { applyAnimation, removeAnimationFromElement } from "../animation";
import { stringToHue } from "../utility/utils";

export class AlertManager {
    private queue: Alert[] = [];
    private running: boolean = false;

    alertContainer: HTMLElement;

    constructor(alertContainer: HTMLElement) {
        this.alertContainer = alertContainer;
    }

    push(alert: Alert) {
        this.queue.push(alert);
        this.processQueue();
    }

    private async processQueue() {
        if (this.running)
            return;

        this.running = true;
        this.alertContainer.style.display = "";

        while (this.queue.length > 0) {
            const alert = this.queue.shift()!;
            await alert.display(this.alertContainer);
        }

        this.alertContainer.style.display = "none";
        this.running = false;
    }
}

export class Alert {
    alertConfig: AlertConfig;
    text?: string;

    constructor(config: AlertConfig) {
        this.alertConfig = config;

        this.text = ""
    };

    private pickRandom(arr?: string[]): string {
        if (!arr || arr.length === 0)
            return ""

        const index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }

    display(alertContainer: HTMLElement): Promise<void> {
        return new Promise((resolve) => {
            const imageElement: HTMLImageElement | null = alertContainer.querySelector("#alert-image")
            if (this.alertConfig.imageSources && imageElement) {
                const sourceString = this.pickRandom(this.alertConfig.imageSources);

                if (sourceString === "")
                    imageElement.removeAttribute("src")
                else
                    imageElement.src = sourceString
            }

            const audioElement: HTMLAudioElement | null = alertContainer.querySelector("#alert-audio")
            if (this.alertConfig.audioSources && audioElement) {
                const sourceString = this.pickRandom(this.alertConfig.audioSources);

                if (sourceString === "")
                    audioElement.removeAttribute("src")
                else {
                    audioElement.src = sourceString
                    audioElement.play();
                }
            }

            const textElement: HTMLElement | null = alertContainer.querySelector("#alert-text");
            if (this.text && textElement) {
                textElement.innerHTML = this.text;
            }

            if (this.alertConfig.animation)
                applyAnimation(alertContainer, this.alertConfig.animation)

            setTimeout(() => {
                if (this.alertConfig.animation) {
                    removeAnimationFromElement(alertContainer)

                    if (audioElement) {
                        audioElement.pause();
                        audioElement.currentTime = 0;
                    }
                    alertContainer.offsetWidth;
                }
                resolve()
            }, this.alertConfig.timeout);
        });
    }

    static createAndPush<T extends Alert>(this: new(...args: any[]) => T, manager: AlertManager, ...args: any[]): void {
        const alert = new this(...args)
        manager.push(alert)
    }
}

/*
 * ITEM ALERTS
 */

export class ItemAlert extends Alert {
    constructor(itemName: string, sender: string, alertConfig: AlertConfig) {
        super(alertConfig);
        
        const color = stringToHue(sender, 10);
        this.text = `Received <span style="color:${this.alertConfig.color}">${itemName}</span><br>from <span style="color:hsl(${color}, 70%, 50%)">${sender}</span>`
    }
}

export class DeathAlert extends Alert {
    constructor(source: string, alertConfig: AlertConfig) {
        super(alertConfig);
        
        const color = stringToHue(source, 10);
        this.text = `Received <span style="color:${this.alertConfig.color}">Death</span><br>from <span style="color:hsl(${color}, 70%, 50%)">${source}</span>`
    }
}

export class GoalAlert extends Alert {
    constructor(playerName: string, gameName: string, alertConfig: AlertConfig) {
        super(alertConfig);
        
        const color = stringToHue(playerName, 10);
        this.text = `<span style=color:"hsl(${color}, 70%, 50%)">${playerName}</span> <span style="color: yellow">finished</span> the goal in<br><span style="color: ${this.alertConfig.color}">${gameName}</span>!`
    }
}

export class CountdownAlert extends Alert {
    constructor(currentValue: number, alertConfig: AlertConfig) {
        super(alertConfig);

        if (currentValue === 0)
            this.text = `<span style="color: ${this.alertConfig.color}">GO</span>`
        else        
            this.text = `Starting in <span style="color: ${this.alertConfig.color}">${currentValue}</span>`
    }
}