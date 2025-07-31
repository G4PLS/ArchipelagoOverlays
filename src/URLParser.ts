import { SettingsManager } from "./SettingsManager";

interface AlertParams {
    name: string;
    color: string | null;
    timeout: string | null;
    animation: string | null;
    audios: string[] | null;
    images: string[] | null;
}

interface AnimationParams {
    name: string;
    duration: string | null;
    timingFunction: string | null;
    iterations: string | null;
}

interface FontParams {
    font: string;
    style: string;
    size: string;
    strokeWidth: string;
    shadow: string;
}

interface ArchipelagoParams {
    url: string;
    slots: string[];
    password: string;
}

interface ImageParams {
    width: string;
    height: string;
    contrast: string;
}

export class URLParser {
    private static instance: URLParser;

    configParams: string;
    alertParams: Map<string, AlertParams> = new Map<string, AlertParams>();
    animationParams: Map<string, AnimationParams> = new Map<string, AnimationParams>();
    fontParams: FontParams;
    archipelagoParams: ArchipelagoParams;
    imageParams: ImageParams;

    private constructor() { }

    public static getInstance() {
        if (!URLParser.instance) {
            URLParser.instance = new URLParser();
        }
        return URLParser.instance;
    }

    public async deconstructCurrentParams() {
        const params = new URLSearchParams(window.location.search);

        await this.deconstructConfigParams(params);

        if (!this.configParams)
            return;

        this.deconstructArchipelagoParams(params);
        this.deconstructFontParams(params);
        this.deconstructAlertParams(params);
        this.deconstructAnimationParams(params);
        this.deconstructImageParams(params);

        console.log(this.configParams, this.alertParams, this.animationParams, this.fontParams, this.archipelagoParams);
    }

    public constructUrl(): URL {
        const origin = window.location.origin
        const base = import.meta.env.BASE_URL;

        const url = new URL(`${base}/alert?`, origin);

        this.constructArchipelagoParams(url.searchParams);
        this.constructConfigParams(url.searchParams);
        this.constructFontParams(url.searchParams);
        this.constructAlertParams(url.searchParams);
        this.constructAnimationParams(url.searchParams);
        this.constructImageParams(url.searchParams);
        
        return url;
    }

    public async initializeDefaultParams() {
        this.configParams = "config";

        const settingsManager = SettingsManager.getInstance();
        await settingsManager.loadConfig(`/${this.configParams}.json`);

        this.fontParams = {
            font: null,
            style: null,
            size: null,
            strokeWidth: null,
            shadow: null
        };

        this.archipelagoParams = {
            url: null,
            slots: null,
            password: null,
        };

        for (const alert of settingsManager.getAlerts()) {
            this.alertParams.set(alert.name, {
                name: alert.name,
                color: null,
                timeout: null,
                audios: null,
                images: null,
                animation: null
            });
        }

        for (const animation of settingsManager.getAnimations()) {
            this.animationParams.set(animation.name, {
                name: alert.name,
                duration: null,
                timingFunction: null,
                iterations: null
            });
        }

        this.imageParams = {
            width: null,
            height: null,
            contrast: null
        };
    }

    //#region Deconstruction

    private async deconstructConfigParams(params: URLSearchParams) {
        const settingsManager = SettingsManager.getInstance();

        const configName = params.get("config") || "config";

        this.configParams = configName;
        await settingsManager.loadConfig(`/${configName}.json`);
    }

    private deconstructAlertParams(params: URLSearchParams) {
        const settingsManager = SettingsManager.getInstance();
        const alerts = settingsManager.getAlerts();
        console.log(alerts);

        this.alertParams.clear();

        for (const alert of alerts) {
            const alertParams: AlertParams = { name: alert.name, color: null, timeout: null, animation: null, audios: null, images: null };

            alertParams.color = params.get(`${alert.name}-color`);
            alertParams.timeout = params.get(`${alert.name}-timeout`);
            alertParams.animation = params.get(`${alert.name}-animation`);
            alertParams.audios = params.get(`${alert.name}-audios`)?.split(",");
            alertParams.images = params.get(`${alert.name}-images`)?.split(",");

            this.alertParams.set(alert.name, alertParams);
        }
    }

    private deconstructAnimationParams(params: URLSearchParams) {
        const settingsManager = SettingsManager.getInstance();
        const animations = settingsManager.getAnimations();

        this.animationParams.clear();

        for (const animation of animations) {
            const animationParams: AnimationParams = { name: animation.name, duration: null, timingFunction: null, iterations: null };

            animationParams.duration = params.get(`${animation.name}-duration`);
            animationParams.timingFunction = params.get(`${animation.name}-timing`);
            animationParams.iterations = params.get(`${animation.name}-iterations`);

            this.animationParams.set(animation.name, animationParams);
        }
    }

    private deconstructFontParams(params: URLSearchParams) {
        this.fontParams = {
            font: params.get("font") || "Arial",
            style: params.get("font-style") || "normal",
            size: params.get("font-size") || "12",
            strokeWidth: params.get("font-stroke-width") || "0",
            shadow: params.get("font-shadow") || "none"
        };
    }

    private deconstructArchipelagoParams(params: URLSearchParams) {
        this.archipelagoParams = {
            url: `${params.get("url")}:${params.get("port")}`,
            slots: params.get("slots")?.split(","),
            password: params.get("password")
        };
    }

    private deconstructImageParams(params: URLSearchParams) {
        this.imageParams = {
            width: params.get("image-width"),
            height: params.get("image-height"),
            contrast: params.get("image-contrast")
        };
    }

    //#endregion

    //#region Construction

    private constructConfigParams(params: URLSearchParams) {
        params.set("config", this.configParams);
    }

    private constructAlertParams(params: URLSearchParams) {
        for (const [_, param] of this.alertParams) {
            const alertName = param.name;

            if (param.color)
                params.set(`${alertName}-color`, param.color);

            if (param.timeout)
                params.set(`${alertName}-timeout`, param.timeout);

            if (param.animation)
                params.set(`${alertName}-animation`, param.animation);

            if (param.audios)
                params.set(`${alertName}-audios`, param.audios.join(","));

            if (param.images)
                params.set(`${alertName}-images`, param.images.join(","));
        }
    }

    private constructAnimationParams(params: URLSearchParams) {
        for (const [_, param] of this.animationParams) {
            const animationName = param.name;

            if (param.duration)
                params.set(`${animationName}-duration`, param.duration);

            if (param.timingFunction)
                params.set(`${animationName}-timing`, param.timingFunction);

            if (param.iterations)
                params.set(`${animationName}-iterations`, param.iterations);
        }
    }

    private constructFontParams(params: URLSearchParams) {
        if (this.fontParams.font !== "Arial")
            params.set("font", this.fontParams.font);

        if (this.fontParams.style !== "normal")
            params.set("font-style", this.fontParams.style);

        if (this.fontParams.size !== "12")
            params.set("font-size", this.fontParams.size);

        if (this.fontParams.strokeWidth !== "0")
            params.set("font-stroke-width", this.fontParams.strokeWidth);

        if (this.fontParams.shadow !== "none")
            params.set("font-shadow", this.fontParams.shadow);
    }

    private constructArchipelagoParams(params: URLSearchParams) {

        const [url, port = ""] = this.archipelagoParams.url.split(":");

        params.set("url", url);

        if (port)
            params.set("port", port);

        params.set("slots", this.archipelagoParams.slots.join(","));
        params.set("password", this.archipelagoParams.password);
    }

    private constructImageParams(params: URLSearchParams) {

        if (this.imageParams.width !== "100") {
            params.set("image-width", this.imageParams.width);
        }

        if (this.imageParams.height !== "100") {
            params.set("image-height", this.imageParams.height);
        }

        if (this.imageParams.contrast !== "100") {
            params.set("image-contrast", this.imageParams.contrast);
        }
    }

    //#endregion
}