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
    super.cancel();

    const audioElement =
      document.querySelector<HTMLAudioElement>(".alert__audio");
      
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement.removeAttribute("src");
    }

    // Remove animation
    const container = document.querySelector<HTMLElement>(".alert");
    if (container) {
      removeAnimation(container);

      this.removeImage(container);
      this.removeText(container);
    }

    if (this.resolveDisplay)
      this.resolveDisplay();
  }

  async display(displayContainer: HTMLElement) {
    if (!this.config) {
      console.error("CONFIG WAS NOT DEFINED!", this.slot);
      return;
    }

    return new Promise<void>((resolve) => {
      this.resolveDisplay = resolve;

      this.setAudio(displayContainer);
      this.setText(displayContainer);
      this.setImage(displayContainer);
      this.setAnimation(displayContainer);

      this.timeout = setTimeout(() => {
        removeAnimation(displayContainer);
        this.removeText(displayContainer);
        this.removeImage(displayContainer);
        this.removeAudio(displayContainer);

        this.resolveDisplay = undefined;

        resolve();
      }, this.config.timeout);
    });
  }

  private setText(displayContainer: HTMLElement) {
    const textElement: HTMLHeadingElement | null =
      displayContainer.querySelector(".alert__text");

    if (!textElement)
      return;

    const text = parseText(
        this.variables,
        this.config.name,
        this.config.translations
      );

      if (text === null) 
        return;

      textElement.innerHTML = text;
      textElement.classList.add(this.config.name);
  }

  private removeText(displayContainer: HTMLElement) {
    const textElement: HTMLHeadingElement | null =
      displayContainer.querySelector(".alert__text");

    if (!textElement)
      return;

    textElement.innerHTML = "";
    textElement.className = "alert__text";
  }

  private setImage(displayContainer: HTMLElement) {
    const imageElement: HTMLImageElement | null =
      displayContainer.querySelector(".alert__image");

    if (this.config.imageReferences && imageElement) {
      const key = pickRandom<string>(this.config.imageReferences);

      const media = getImage(key);

      if (media === undefined || media.mediaLink === "") {
        imageElement.removeAttribute("src");
        imageElement.style.visibility = "hidden";
      } 
      else {
        imageElement.src = media.mediaLink;
        imageElement.style.visibility = "";
      }
    }
  }

  private removeImage(displayContainer: HTMLElement) {
    const imageElement: HTMLImageElement | null =
      displayContainer.querySelector(".alert__image");

    if (!imageElement)
      return;

    imageElement.src = "";
    imageElement.removeAttribute("src");
  }

  private setAudio(displayContainer: HTMLElement) {
    const audioElement: HTMLAudioElement | null =
      displayContainer.querySelector(".alert__audio");

    if (this.config.audioReferences.length > 0 && audioElement) {
      const key = pickRandom<string>(this.config.audioReferences);

      const media = getAudio(key);

      if (media === undefined || media.mediaLink === "") {
        audioElement.pause();
        audioElement.removeAttribute("src");
      } else {
        audioElement.src = media.mediaLink;
        audioElement.play();
      }
    }
  }

  private removeAudio(displayContainer: HTMLElement) {
    const audioElement: HTMLAudioElement | null =
      displayContainer.querySelector(".alert__audio");

    if (!audioElement)
      return;

    audioElement.src = "";
    audioElement.removeAttribute("src");
    audioElement.pause();
    audioElement.currentTime = 0;
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
  constructor(slot: string, config: AlertData, sender: string, item: string, location: string) {
    super(slot, config, {
      slot,
      sender,
      item,
      location
    });
  }
}