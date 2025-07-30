type AnimationKeyframes = Record<string, Record<string, string | number>>;
import { loadAnimations } from "./animation";

export interface MediaData {
    name: string;
    link: string;
}

export interface AnimationConfig {
    name: string;
    duration: number;
    timingFunction: string;
    iterationCount: number | "infinite";
    keyframes: AnimationKeyframes;
}

export interface AlertConfig {
    name: string;
    color: string;
    audioSources: MediaData[];
    imageSources: MediaData[];
    timeout: number;
    animation?: string;
}

export class SettingsManager {
    private static instance: SettingsManager;
    private config: any | null;

    private constructor() {
        this.config = null;
    }

    public static getInstance(): SettingsManager {
        if (!SettingsManager.instance) {
            SettingsManager.instance = new SettingsManager();
        }
        return SettingsManager.instance;
    }

    private async getLocalConfig(path: string) {
        try {
            const response = await fetch(path);

            if (!response.ok)
                return null;

            const fileContent = await response.text();
            const parsedConfig = JSON.parse(fileContent) as RootConfig;
            return parsedConfig;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }

    async loadConfig(path: string) {
        this.config = await this.getLocalConfig(path);

        const animations = this.getAnimations();
        if (!animations)
            return;

        loadAnimations(animations);
    }

    getAlerts(): AlertConfig[] {
        const alerts = this.config?.alerts;

        if (!alerts)
            return []

        const results: AlertConfig[] = []

        for (const type in alerts) {
            const alertConfig = this.getAlert(type)

            if (!alertConfig)
                continue;

            results.push(alertConfig);
        }

        return results;
    }

    getAlert(type: string): AlertConfig | null {
        const config = this.config?.alerts?.[type] ?? null;

        if (!config)
            return null;

        const urlParams = new URLSearchParams(window.location.search);

        let timeout = config?.timeout ?? 2500;
        let animation = config?.animation ?? "";
        let color = config?.color ?? "rgb(255,255,255)"
        let imageSourceNames = config?.["image-sources"] || []
        let audioSourceNames = config?.["audio-sources"] || []

        const timeoutString = urlParams.get(`${type}-timeout`)
        if (timeoutString) {
            const parsedDuration = parseInt(timeoutString, 10)
            if (parsedDuration > 0)
                timeout = parsedDuration;
        }

        const animationString = urlParams.get(`${type}-animation`)
        animation = animationString || animation;

        const colorString = urlParams.get(`${type}-color`)
        if (colorString)
            color = `#${colorString}`

        const imageSourceString = urlParams.get(`${type}-images`)
        if (imageSourceString !== undefined && imageSourceString !== null) {
            imageSourceNames = imageSourceString.split(",")
        }
        const imageSources = imageSourceNames.map((key: string) => this.getImage(key)).filter((url: string): url is string => url !== null);

        const audioSourceString = urlParams.get(`${type}-audios`)
        if (audioSourceString !== undefined && audioSourceString !== null) {
            audioSourceNames = audioSourceString.split(",")
        }
        const audioSources = audioSourceNames.map((key: string) => this.getAudio(key)).filter((url: string): url is string => url !== null);

        return {
            name: type,
            color: color,
            audioSources: audioSources,
            imageSources: imageSources,
            timeout: timeout,
            animation: animation
        };
    }

    getAudios() {
        const audios = this.config?.audios;

        if (!audios)
            return [];

        const results: MediaData[] = [];

        for (const audioName in audios) {
            const audio = this.getAudio(audioName)

            if (!audio)
                continue;

            results.push(audio);
        }

        return results;
    }

    getAudio(name: string): MediaData | null {
        const config = this.config?.audios?.[name];

        if (!config)
            return null;

        return {
            name: name,
            link: config
        }
    }

    getImages() {
        const images = this.config?.images;

        if (!images)
            return [];

        const results: MediaData[] = [];

        for (const imageName in images) {
            const image = this.getImage(imageName)

            if (!image)
                continue;

            results.push(image);
        }

        return results;
    }

    getImage(name: string): MediaData | null {
        const config = this.config?.images?.[name];

        if (!config)
            return null;

        return {
            name: name,
            link: config
        }
    }

    getAnimations(): AnimationConfig[] {
        const animations = this.config?.animations ?? null;

        if (!animations)
            return [];

        let finalAnimations: AnimationConfig[] = [];

        const urlParams = new URLSearchParams(window.location.search);

        for (const animationName in animations) {
            if (animations.hasOwnProperty(animationName)) {
                const animationConfig = animations[animationName];

                if (!animationConfig)
                    continue;

                let duration = animationConfig.duration;

                const urlDurationString = urlParams.get(`${animationName}-duration`)
                if (urlDurationString) {
                    const parsedDuration = parseInt(urlDurationString, 10)
                    if (parsedDuration > 0)
                        duration = parsedDuration;
                }

                const animation: AnimationConfig = {
                    name: animationName,
                    duration: duration ?? 2500,
                    timingFunction: animationConfig["timing-function"] ?? "ease-in",
                    iterationCount: animationConfig["iteration-count"] ?? 1,
                    keyframes: animationConfig.keyframes
                };

                finalAnimations.push(animation);
            }
        }

        return finalAnimations;
    }
}
