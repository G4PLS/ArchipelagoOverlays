export interface FontInstance {
    family: string;
    style: string;
    size: string;
    shadow: string;
}

export interface FontData {
    availableFonts: Record<string, string>;
    avaiableStyles: Record<string, string>;
    availableShadows: Record<string, string>;
}