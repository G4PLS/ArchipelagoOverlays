export type Translation = Record<string, string>;

export interface Style {
    color: string;
}

export type StyleMap = Record<string, Style>

export interface AlertConfig {
    translations: Translation,
    style: StyleMap;
    audios: string[];
    images: string[];
    timeout: number;
    animation: string;
}

export interface AlertData extends AlertConfig {
    name: string;
}