import type { AnimationConfig } from "./animation";

export type Translation = Record<string, string>

export interface AlertAnimationInstance extends AnimationConfig {
    "reference": string;
}

export interface AlertConfig {
    timeout: string;
    translations: Translation;
    "audio-references": string[];
    "image-references": string[];
    animation: AlertAnimationInstance;
}

export interface AlertInstance {
    name: string;
    timeout: number;
    translations: Translation;
    audioReferences: string[];
    imageReferences: string[];
    animation: AlertAnimationInstance;
}