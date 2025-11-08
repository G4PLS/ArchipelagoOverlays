import media from '@/data/media.json';
import type { MediaItemConfig, MediaItemInstance, MediaType } from '@/types/media';

const mediaStores: Record<MediaType, Map<string, MediaItemInstance>> = {
    audio: new Map(),
    image: new Map()
};

function initializeMedia() {
    createMediaEntries(mediaStores.image, media.images);
    createMediaEntries(mediaStores.audio, media.audios);
    console.log("INITIALIZED MEDIA");
}

function createMediaEntries(map: Map<string, MediaItemInstance>, media: Record<string, MediaItemConfig>) {
    Object.entries(media).forEach(([name, config]) => {
        map.set(name, {
            mediaName: name,
            mediaLink: config["media-link"],
            author: config.author,
            authorLink: config["author-link"],
            foundAt: config["found-at"],
            license: config.license,
            licenseLink: config["license-link"]
        })
    })
}

export function reload() {
    Object.entries(mediaStores).forEach(([_, value]) => {
        value.clear();
    })
    initializeMedia();
}

export function getMedia(mediaType: MediaType, name: string) {
    const store = mediaStores[mediaType];

    if (!store)
        return undefined;

    return store.get(name);
}

export function getMedias(mediaType: MediaType): MediaItemInstance[] {
    const store = mediaStores[mediaType];

    if (!store)
        return [];

    return Array.from(store.values());
}

export function getMediaNames(mediaType: MediaType): string[] {
    const store = mediaStores[mediaType];

    if (!store)
        return [];

    return Array.from(store.keys());
}

initializeMedia();