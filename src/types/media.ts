export interface MediaConfig {
    "media-link": string;
    author: string;
    "author-link": string;
    "found-at": string;
    license: string;
    "license-link": string;
}

export interface MediaData {
    mediaName: string;
    mediaLink: string;
    author?: string;
    authorLink?: string;
    foundAt?: string;
    license?: string;
    licenseLink?: string;
}

export interface MediaJson {
    images: Record<string, MediaConfig>;
    audios: Record<string, MediaConfig>;
}