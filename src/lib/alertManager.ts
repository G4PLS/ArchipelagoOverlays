import type { AlertConfig, AlertData } from "@/types/alertSettings";
import { arraysEqual } from "@/utils/arraysEqual";
import { loadConfig } from "@/utils/configLoader";
import { StrToNumber } from "@/utils/stringToNumber";

const configs: Map<string, AlertData> = new Map();
const overrides: Map<string, AlertData> = new Map();

export async function loadAlert(path: string) {
  await loadConfig<AlertConfig>(path, createConfigs, deconstructUrlParams);
  console.log("ALERTS", configs, overrides);
}

export function deconstructUrlParams(params?: URLSearchParams) {
  const searchParams: URLSearchParams =
    params || new URL(window.location.href).searchParams;

  for (const [alertName, data] of configs) {
    const timeoutString: string = searchParams.get(`${alertName}-timeout`);
    const audios: string[] = searchParams.get(`${alertName}-a`)?.split(",");
    const images: string[] = searchParams.get(`${alertName}-i`)?.split(",");

    const animReference: string = searchParams.get(`${alertName}-anim`);
    const animDurationStr: string = searchParams.get(`${alertName}-anim-duration`);
    const animIterationsStr: string = searchParams.get(`${alertName}-anim-iterations`);
    const animTiming: string = searchParams.get(`${alertName}-anim-timing`);

    const timeout = StrToNumber(timeoutString, data.timeout);
    const animDuration = StrToNumber(animDurationStr, data.animation.duration);
    const animIterations = StrToNumber(animIterationsStr, data.animation.iterations);

    overrides.set(alertName, {
      name: alertName,
      alertReference: undefined,
      timeout: timeout,
      translations: undefined,
      style: undefined, // Can be edited later
      audioReferences: audios,
      imageReferences: images,
      animation: {
        reference: animReference,
        duration: animDuration,
        iterations: animIterations,
        timing: animTiming,
      },
    });
  }
}

export function constructUrlParams(): URLSearchParams {
  const searchParams: URLSearchParams = new URLSearchParams();

  for (const [name, base] of configs) {
    const override = overrides.get(name);

    if (!override)
      continue;

    const addIfDiff = <T>(key: string, value: T | undefined, baseValue: T | undefined) => {
      if (value === undefined || value === null)
        return;

      if (typeof value === "object") {
        if (JSON.stringify(value) === JSON.stringify(baseValue))
          return;
      }
      else if(value === baseValue)
        return

      searchParams.set(key, String(value));
    }

    addIfDiff(`${name}-timeout`, override.timeout, base.timeout);

    if (override?.audioReferences && !arraysEqual(override?.audioReferences, base.audioReferences)) {
      searchParams.set(`${name}-a`, override.audioReferences.join(","));
    }

    if (override?.imageReferences && !arraysEqual(override?.imageReferences, base.imageReferences)) {
      searchParams.set(`${name}-i`, override.imageReferences.join(","));
    }

    const anim = override.animation;
    const baseAnim = base.animation;

    if (anim) {
      addIfDiff(`${name}-anim`, anim.reference, baseAnim.reference);
      addIfDiff(`${name}-anim-duration`, anim.duration, baseAnim.duration);
      addIfDiff(`${name}-anim-iterations`, anim.iterations, baseAnim.iterations);
      addIfDiff(`${name}-anim-timing`, anim.timing, baseAnim.timing);
    }
  }

  return searchParams;
}

function createConfigs(config: Record<string, AlertConfig>) {
  Object.entries(config).forEach(([name, entry]) => {
    configs.set(name, {
      name,
      alertReference: entry["alert-reference"],
      timeout: entry.timeout,
      translations: entry.translations,
      style: entry.style,
      audioReferences: entry["audio-references"],
      imageReferences: entry["image-references"],
      animation: entry.animation,
    });

    overrides.set(name, {
      name,
      alertReference: undefined,
      timeout: undefined,
      translations: undefined,
      style: undefined,
      audioReferences: undefined,
      imageReferences: undefined,
      animation: {
        reference: undefined,
        duration: undefined,
        iterations: undefined,
        timing: undefined,
      },
    });
  });
}

export function setAlertOverride(
  name: string,
  override: Partial<Omit<AlertData, "name" | "animation">> & {animation?: Partial<AlertData["animation"]>}
) {
  const alert = getAlert(name);

  if (!alert) return;

  const overriddenAlert: AlertData = {
    name,
    alertReference: undefined,
    timeout: override?.timeout ?? alert.timeout,
    translations: undefined,
    style: undefined, // Can be edited later
    audioReferences: override?.audioReferences ?? alert.audioReferences,
    imageReferences: override?.imageReferences ?? alert.imageReferences,
    animation: {
      reference: override?.animation?.reference ?? alert.animation.reference,
      duration: override?.animation?.duration ?? alert.animation.duration,
      iterations: override?.animation?.iterations ?? alert.animation.iterations,
      timing: override?.animation?.timing ?? alert.animation.timing,
    },
  };

  overrides.set(name, overriddenAlert);
}

export function getBaseAlert(name: string): AlertData | undefined {
  return configs.get(name);
}

export function getOverriddenAlert(name: string): AlertData | undefined {
  return overrides.get(name);
}

export function getAlert(name: string): AlertData {
  const config = configs.get(name);
  const override = overrides.get(name);

  if (!config && !override) return null;

  return {
    name,
    alertReference: config.alertReference,
    timeout: override?.timeout ?? config.timeout,
    translations: config.translations,
    style: config.style, // Can be edited later
    audioReferences: override?.audioReferences ?? config.audioReferences,
    imageReferences: override?.imageReferences ?? config.imageReferences,
    animation: {
      reference: override?.animation.reference ?? config.animation.reference,
      duration: override?.animation?.duration ?? config.animation.duration,
      iterations:
        override?.animation?.iterations ?? config.animation.iterations,
      timing: override?.animation?.timing ?? config.animation.timing,
    },
  };
}

export function getAlerts(): {
  configs: Map<string, AlertData>;
  overrides: Map<string, AlertData>;
} {
  return {
    configs,
    overrides,
  };
}
