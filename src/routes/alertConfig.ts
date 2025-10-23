import { CollapsibleInputList } from '@/components/CollapsibleInputList/collapsibleInput';
import { MultiSelect } from '@/components/MultiSelect/multiSelect';
import { TabGroup } from '@/components/TabGroup/tabGroup';
import { Alert } from '@/components/alertItems';
import { Input } from '@/components/dynamic/input';
import { Select } from '@/components/dynamic/select';
import { constructAlertUrlParams, deconstructAlertUrlParams, getAlert, getAlerts, loadAlert, setAlertOverride } from '@/lib/alertManager';
import { getAnimationNames, loadAnimation } from '@/lib/animation';
import { constructArchipelagoUrlParams, deconstructArchipelagoUrlParams, getArchipelagoConfig, loadArchipelagoConfig, setArchipelagoSettings } from '@/lib/archipelagoConnection';
import { Display } from '@/lib/display';
import { constructFontUrlParams, deconstructFontUrlParams, getAvailableFonts, getAvailableShadows, getAvailableStyles, getFont, loadFont, setFontOverride } from '@/lib/font';
import { getAudioNames, getImageNames, loadMedia } from '@/lib/media';
import { loadLanguage } from '@/lib/textParser';
import '@/styles/pages/alertConfig.css';
import type { AlertData } from '@/types/alertSettings';
import { StrToNumber } from '@/utils/stringToNumber';

loadFont();
loadLanguage();
loadArchipelagoConfig();
await loadMedia("/ArchipelagoOverlays/assets/alert/media.json");
await loadAnimation("/ArchipelagoOverlays/assets/alert/animations.json");
await loadAlert("/ArchipelagoOverlays/assets/alert/alerts.json");

const alerts = getAlerts();
const animations = getAnimationNames();
const baseUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;

const availableFonts = Object.entries(getAvailableFonts()).map((entry) => ({
  text: entry[1],
  value: entry[0],
}));
const availableStyles = Object.entries(getAvailableStyles()).map((entry) => ({
  text: entry[1],
  value: entry[0],
}));
const availableShadows = Object.entries(getAvailableShadows()).map((entry) => ({
  text: entry[1],
  value: entry[0],
}));

const timingFunctions = ["linear", "ease-in-out", "ease-in", "ease-out"];

let selectedAlert: AlertData = null;

const display = new Display<Alert>(document.querySelector(".alert"));
display.push(new Alert("", getAlert("load")));

//#region PREVIEW 

const previewSelect = new Select(
  document.querySelector("#alert-preview__select"),
  undefined,
  undefined,
  undefined,
  undefined
);

const previewPlayButton = document.querySelector('#alert-preview__play');
const previewStopButton = document.querySelector('#alert-preview__stop');

previewPlayButton.addEventListener('click', () => {
  const selectedAlert = previewSelect.getValue();
  const alert = getAlert(selectedAlert);

  if (!alert) return;

  display.cancel();
  display.push(new Alert("SLOT", alert, {
    slot: "SLOT",
    countdown: "COUNTDOWN",
      game: "GAME",
      hint: "HINT",
      item: "ITEM",
      player: "PLAYER",
      reason: "REASON",
      sender: "SENDER",
      target: "TARGET",
      location: "LOCATION"
  }));
});

previewStopButton.addEventListener("click", () => {
  display.cancel();
});

//#endregion

//#region ARCHIPELAGO

const apUrlInput = new Input(
    document.querySelector('#ap-url-input'),
    getArchipelagoConfig().url,
    "archipelago.gg:47375",
    undefined
)

const apSlotInput = document.querySelector('#ap-slot-input') as CollapsibleInputList;
apSlotInput.setCurrent(getArchipelagoConfig().slots);

const apPasswordInput = new Input(
    document.querySelector('#ap-password-input'),
    getArchipelagoConfig().password,
    "Password...",
    undefined
)

//#endregion

//#region FONT

const fontFamily = new Select(
  document.querySelector("#font-family-select"),
  availableFonts,
  getFont().family,
  { text: "Select Font", hidden: true },
  (value: string, _: HTMLSelectElement) => {
    setFontOverride({ family: value });
  }
);

const fontStyle = new Select(
  document.querySelector("#font-style-select"),
  availableStyles,
  getFont().style,
  { text: "Select Font Style", hidden: true },
  (value: string, _: HTMLSelectElement) => {
    setFontOverride({ style: value });
  }
);

const fontSize = new Input(
  document.querySelector("#font-size-input"),
  getFont().size,
  "Font Size",
  (value: string, _: HTMLInputElement) => {
    setFontOverride({ size: value });
  }
);

const fontShadow = new Select(
  document.querySelector("#font-shadow-select"),
  availableShadows,
  getFont().shadow,
  { text: "Select Font Shadow", hidden: true },
  (value: string, _: HTMLSelectElement) => {
    setFontOverride({ shadow: value });
  }
);

//#endregion

//#region ALERTS

const alertTimeout = new Input(
  document.querySelector("#alert-timeout-input"),
  undefined,
  undefined,
  (value: string, _: HTMLInputElement) => {
    setAlertOverride(selectedAlert.name, { timeout: Number(value) });
  }
);

const alertImageSelect = document.querySelector('#alert-image-multi-select') as MultiSelect;
alertImageSelect.addEventListener('change', (e) => {
    if (!selectedAlert)
        return;
    
    setAlertOverride(selectedAlert.name, {imageReferences: alertImageSelect.getSelected()});
});

const alertAudioSelect = document.querySelector('#alert-audio-multi-select') as MultiSelect;
alertAudioSelect.addEventListener('change', (e) => {
    if (!selectedAlert)
        return;

    setAlertOverride(selectedAlert.name, {audioReferences: alertAudioSelect.getSelected()});
});

const alertAnimation = new Select(
  document.querySelector("#alert-animation-select"),
  animations.map((anim) => ({ text: anim, value: anim })),
  undefined,
  { text: "Select Animation", hidden: true },
  (option: string, _: HTMLSelectElement) => {
    setAlertOverride(selectedAlert.name, { animation: { reference: option } });
  }
);

const animationDuration = new Input(
  document.querySelector("#animation-duration-input"),
  undefined,
  undefined,
  (value: string, _: HTMLInputElement) => {
    setAlertOverride(selectedAlert.name, {
      animation: { duration: StrToNumber(value, 2500) },
    });
  }
);

const animationTiming = new Select(
  document.querySelector("#animation-timing-select"),
  timingFunctions.map((timing) => ({ text: timing, value: timing })),
  undefined,
  { text: "Timing", hidden: true },
  (option: string, _: HTMLSelectElement) => {
    setAlertOverride(selectedAlert.name, { animation: { timing: option } });
  }
);

const animationIterations = new Input(
  document.querySelector("#animation-iteration-input"),
  undefined,
  undefined,
  (value: string, _: HTMLInputElement) => {
    setAlertOverride(selectedAlert.name, {
      animation: { iterations: StrToNumber(value, 1) },
    });
  }
);

const alertTabGroup = document.querySelector('tab-group') as TabGroup;

alertTabGroup.addEventListener('tab-change', (e) => {
    const currentTab = alertTabGroup.getCurrentTab();
    const alertName = currentTab.value;

    selectedAlert = getAlert(alertName);

    alertTimeout.setValue(selectedAlert.timeout.toString());

    alertImageSelect.setOptions(getImageNames().map(img => ({label: img})), selectedAlert.imageReferences)
    alertAudioSelect.setOptions(getAudioNames().map(img => ({label: img})), selectedAlert.audioReferences)

    alertAnimation.setOptions(
        animations.map(anim => ({text: anim, value: anim})),
        selectedAlert.animation.reference
    );

    animationDuration.setValue(selectedAlert.animation.duration.toString());

    animationTiming.setOptions(
      timingFunctions.map((timing) => ({ text: timing, value: timing })),
      selectedAlert.animation.timing
    );

    animationIterations.setValue(selectedAlert.animation.iterations.toString());

    previewSelect.setOptions(
      alerts.map(alert => ({text: alert.name, value: alert.name})),
      selectedAlert.name
    );
});

alertTabGroup.setTabs(alerts.map(alert => ({label: alert.name})));

//#endregion

//#region URL PARSING

const urlInput: HTMLInputElement = document.querySelector("#url-parser-input");
const generateUrlButton: HTMLButtonElement = document.querySelector("#generate-url-button");
const loadUrlButton: HTMLButtonElement = document.querySelector("#load-url-button");
const copyUrlButton: HTMLButtonElement = document.querySelector("#copy-url-button");

generateUrlButton.addEventListener('click', () => {
    const url = new URL(`${baseUrl}alert/`);

    setArchipelagoSettings({
      url: apUrlInput.getValue(),
      password: apPasswordInput.getValue(),
      slots: apSlotInput.getCurrent()
    });

    constructArchipelagoUrlParams(url.searchParams);
    constructFontUrlParams(url.searchParams);
    constructAlertUrlParams(url.searchParams);
    
    urlInput.value = url.toString();
});

loadUrlButton.addEventListener('click', () => {
    const url = new URL(urlInput.value);
    const params = url.searchParams;

    deconstructArchipelagoUrlParams(params);
    apUrlInput.setValue(getArchipelagoConfig().url);
    apSlotInput.setCurrent(getArchipelagoConfig().slots);
    apPasswordInput.setValue(getArchipelagoConfig().password);

    deconstructFontUrlParams(params);
    fontFamily.setOptions(availableFonts, getFont().family);
    fontStyle.setOptions(availableStyles, getFont().style);
    fontSize.setValue(getFont().size);
    fontShadow.setOptions(availableShadows, getFont().shadow);
    
    deconstructAlertUrlParams(params);
    alertTabGroup.rerender();
});

copyUrlButton.addEventListener('click', () => {
    if (!urlInput.value || urlInput.value === "") return;
    navigator.clipboard.writeText(urlInput.value);
});

//#endregion