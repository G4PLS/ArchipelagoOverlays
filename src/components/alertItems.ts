import { applyAnimation, removeAnimation } from "@/lib/animation";
import { DisplayItem } from "@/lib/display";
import { getAudio, getImage } from "@/lib/media";
import { parseText } from "@/lib/textParser";
import type { AlertData } from "@/types/alertSettings";
import type { TranslationVariables } from "@/types/translationVariables";
import { pickRandom } from "@/utils/arrayPickRandom";

export class Alert extends DisplayItem {
  slot: string;
  config: AlertData;
  variables?: TranslationVariables;

  constructor(slot: string, data: AlertData, variables?: TranslationVariables) {
    super();

    this.slot = slot;
    this.config = data;
    this.variables = variables
  }

  async display(displayContainer: HTMLElement) {
    console.log("DISPLAYING", this.slot, this.config.timeout);

    return new Promise<void>((resolve) => {
        this.setAudio(displayContainer);
        this.setText(displayContainer);
        this.setImage(displayContainer);
        this.setAnimation(displayContainer);

      this.timeout = setTimeout(() => {
        removeAnimation(displayContainer);

        resolve();
      }, this.config.timeout);
    });
  }

  private setText(displayContainer: HTMLElement) {
    const textElement: HTMLHeadingElement | null = displayContainer.querySelector("#alert-text");

    if (textElement) {
      const text = parseText(
        this.variables,
        this.config.style,
        this.config.translations
      );

      if (text) textElement.innerHTML = text;
    }
  }

  private setImage(displayContainer: HTMLElement) {
    const imageElement: HTMLImageElement | null = displayContainer.querySelector("#alert-image");

    if (this.config.images.length > 0 && imageElement) {
      const key = pickRandom<string>(this.config.images);

      const src = getImage(key);

      if (src === "" || src === undefined) imageElement.removeAttribute("src");
      else imageElement.src = src;
    }
  }

  private setAudio(displayContainer: HTMLElement) {
    const audioElement: HTMLAudioElement | null = displayContainer.querySelector("#alert-audio");

    if (this.config.audios.length > 0 && audioElement) {
      const key = pickRandom<string>(this.config.audios);

      const src = getAudio(key);

      if (src === "" || src === undefined) {
        audioElement.pause();
        audioElement.removeAttribute("src");
      } else {
        audioElement.src = src;
        audioElement.play();
      }
    }
  }
  
  private setAnimation(displayContainer: HTMLElement) {
    if (this.config.animation) {
      applyAnimation(displayContainer, this.config.animation);
    }
  }
}

export class ItemAlert extends Alert {
    constructor(itemName: string, sender: string, slot: string, alertConfig: AlertData) {
        super(slot, alertConfig, {
            target: sender,
            item: itemName
        });
    }
}