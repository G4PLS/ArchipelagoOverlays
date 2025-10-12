// TODO: DECONSTRUCT URL
import { loadConfig } from "@/utils/configLoader";

import type {
  AnimationConfig
} from "@/types/animation";
import type { AlertAnimationConfig } from "@/types/alertSettings";

const loadedAnimations: string[] = [];

export async function loadAnimation(path: string) {
  await loadConfig<AnimationConfig>(path, createConfigs);
}

function createConfigs(config: Record<string, AnimationConfig>) {
  const allKeyframesCss: string[] = [];

  Object.entries(config).forEach(([name, entry]) => {
    const css = createKeyframeCss(name, entry);
    allKeyframesCss.push(css);
    loadedAnimations.push(name);
  });

  applyKeyframeCss(allKeyframesCss.join("\n"));
}

function createKeyframeCss(name: string, keyframes: AnimationConfig) {
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

export function getAnimationNames(): string[] {
  return loadedAnimations;
}

export function applyAnimation(element: HTMLElement, animation: AlertAnimationConfig) {
  if (!element || !animation) 
    return;

  element.style.animationName = animation.reference;
  element.style.animationDuration = `${animation.duration}ms`;
  element.style.animationTimingFunction = animation.timing;
  element.style.animationIterationCount = animation.iterations.toString();
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