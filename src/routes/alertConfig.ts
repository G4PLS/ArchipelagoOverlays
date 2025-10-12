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
  constructUrlParams,
  deconstructUrlParams,
  getAlert,
  getAlerts,
  loadAlert,
  setAlertOverride,
} from "@/lib/alertManager";
import { getAnimationNames, loadAnimation } from "@/lib/animation";
import { Display } from "@/lib/display";
import { getAudioNames, getImageNames, loadMedia } from "@/lib/media";
import { loadLanguage } from "@/lib/textParser";
import type { AlertData } from "@/types/alertSettings";
import { StrToNumber } from "@/utils/stringToNumber";
import { loadFont } from "@/lib/font";

loadFont();
loadLanguage();
await loadMedia("/alert/media.json");
await loadAnimation("/alert/animations.json");
await loadAlert("/alert/alerts.json");

const alerts = getAlerts();
const animations = getAnimationNames();
const timingFunctions = ["linear", "ease-in-out", "ease-in", "ease-out"];

let selectedAlert: AlertData = null;

const display = new Display<Alert>(document.querySelector(".alert-container"));

//#region Archipelago TODO
new ChipsInput({
  container: document.querySelector("#archipelago-slot-chips-container"),
  input: document.querySelector("#archipelago-slot-input"),
  chips: [],
  allowDuplicates: false,
  onChange: (chips: string[]) => {
    console.log(chips);
  },
});
//#endregion

//#region Font TODO

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
  animations.map(anim => ({text: anim, value: anim})),
  undefined,
  {text: "Select Animation", hidden: true},
  (option: string, _: HTMLSelectElement) => {
    setAlertOverride(selectedAlert.name, {animation: {reference: option}});
  }
)

const alertAnimationDuration = new Input(
  document.querySelector("#alert-animation-duration-input"),
  undefined,
  undefined,
  (value: string, _: HTMLInputElement) => {
    setAlertOverride(selectedAlert.name, {animation: {duration: StrToNumber(value, 2500)}});
  }
)

const alertAnimationTiming = new Select(
  document.querySelector("#alert-animation-timing"),
  timingFunctions.map(timing => ({text: timing, value: timing})),
  undefined,
  {text: "Timing", hidden: true},
  (option: string, _: HTMLSelectElement) => {
    setAlertOverride(selectedAlert.name, {animation: {timing: option}});
  }
)

const alertAnimationIterations = new Input(
  document.querySelector("#alert-animation-iterations"),
  undefined,
  undefined,
  (value: string, _: HTMLInputElement) => {
    setAlertOverride(selectedAlert.name, {animation: {iterations: StrToNumber(value, 1)}});
  }
)

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
      animations.map(anim => ({text: anim, value: anim})),
      selectedAlert.animation.reference
    );

    alertAnimationDuration.setValue(selectedAlert.animation.duration.toString());

    alertAnimationTiming.setOptions(
      timingFunctions.map(timing => ({text: timing, value: timing})),
      selectedAlert.animation.timing
    );

    alertAnimationIterations.setValue(selectedAlert.animation.iterations.toString());
  },
});

//#endregion

//#region Preview TODO

const alertPreview = new Select(
  document.querySelector("#alert-preview-alert-select"),
  Array.from(alerts.overrides.keys()).map(alert => ({text: alert, value: alert})),
  undefined,
  undefined,
  undefined
);

const playButton = document.querySelector("#play-preview");

playButton.addEventListener("click", () => {
  const selectedAlert = alertPreview.getValue();
  const alert = getAlert(selectedAlert);

  if (!alert)
    return;

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

const generateButton: HTMLButtonElement = document.querySelector("#generate-url");

generateButton.addEventListener("click", () => {
  const params = constructUrlParams();

  generateInput.value = params.toString();
});

const loadButton: HTMLButtonElement = document.querySelector("#load-url-button");

loadButton.addEventListener("click", () => {
  const params = new URLSearchParams(generateInput.value);

  deconstructUrlParams(params);

  alertTab.rerender();
})

const copyButton: HTMLButtonElement = document.querySelector("#copy-button");

copyButton.addEventListener("click", () => {
  if (!generateInput.value || generateInput.value === "")
    return;
  navigator.clipboard.writeText(generateInput.value);
});

//#endregion