import type { AlertAnimationInstance } from "@/types/alert";
import type { AnimationKeyframeConfig } from "@/types/animation";
import { applyStyles, injectStyle, removeStyles } from "@/utils/domInjector";

const loadedAnimations: string[] = [];

export function initializeAnimations(keyframes: AnimationKeyframeConfig) {
    let css: string[] = [];

    for (const [name, frames] of Object.entries(keyframes)) {
        const lines = [`@keyframes ${name} {`]

        for (const [percent, props] of Object.entries(frames)) {
            const declarations = Object.entries(props).map(([prop, value]) => `${prop}:${value};`).join("");
            lines.push(`${percent} {${declarations}}`);
        }

        lines.push("}")
        css.push(...lines);
        loadedAnimations.push(name);
    }

    injectStyle("ap-overlay-animations", css.join("\n"));

    console.log("INITIALIZED ANIMATIONS");
}

export function applyAnimation(element: HTMLElement, animation: AlertAnimationInstance) {
    if (!element || !animation)
        return;

    applyStyles(element, {
        "animation-name": animation.reference,
        "animation-duration": `${animation.duration}ms`,
        "animation-timing-function": animation.timing,
        "animation-iteration-count": animation.iterations.toString()
    });
}

export function removeAnimation(element: HTMLElement) {
    removeStyles(element, [
        "animation-name",
        "animation-duration",
        "animation-timing-function",
        "animation-iteration-count"
    ])
}

export function getLoadedAnimations() {
    return loadedAnimations;
}