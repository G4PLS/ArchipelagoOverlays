import { getLoadedAnimations, initializeAnimations } from '@/lib/animation';
import { Display } from '@/lib/display';
import '@/styles/pages/alertConfig.css';

import animationConfig from '@/data/animations.json';
import { getAlert, getAlerts, setAlertOverride } from '@/lib/alert';
import { getFont, getFontData, setFontOverride } from '@/lib/font';
import type { AlertInstance } from '@/types/alert';
import { Alert } from '@/lib/displayItems/alertItems';
import { Select } from '@/components/dynamic/select';
import { CollapsibleInputList } from '@/components/CollapsibleInputList/collapsibleInput';
import { Input } from '@/components/dynamic/input';
import { getArchipelagoConfig, setArchipelagoConfig } from '@/lib/archipelago/config';
import { stringToNumber } from '@/utils/stringToNumber';
import { MultiSelect } from '@/components/MultiSelect/multiSelect';
import { getMediaNames } from '@/lib/media';
import { TabGroup } from '@/components/TabGroup/tabGroup';
import { constructUrl, deconstructUrl, tryUrlMigration } from '@/utils/urlParser';
import { alertUrlParser } from '@/urlParsers/alert';
import type { MigrationDialogResult } from '@/types/migrationDialogResult';
import { awaitDialog } from '@/utils/awaitDialog';
import { ToastManager } from '@/components/Toast/toast';
import { injectStyle, removeStyle } from '@/utils/domInjector';

initializeAnimations(animationConfig);

const toastManager = new ToastManager();

const alerts = getAlerts();
let selectedAlert: AlertInstance = null;

const animations = getLoadedAnimations();
const timingFunctions = ["linear", "ease-in-out", "ease-in", "ease-out"];

const fontData = getFontData();
const availableFonts = Object.entries(fontData.availableFonts).map(( [key, value]) => ({text: value, value: key}))
const availableStyles = Object.entries(fontData.avaiableStyles).map(( [key, value]) => ({text: value, value: key}))
const availableShadows = Object.entries(fontData.availableShadows).map(( [key, value]) => ({text: value, value: key}))

const baseUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;

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
apSlotInput.setCurrent(getArchipelagoConfig().slots || []);

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
alertImageSelect.addEventListener('change', (_) => {
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
      animation: { duration: stringToNumber(value, 2500) },
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
      animation: { iterations: stringToNumber(value, 1) },
    });
  }
);

const alertTabGroup = document.querySelector('tab-group') as TabGroup;

alertTabGroup.addEventListener('tab-change', (_) => {
    const currentTab = alertTabGroup.getCurrentTab();
    const alertName = currentTab.value;

    selectedAlert = getAlert(alertName);

    alertTimeout.setValue(selectedAlert.timeout.toString());

    alertImageSelect.setOptions(getMediaNames("image").map(img => ({label: img})), selectedAlert.imageReferences)
    alertAudioSelect.setOptions(getMediaNames("audio").map(img => ({label: img})), selectedAlert.audioReferences)

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
const openUrlButton: HTMLButtonElement = document.querySelector("#open-url-button");

function generateUrl(): URL {
  const url = new URL(`${baseUrl}alert/`);

  setArchipelagoConfig({
    url: apUrlInput.getValue(),
    password: apPasswordInput.getValue(),
    slots: apSlotInput.getCurrent()
  });

  constructUrl(alertUrlParser, url.searchParams);

  return url;
}

generateUrlButton.addEventListener('click', () => {
    const url = generateUrl();
    urlInput.value = url.toString();
    toastManager.push({message: "Generated URL!", toastType: "success"});
});

loadUrlButton.addEventListener('click', async () => {
    const url = new URL(urlInput.value);
    const params = url.searchParams;

    const migrated = await tryUrlMigration(alertUrlParser, params, async (urlVersion: string, parserVersion: string) => {
      const dialog: HTMLDialogElement = document.querySelector("#url-migration-dialog");

      if (!dialog)
        return "denied";

      const urlVersionSpan = dialog.querySelector("#url-migration-dialog__text__url-version");
      const parserVersionSpan = dialog.querySelector("#url-migration-dialog__text__parser-version");

      urlVersionSpan.textContent = urlVersion;
      parserVersionSpan.textContent = parserVersion;

      return await awaitDialog(dialog) as MigrationDialogResult;
    });

    if (migrated) {
      urlInput.value = url.toString();
      toastManager.push({message: "Migrated!", toastType: "success"});
    } else {
      toastManager.push({message: "Migration Failed", toastType: "error"});
    }

    deconstructUrl(alertUrlParser, params);
    toastManager.push({message: "Loaded URL!", toastType: "success"});

    apUrlInput.setValue(getArchipelagoConfig().url);
    apSlotInput.setCurrent(getArchipelagoConfig().slots);
    apPasswordInput.setValue(getArchipelagoConfig().password);

    fontFamily.setOptions(availableFonts, getFont().family);
    fontStyle.setOptions(availableStyles, getFont().style);
    fontSize.setValue(getFont().size);
    fontShadow.setOptions(availableShadows, getFont().shadow);

    alertTabGroup.rerender();
});

copyUrlButton.addEventListener('click', () => {
    if (!urlInput.value || urlInput.value === "") return;
    navigator.clipboard.writeText(urlInput.value);
    toastManager.push({message: "Copied!", toastType: "success"});
});

openUrlButton.addEventListener('click', () => {
  const url = generateUrl().toString();
  urlInput.value = url;

  window.open(url, "_blank");
})

//#endregion

//#region CSS

const cssInput: HTMLTextAreaElement = document.querySelector(".css-input__input");
const loadCssButton: HTMLButtonElement = document.querySelector(".css-input__load");
const removeCssButton: HTMLButtonElement = document.querySelector(".css-input__remove");

loadCssButton.addEventListener("click", () => {
  injectStyle("custom-css", cssInput.value);
  toastManager.push({message: "Loaded CSS", toastType: "success"});
})

removeCssButton.addEventListener("click", () => {
  removeStyle("custom-css");
  toastManager.push({message: "Removed CSS", toastType: "success"});
})

//#endregion