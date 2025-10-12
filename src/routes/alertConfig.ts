/*
TODOS:
Create some more dynamic elements like:
  - select -> Should be able to define dynamic options and have a callback that triggers on "change"
*/

import "@/styles/pages/alertConfig.css";

import { Alert } from "@/components/alertItems";
import { ChipsInput } from "@/components/chipsInput";
import { Input } from "@/components/dynamic/input";
import { Select } from "@/components/dynamic/select";
import { TabGroup } from "@/components/tabGroup";
import { TagSelect } from "@/components/tagSelect";
import {
  constructAlertUrlParams,
  deconstructAlertUrlParams,
  getAlert,
  getAlerts,
  loadAlert,
  setAlertOverride,
} from "@/lib/alertManager";
import { getAnimationNames, loadAnimation } from "@/lib/animation";
import {
  constructArchipelagoUrlParams,
  deconstructArchipelagoUrlParams,
  getArchipelagoConfig,
  loadArchipelagoConfig,
  setArchipelagoSettings,
} from "@/lib/archipelagoConnection";
import { Display } from "@/lib/display";
import {
  constructFontUrlParams,
  deconstructFontUrlParams,
  getAvailableFonts,
  getAvailableShadows,
  getAvailableStyles,
  getFont,
  loadFont,
  setFontOverride,
} from "@/lib/font";
import { getAudioNames, getImageNames, loadMedia } from "@/lib/media";
import { loadLanguage } from "@/lib/textParser";
import type { AlertData } from "@/types/alertSettings";
import { StrToNumber } from "@/utils/stringToNumber";

loadFont();
loadLanguage();
loadArchipelagoConfig();
await loadMedia("/ArchipelagoOverlays/assets/alert/media.json");
await loadAnimation("/ArchipelagoOverlays/assets/alert/animations.json");
await loadAlert("/ArchipelagoOverlays/assets/alert/alerts.json");

const alerts = getAlerts();
const animations = getAnimationNames();

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

const display = new Display<Alert>(document.querySelector(".alert-container"));
display.push(new Alert("", getAlert("load")));

//#region Archipelago
const archipelagoUrl = new Input(
  document.querySelector("#archipelago-url-input"),
  getArchipelagoConfig().url,
  "archipelago.gg:47375",
  (value: string, _: HTMLInputElement) => {
    setArchipelagoSettings({ url: value });
  }
);

const archipelagoSlots = new ChipsInput({
  container: document.querySelector("#archipelago-slot-chips-container"),
  input: document.querySelector("#archipelago-slot-input"),
  chips: getArchipelagoConfig().slots,
  allowDuplicates: false,
  onChange: (chips: string[]) => {
    setArchipelagoSettings({ slots: chips });
  },
});

const archipelagoPassword = new Input(
  document.querySelector("#archipelago-password-input"),
  getArchipelagoConfig().password,
  "Password",
  (value: string, _: HTMLInputElement) => {
    setArchipelagoSettings({ password: value });
  }
);

//#endregion

//#region Font TODO

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

//#region Alerts

const alertTimeout = new Input(
  document.querySelector("#alert-timeout-input"),
  undefined,
  undefined,
  (value: string, _: HTMLInputElement) => {
    setAlertOverride(selectedAlert.name, { timeout: Number(value) });
  }
);

const alertImage = new TagSelect({
  select: document.querySelector("#alert-image-select"),
  tagContainer: document.querySelector("#alert-image-select-tag-container"),
  tags: undefined,
  selectedTags: undefined,
  onChange: (tags: string[]) => {
    setAlertOverride(selectedAlert.name, { imageReferences: tags });
  },
});

const alertAudio = new TagSelect({
  select: document.querySelector("#alert-audio-select"),
  tagContainer: document.querySelector("#alert-audio-select-tag-container"),
  tags: undefined,
  selectedTags: undefined,
  onChange: (tags: string[]) => {
    setAlertOverride(selectedAlert.name, { audioReferences: tags });
  },
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

const alertAnimationDuration = new Input(
  document.querySelector("#alert-animation-duration-input"),
  undefined,
  undefined,
  (value: string, _: HTMLInputElement) => {
    setAlertOverride(selectedAlert.name, {
      animation: { duration: StrToNumber(value, 2500) },
    });
  }
);

const alertAnimationTiming = new Select(
  document.querySelector("#alert-animation-timing"),
  timingFunctions.map((timing) => ({ text: timing, value: timing })),
  undefined,
  { text: "Timing", hidden: true },
  (option: string, _: HTMLSelectElement) => {
    setAlertOverride(selectedAlert.name, { animation: { timing: option } });
  }
);

const alertAnimationIterations = new Input(
  document.querySelector("#alert-animation-iterations"),
  undefined,
  undefined,
  (value: string, _: HTMLInputElement) => {
    setAlertOverride(selectedAlert.name, {
      animation: { iterations: StrToNumber(value, 1) },
    });
  }
);

const alertTab = new TabGroup({
  contentContainer: document.querySelector("#alert-tab-content-container"),
  tabContainer: document.querySelector("#alert-tabs-container"),
  tabs: Array.from(alerts.overrides.keys()),
  initialTab: "",
  onTabActivated: (tabId: string, _: HTMLElement) => {
    selectedAlert = getAlert(tabId);

    alertTimeout.setValue(selectedAlert.timeout.toString());

    alertImage.setTags(getImageNames(), selectedAlert.imageReferences || []);
    alertAudio.setTags(getAudioNames(), selectedAlert.audioReferences || []);

    alertAnimation.setOptions(
      animations.map((anim) => ({ text: anim, value: anim })),
      selectedAlert.animation.reference
    );

    alertAnimationDuration.setValue(
      selectedAlert.animation.duration.toString()
    );

    alertAnimationTiming.setOptions(
      timingFunctions.map((timing) => ({ text: timing, value: timing })),
      selectedAlert.animation.timing
    );

    alertAnimationIterations.setValue(
      selectedAlert.animation.iterations.toString()
    );
  },
});

//#endregion

//#region

const alertPreview = new Select(
  document.querySelector("#alert-preview-alert-select"),
  Array.from(alerts.overrides.keys()).map((alert) => ({
    text: alert,
    value: alert,
  })),
  undefined,
  undefined,
  undefined
);

const playButton = document.querySelector("#play-preview");

playButton.addEventListener("click", () => {
  const selectedAlert = alertPreview.getValue();
  const alert = getAlert(selectedAlert);

  if (!alert) return;

  display.cancel();
  display.push(new Alert("SLOT", alert));
});

const stopButton = document.querySelector("#stop-preview");

stopButton.addEventListener("click", () => {
  display.cancel();
});

//#endregion

//#region URL Parsing

const generateInput: HTMLInputElement = document.querySelector("#url-input");

const generateButton: HTMLButtonElement =
  document.querySelector("#generate-url");
generateButton.addEventListener("click", () => {
  const params = new URLSearchParams();

  constructArchipelagoUrlParams(params);
  constructFontUrlParams(params);
  constructAlertUrlParams(params);

  generateInput.value = params.toString();
});

const loadButton: HTMLButtonElement =
  document.querySelector("#load-url-button");
loadButton.addEventListener("click", () => {
  const params = new URLSearchParams(generateInput.value);

  deconstructArchipelagoUrlParams(params);
  archipelagoUrl.setValue(getArchipelagoConfig().url);
  archipelagoSlots.setChips(getArchipelagoConfig().slots);
  archipelagoPassword.setValue(getArchipelagoConfig().password);

  deconstructFontUrlParams(params);
  fontFamily.setOptions(availableFonts, getFont().family);
  fontStyle.setOptions(availableStyles, getFont().style);
  fontSize.setValue(getFont().size);
  fontShadow.setOptions(availableShadows, getFont().shadow);

  deconstructAlertUrlParams(params);
  alertTab.rerender();
});

const copyButton: HTMLButtonElement = document.querySelector("#copy-button");
copyButton.addEventListener("click", () => {
  if (!generateInput.value || generateInput.value === "") return;
  navigator.clipboard.writeText(generateInput.value);
});

//#endregion
