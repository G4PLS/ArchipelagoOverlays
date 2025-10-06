import { SettingsManager, type JsonConfig, type Entry } from "./SettingsManager";

type AnimationKeyframes = Record<string, Record<string, string | number>>;

type AnimationJson = JsonConfig & Record<string, {
    duration: number;
    timing: string;
    iterations: number;
    keyframes: AnimationKeyframes;
}>;

export interface AnimationEntry extends Entry {
    name: string;
    duration: string;
    timing: string;
    iterations: string;
}

export class AnimationManager extends SettingsManager<AnimationEntry, AnimationJson> {
    private static instance: AnimationManager;

    private constructor() { super() }

    public static getInstance(): AnimationManager {
        if (!AnimationManager.instance) {
            AnimationManager.instance = new AnimationManager();
        }

        return AnimationManager.instance;
    }

    protected createConfigs(config: AnimationJson) {
        const allKeyframesCss: string[] = [];

        Object.entries(config).forEach(([name, entry]) => {
            const css = this.buildKeyframeCss(name, entry.keyframes);
            allKeyframesCss.push(css);
            this.configs.set(name, {
                name: name,
                duration: entry.duration.toString(),
                timing: entry.timing,
                iterations: entry.iterations.toString()
            });

            this.overrides.set(name, {
                name: name,
                duration: null,
                timing: null,
                iterations: null
            });
        });

        this.applyKeyframeCss(allKeyframesCss.join("\n"));
    }

    public deconstructURL(url: URL): void {
        const serachParams: URLSearchParams = url.searchParams;

        for (const [animationName, _] of this.configs) {
            const duration = serachParams.get(`${animationName}-duration`);
            const iterations = serachParams.get(`${animationName}-iterations`);
            const timing = serachParams.get(`${animationName}-timing`);

            this.overrides.set(animationName, {
                name: animationName,
                duration: duration,
                iterations: iterations,
                timing: timing
            });
        }
    }

    public constructSearchParams(): URLSearchParams {
        const searchParams = new URLSearchParams();

        for (const [animationName, override] of this.overrides) {
            if (override.duration)
                searchParams.set(`${animationName}-duration`, override.duration);

            if (override.iterations)
                searchParams.set(`${animationName}-iterations`, override.iterations);

            if (override.timing) {
                searchParams.set(`${animationName}-timing`, override.timing);
            }
        }

        return searchParams;
    }

    getAnimation(name: string): AnimationEntry {
        return this.configs.get(name);
    }

    getAnimations(): AnimationEntry[] {
        return Array.from(this.configs.values());
    }

    private buildKeyframeCss(name: string, keyframes: AnimationKeyframes) {
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

    private applyKeyframeCss(css: string) {
        let styleTag = document.getElementById("dynamic-animation-styles");

        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = "dynamic-animation-styles";
            document.head.appendChild(styleTag);
        }

        styleTag.textContent = css + "\n";
    }

    applyAnimation(element: HTMLElement, name: string, overrides?: AnimationEntry) {
        const animation = this.getAnimation(name);

        if (!element || !animation)
            return;

        element.style.animationName = animation.name;
        element.style.animationDuration = `${overrides.duration ?? animation.duration}ms`;
        element.style.animationTimingFunction = (overrides.duration ?? animation.timing).toString();
        element.style.animationIterationCount = `${overrides.iterations ?? animation.iterations}`;
    }

    removeAnimation(element: HTMLElement) {
        if (!element)
            return;

        element.style.animationName = "";
        element.style.animationDuration = "";
        element.style.animationTimingFunction = "";
        element.style.animationIterationCount = "";
    }
}