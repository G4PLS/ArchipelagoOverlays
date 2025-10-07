// TODO: DECONSTRUCT URL
import { loadConfig } from "@/utils/configLoader";

import type {
  AnimationConfig,
  AnimationData,
  AnimationKeyframes,
} from "@/types/animation";

const configs: Map<string, AnimationData> = new Map();
const overrides: Map<string, AnimationData> = new Map();

export async function loadAnimation(path: string) {
  await loadConfig<AnimationConfig>(path, createConfigs, deconstructUrlParams)

  console.log("ANIMATION", configs, overrides);
}

function deconstructUrlParams() {
  const searchParams: URLSearchParams = new URL(window.location.href).searchParams;

  for (const [animationName, _] of configs) {
    const duration = searchParams.get(`${animationName}-duration`);
    const iterations = searchParams.get(`${animationName}-iterations`);
    const timing = searchParams.get(`${animationName}-timing`);

    overrides.set(animationName, {
      name: animationName,
      duration: duration,
      iterations: iterations,
      timing: timing
    });
  }
}

function createConfigs(config: Record<string, AnimationConfig>) {
  const allKeyframesCss: string[] = [];

  Object.entries(config).forEach(([name, entry]) => {
    const css = createKeyframeCss(name, entry.keyframes);
    allKeyframesCss.push(css);
    
    configs.set(name, {
      name: name,
      duration: entry.duration.toString(),
      timing: entry.timing,
      iterations: entry.iterations.toString(),
    });

    overrides.set(name, {
      name: name,
      duration: entry.duration.toString(),
      timing: entry.timing,
      iterations: entry.iterations.toString(),
    });
  });

  applyKeyframeCss(allKeyframesCss.join("\n"));
}

function createKeyframeCss(name: string, keyframes: AnimationKeyframes) {
  const keyframeLines: string[] = [`@keyframes ${name} {`];

  for (const [percent, props] of Object.entries(keyframes)) {
    const declarations = Object.entries(props)
      .map(([prop, val]) => `    ${prop}: ${val};`)
      .join(" ");

    keyframeLines.push(`  ${percent} { ${declarations} }`);
  }

  keyframeLines.push("}");

  return keyframeLines.join("\n");
}

function applyKeyframeCss(css: string) {
  let styleTag = document.querySelector("#dynamic-animation-styles");

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "dynamic-animation-styles";
    document.head.appendChild(styleTag);
  }

  styleTag.textContent = css + "\n";
}

function getAnimation(name: string): AnimationData | null {
  const config = configs.get(name);
  const override = overrides.get(name);

  return {
    name: override.name ?? config.name,
    duration: override.duration ?? config.duration,
    timing: override.timing ?? config.timing,
    iterations: override.iterations ?? config.iterations,
  }
}

export function getAnimations() {
  return configs;
}

export function applyAnimation(element: HTMLElement, name: string) {
  const animation = getAnimation(name);

  if (!element || !animation) return;

  element.style.animationName = animation.name;
  element.style.animationDuration = `${animation.duration}ms`;
  element.style.animationTimingFunction = animation.timing;
  element.style.animationIterationCount = animation.iterations;
  element.offsetWidth;
}

export function removeAnimation(element: HTMLElement) {
  if (!element) return;

  element.style.animationName = "";
  element.style.animationDuration = "";
  element.style.animationTimingFunction = "";
  element.style.animationIterationCount = "";
  element.offsetWidth;
}
