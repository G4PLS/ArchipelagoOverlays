import type {AnimationConfig} from "./settingsManager";

let styleTag = document.getElementById("dynamic-animation-styles") as HTMLElement | null;

if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "dynamic-animation-styles"
    document.head.appendChild(styleTag);
}

const currentAnimations: Map<string, Animation> = new Map<string, Animation>();

interface AnimationProps {
    name: string;
    duration: number;
    timingFunction: string;
    iterationCount: string | number;
}

interface Animation {
    keyframeCss: string,
    animationProps: AnimationProps;
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

    return { keyframeCss: keyframesCss, animationProps: { name, duration, timingFunction, iterationCount } };
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

    element.style.animationName = animation.animationProps.name;
    element.style.animationDuration = `${animation.animationProps.duration}ms`;
    element.style.animationTimingFunction = animation.animationProps.timingFunction;
    element.style.animationIterationCount = `${animation.animationProps.iterationCount}`;
}

export function removeAnimationFromElement(element: HTMLElement) {
    element.style.animationName = "";
    element.style.animationDuration = "";
    element.style.animationTimingFunction = "";
    element.style.animationIterationCount = "";
}