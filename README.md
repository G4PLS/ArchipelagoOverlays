<h1>
  <img src="https://github.com/user-attachments/assets/32eb2d6c-ec13-4d99-8205-08870b8617ea" 
       alt="icon" style="width:32px; height:32px;">
  Archipelago Overlays
</h1>

Archipelago Overlays provides customizable overlays for OBS, designed to react to Archipelago in-game events—such as receiving an item—much like Twitch overlays that trigger on follows or subscriptions. 
The goal is to offer a collection of easy-to-use overlays that you can directly use through GitHub Pages.

## Features
- Dynamic overlays that respond to Archipelago events (e.g., item recieved)
- Easily embeddable in OBS or other streaming software thanks to GitHub Pages
- Extensible Configuration for the Overlays thanks to config pages and css classes

## Usage

1. Go to the GitHub Pages link
2. Go to the configurator and configure the overlay to your needs
3. Paste the generated URL into an OBS Browser source
4. Adjust width/height to fit your stream (minimum recommended: 600x600).

## Configuration

Overlays will have an Configuration page where you can generate a URL that can then be pasted into an OBS Browser source.

<img width="1892" height="962" alt="Image: Configuration page for the Alerts" src="https://github.com/user-attachments/assets/dcfe5e45-a76b-49d8-b0dd-2ac5b279854c" />

*Configuration page for the Alerts*


## Local Development

Clone and run locally using Yarn + Vite:

```bash
git clone X
cd ArchipelagoOverlays
yarn install
yarn dev
```
