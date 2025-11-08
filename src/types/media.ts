export type MediaType = "image" | "audio";

export interface MediaItemConfig {
    "media-link": string;
    author?: string;
    "author-link"?: string;
    "found-at"?: string;
    "license"?: string;
    "license-link"?: string;
}

export interface MediaConfig {
    images: Record<string, MediaItemConfig>;
    audios: Record<string, MediaItemConfig>;
}

export interface MediaItemInstance {
    mediaName: string;
    mediaLink: string;
    author?: string;
    authorLink?: string;
    foundAt?: string;
    license?: string;
    licenseLink?: string;
}

export interface MediaInstance {
    images: Record<string, MediaItemInstance>;
    audios: Record<string, MediaItemInstance>;
}