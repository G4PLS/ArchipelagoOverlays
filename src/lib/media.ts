import type { MediaConfig, MediaData, MediaJson } from "@/types/media";
import { loadSingleConfig } from "@/utils/configLoader";

const images: Map<string, MediaData> = new Map();
const audios: Map<string, MediaData> = new Map();

export async function loadMedia(path: string) {
    await loadSingleConfig<MediaJson>(path, createMedia);

    console.log("MEDIA", images, audios)
}

function createMedia(config: MediaJson) {
    createMediaEntries(images, config.images);
    createMediaEntries(audios, config.audios);
}

function createMediaEntries(map: Map<string, MediaData>, media: Record<string, MediaConfig>) {
    Object.entries(media).forEach(([name, config]) => {
        map.set(name, {
            mediaName: name,
            mediaLink: config["media-link"],
            author: config.author,
            authorLink: config["author-link"],
            foundAt: config["found-at"],
            license: config.license,
            licenseLink: config["license-link"]
        });
    });
}

export function getImageNames() {
    return Array.from(images.keys());
}

export function getImages() {
    return Array.from(images.values());
}

export function getImage(name: string) {
    return images.get(name);
}

export function getAudioNames() {
    return Array.from(audios.keys());
}

export function getAudios() {
    return Array.from(audios.values());
}

export function getAudio(name: string) {
    return audios.get(name);
}