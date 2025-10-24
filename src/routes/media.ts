import { getAudios, getImages, loadMedia } from '@/lib/media';
import '@/styles/pages/media.css';
import type { MediaData } from '@/types/media';

await loadMedia("/ArchipelagoOverlays/assets/alert/media.json");

const images = getImages();
const audios = getAudios();

const imageGrid: HTMLElement = document.querySelector("#image-grid");
const audioGrid: HTMLElement = document.querySelector("#audio-grid");

const mediaCardTemplate = document.querySelector('#media-card-template') as HTMLTemplateElement;
const mediaPlayerTemplate = document.querySelector('#media-card__player-template') as HTMLTemplateElement;

function createMediaCard(data: MediaData) {
    const clonedMediaCard = mediaCardTemplate.content.cloneNode(true) as DocumentFragment;

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

    return clonedMediaCard;
}

function appendMediaPlayer(data: MediaData, fragment: DocumentFragment) {
    const clonedMediaPlayer = mediaPlayerTemplate.content.cloneNode(true) as DocumentFragment;

    const imageContainer: HTMLDivElement = fragment.querySelector('.media-card__image');
    const imageElement: HTMLImageElement = fragment.querySelector(".media-card__image img");
    const mediaButton: HTMLButtonElement = clonedMediaPlayer.querySelector('.media-card__player__button');
    const mediaButtonImage: HTMLImageElement = clonedMediaPlayer.querySelector('.media-card__player__button img');
    const audioElement: HTMLAudioElement = clonedMediaPlayer.querySelector('.media-card__player audio');

    imageElement.src = "/ArchipelagoOverlays/assets/images/headphones.svg";
    audioElement.src = data.mediaLink;

    function updateButtonIcon(playing: boolean) {
        if (playing)
            mediaButtonImage.src = "/ArchipelagoOverlays/assets/images/stop.svg";
        else
            mediaButtonImage.src = "/ArchipelagoOverlays/assets/images/play.svg";
    }

    mediaButton.addEventListener('click', () => {
        if(audioElement.paused) {
            audioElement.play();
            audioElement.volume = 0.5;
        }
        else {
            audioElement.pause()
            audioElement.currentTime = 0;
        }
    })

    audioElement.addEventListener('playing', () => {
        updateButtonIcon(true);
    })

    audioElement.addEventListener('pause', () => {
        updateButtonIcon(false);
    });

    audioElement.addEventListener('ended', () => {
        updateButtonIcon(false);
    })

    imageContainer.appendChild(clonedMediaPlayer);
}

for (const image of images) {
    const card = createMediaCard(image);
    imageGrid.appendChild(card);
}

for (const audio of audios) {
    const card = createMediaCard(audio);
    appendMediaPlayer(audio, card);

    audioGrid.appendChild(card);
}