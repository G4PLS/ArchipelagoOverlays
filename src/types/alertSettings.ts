export type Translation = Record<string, string>;

export interface Style {
    color: string;
}

export type StyleMap = Record<string, Style>

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
    style: StyleMap;
    "audio-references": string[];
    "image-references": string[];
    animation: AlertAnimationConfig;
}

export interface AlertData {
    name: string;
    alertReference: string;
    timeout: number;
    translations: Translation;
    style: StyleMap;
    audioReferences: string[];
    imageReferences: string[];
    animation: AlertAnimationConfig;
}