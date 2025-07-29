import type {AnimationConfig} from "./settingsManager";

let styleTag = document.getElementById("dynamic-animation-styles") as HTMLElement | null;

if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "dynamic-animation-styles"
    document.head.appendChild(styleTag);
}

const currentAnimations: Map<string, Animation> = new Map<string, Animation>();

interface Animation {
    keyframeCss: string,
    animationCss: string,
}

function generateAnimationCss(animationConfig: AnimationConfig): Animation {
    const {name, duration, keyframes, timingFunction, iterationCount} = animationConfig;

    const keyframeLines: string[] = [`@keyframes ${name} {`];
    for (const [percent, props] of Object.entries(keyframes)) {
        const declarations = Object.entries(props)
            .map(([prop, val]) => `    ${prop}: ${val};`) // double-indented for nesting
            .join(" ");

        keyframeLines.push(`  ${percent} { ${declarations} }`);
    }
    keyframeLines.push("}");

    const keyframesCss = keyframeLines.join("\n");

    const animationCss = [
        `animation-name: ${name};`,
        `animation-duration: ${duration}ms;`,
        `animation-timing-function: ${timingFunction};`,
        `animation-iteration-count: ${iterationCount};`,
    ].join("\n");

    return { keyframeCss: keyframesCss, animationCss: animationCss };
}

export function loadAnimations(animationConfigs: AnimationConfig[]) {
    if (!styleTag)
        return;

    styleTag.textContent = "";
    currentAnimations.clear();

    for (const config of animationConfigs) {
        const animation = generateAnimationCss(config);

        if (currentAnimations.has(config.name))
            continue;

        styleTag.appendChild(document.createTextNode(animation.keyframeCss + "\n"));
        currentAnimations.set(config.name, animation);
    }
}

export function applyAnimation(element: HTMLElement, animationName: string) {
    const animation = currentAnimations.get(animationName);

    if (!animation)
        return;

    for (const line of animation.animationCss.trim().split("\n")) {
        const [propRaw, valueRaw] = line.split(":");
        if (!propRaw || !valueRaw) continue;

        const prop = propRaw.trim();
        const value = valueRaw.trim().replace(/;$/, "");
        const jsProp = prop.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
        (element.style as any)[jsProp] = value;
    }
}

export function removeAnimationFromElement(element: HTMLElement) {
    element.style.animationName = "";
    element.style.animationDuration = "";
    element.style.animationTimingFunction = "";
    element.style.animationIterationCount = "";
}