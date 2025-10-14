export type Translation = Record<string, string>;

export interface AlertAnimationConfig {
    reference: string;
    duration: number;
    iterations: number;
    timing: string;
}

export interface AlertConfig {
    "alert-reference": string;
    "timeout": number;
    translations: Translation;
    "audio-references": string[];
    "image-references": string[];
    animation: AlertAnimationConfig;
}

export interface AlertData {
    name: string;
    alertReference: string;
    timeout: number;
    translations: Translation;
    audioReferences: string[];
    imageReferences: string[];
    animation: AlertAnimationConfig;
}