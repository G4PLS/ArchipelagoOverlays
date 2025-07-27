import type { Item } from "archipelago.js";
import type { AlertConfig, AnimationConfig } from "./settings";
import { generateAnimationCss, applyAnimationToElement, removeAnimationFromElement } from "./util";

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

        while (this.queue.length > 0) {
            const alert = this.queue.shift()!;
            await alert.display(this.alertContainer);
        }
    }
}

export class Alert {
    alertConfig: AlertConfig;
    animationConfig?: AnimationConfig;
    text?: string;

    constructor(config: AlertConfig = {color:[255,255,255], audioSources: [], imageSources: [], animation: "", timeout: 2000}, animationConfig?: AnimationConfig) {
        this.alertConfig = config;
        this.animationConfig = animationConfig

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
                imageElement.src = this.pickRandom(this.alertConfig.imageSources);
            }

            const audioElement: HTMLAudioElement | null = alertContainer.querySelector("#alert-audio")
            if (this.alertConfig.audioSources && audioElement) {
                audioElement.src = this.pickRandom(this.alertConfig.audioSources);
                audioElement.play();
            }

            const textElement: HTMLElement | null = alertContainer.querySelector("#alert-text");
            if (this.text && textElement) {
                textElement.innerHTML = this.text;
            }

            if (this.animationConfig)
                applyAnimationToElement(alertContainer, generateAnimationCss(this.animationConfig))

            setTimeout(() => {
                if (this.animationConfig) {
                    removeAnimationFromElement(alertContainer)
                    alertContainer.classList.remove(this.alertConfig.animation)
                    alertContainer.offsetWidth;
                }
                resolve()
            }, this.alertConfig.timeout);
        });
    }
}

/*
 * ITEM ALERTS
 */

export class ItemAlert extends Alert {
    private item: Item;

    constructor(item: Item, alertConfig: AlertConfig, animationConfig: AnimationConfig) {
        super(alertConfig, animationConfig);
        
        this.item = item;
        this.text = `Received <span style="color:${this.alertConfig.color}">${item.name}</span><br>from ${item.sender.name}`
    }

    display(alertContainer: HTMLElement): Promise<void> {
        console.debug(this.item.name, this.item.useful, this.item.progression, this.item.trap);
        return super.display(alertContainer);
    }
}