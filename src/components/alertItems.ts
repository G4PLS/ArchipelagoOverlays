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
  private resolveDisplay: () => void;

  constructor(slot: string, data: AlertData, variables?: TranslationVariables) {
    super();

    this.slot = slot;
    this.config = data;
    this.variables = variables;
  }

  cancel(): void {
    const audioElement =
      document.querySelector<HTMLAudioElement>(".alert-audio");
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement.removeAttribute("src");
    }

    // Remove animation
    const container = document.querySelector<HTMLElement>(".alert-container");
    if (container) {
      removeAnimation(container);
    }

    // Optionally clear image/text
    const img = document.querySelector<HTMLImageElement>(".alert-image");
    if (img) img.removeAttribute("src");

    const text = document.querySelector<HTMLElement>(".alert-text");
    if (text) text.innerHTML = "";

    if (this.resolveDisplay)
      this.resolveDisplay();
  }

  async display(displayContainer: HTMLElement) {
    return new Promise<void>((resolve) => {
      this.resolveDisplay = resolve;

      this.setAudio(displayContainer);
      this.setText(displayContainer);
      this.setImage(displayContainer);
      this.setAnimation(displayContainer);

      this.timeout = setTimeout(() => {
        removeAnimation(displayContainer);
        this.removeImage(displayContainer);
        this.resolveDisplay = undefined;

        resolve();
      }, this.config.timeout);
    });
  }

  private setText(displayContainer: HTMLElement) {
    const textElement: HTMLHeadingElement | null =
      displayContainer.querySelector(".alert-text");

    if (textElement) {
      const text = parseText(
        this.variables,
        this.config.name,
        this.config.translations
      );

      if (text !== null) textElement.innerHTML = text;
    }
  }

  private setImage(displayContainer: HTMLElement) {
    const imageElement: HTMLImageElement | null =
      displayContainer.querySelector(".alert-image");

    if (this.config.imageReferences && imageElement) {
      const key = pickRandom<string>(this.config.imageReferences);

      const src = getImage(key);

      if (src === "" || src === undefined) {
        imageElement.removeAttribute("src");
        imageElement.style.visibility = "hidden";
      } 
      else {
        imageElement.src = src;
        imageElement.style.visibility = "";
      }
    }
  }

  private removeImage(displayContainer: HTMLElement) {
    const imageElement: HTMLImageElement | null =
      displayContainer.querySelector(".alert-image");

    if (!imageElement)
      return;

    imageElement.src = "";
    imageElement.removeAttribute("src");
  }

  private setAudio(displayContainer: HTMLElement) {
    const audioElement: HTMLAudioElement | null =
      displayContainer.querySelector(".alert-audio");

    if (this.config.audioReferences.length > 0 && audioElement) {
      const key = pickRandom<string>(this.config.audioReferences);

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
      applyAnimation(displayContainer, {
        ...this.config.animation,
        duration: this.config.animation.duration || this.config.timeout
      });
    }
  }
}

export class ConnectionFailedAlert extends Alert {
  constructor(slot: string, config: AlertData) {
    super(slot, config, {
      slot: slot
    });
  }
}

export class ConnectedAlert extends Alert {
  constructor(slot: string, config: AlertData) {
    super(slot, config, {
      slot: slot
    });
  }
}

export class DisconnectAlert extends Alert {
  constructor(slot: string, config: AlertData) {
    super(slot, config, {
      slot: slot
    });
  }
}

export class ItemAlert extends Alert {
  constructor(slot: string, config: AlertData, itemName: string, sender: string) {
    super(slot, config, {
      slot,
      sender,
      item: itemName
    });
  }
}

export class DeathAlert extends Alert {
  constructor(slot: string, config: AlertData, sender: string, deathReason: string) {
    super(slot, config, {
      slot,
      sender,
      reason: deathReason
    });
  }
}

export class GoalAlert extends Alert {
  constructor(slot: string, config: AlertData, playerName: string, gameName: string) {
    super(slot, config, {
      player: playerName,
      game: gameName
    });
  }
}

export class CountdownAlert extends Alert {
  constructor(slot: string, config: AlertData, currentCounter: string) {
    super(slot, config, {
      countdown: currentCounter
    });
  }
}

export class HintAlert extends Alert {
  constructor(slot: string, config: AlertData, sender: string, hint: string) {
    super(slot, config, {
      slot,
      sender,
      hint
    });
  }
}