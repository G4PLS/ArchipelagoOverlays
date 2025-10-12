import type { Media, MediaConfig } from "@/types/media";
import { loadSingleConfig } from "@/utils/configLoader";

const images: Map<string, string> = new Map();
const audios: Map<string, string> = new Map();

export async function loadMedia(path: string) {
    await loadSingleConfig<MediaConfig>(path, createMedia);

    console.log("MEDIA", images, audios)
}

function createMedia(config: MediaConfig) {
    createMediaEntries(images, config.images);
    createMediaEntries(audios, config.audios);
}

function createMediaEntries(map: Map<string, string>, media: Media) {
    Object.entries(media).forEach(([name, link]) => {
        map.set(name, link);
    })
}

export function getImageNames() {
    return Array.from(images.keys());
}

export function getAudioNames() {
    return Array.from(audios.keys());
}

export function getAudio(name: string) {
    return audios.get(name);
}

export function getImage(name: string) {
    return images.get(name);
}