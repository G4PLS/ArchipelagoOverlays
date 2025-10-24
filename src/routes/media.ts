import { getAudios, getImages, loadMedia } from '@/lib/media';
import '@/styles/pages/media.css';
import type { MediaData } from '@/types/media';

await loadMedia("/ArchipelagoOverlays/assets/alert/media.json");

const images = getImages();
const audios = getAudios();

const imageGrid: HTMLElement = document.querySelector("#image-grid");
const audioGrid: HTMLElement = document.querySelector("#audio-grid");

function createMediaCard(data: MediaData, container: HTMLElement) {
    const template = document.querySelector('#media-card-template') as HTMLTemplateElement;

    const clonedMediaCard = template.content.cloneNode(true) as DocumentFragment;

    const nameElement: HTMLAnchorElement = clonedMediaCard.querySelector(".media-card__name");
    const imageElement: HTMLImageElement = clonedMediaCard.querySelector(".media-card__image img");
    const imageLinkElement: HTMLAnchorElement = clonedMediaCard.querySelector(".media-card__image a");
    const authorElement: HTMLAnchorElement = clonedMediaCard.querySelector(".media-card__author");
    const licenseElement: HTMLAnchorElement = clonedMediaCard.querySelector(".media-card__license");

    if (nameElement) {
        nameElement.textContent = data.mediaName;
    }

    if (imageElement) {
        imageElement.src = data.mediaLink;
    }

    if (imageLinkElement) {
        imageLinkElement.href = data.mediaLink;
    }

    if (authorElement) {
        authorElement.href = data.authorLink;
        authorElement.textContent = data.author;
        authorElement.title = data.author;
    }

    if (licenseElement) {
        licenseElement.href = data.licenseLink;
        licenseElement.textContent = data.license ?? "LICENSE";
        licenseElement.title = data.license ?? "LICENSE"
    }

    container.appendChild(clonedMediaCard);
}

for (const image of images) {
    createMediaCard(image, imageGrid);
}

for (const audio of audios) {
    createMediaCard(audio, audioGrid);
}