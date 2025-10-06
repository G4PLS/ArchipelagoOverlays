import { SettingsManager, type Entry, type JsonConfig } from "@/settings/SettingsManager";

type MediaJson = Record<string, string>;

type AlertJson = Record<string, {
    color: string;
    audios: string[];
    images: string[];
    timeout: number;
    animation: string;
}>;

type ConfigJson = JsonConfig & {
    images: MediaJson;
    audios: MediaJson;
    alerts: AlertJson;
};

export interface AlertMedia {
    name: string;
    link: string;
}

export interface AlertEntry extends Entry {
    name: string;
    color: string;
    audios: AlertMedia[];
    images: AlertMedia[];
    timeout: string;
    animation: string;
}

export class AlertManager extends SettingsManager<AlertEntry, ConfigJson> {
    private static instance: AlertManager;
    private images: Record<string, AlertMedia>;
    private audios: Record<string, AlertMedia>;

    private loadedConfigs: Record<string, ConfigJson>;

    private constructor() { super(); }

    public static getInstance(): AlertManager {
        if (!AlertManager.instance) {
            AlertManager.instance = new AlertManager();
        }
        return AlertManager.instance;
    }

    public load(_config?: ConfigJson) {
        const importedConfigs = import.meta.glob("./settings/alerts/*.json", { eager: true });

        this.loadedConfigs = Object.fromEntries(
            Object.entries(importedConfigs).map(([path, config]) => {
                // Optionally, you can extract a clean name from the path
                const name = path.split('/').pop()?.replace('.json', '') ?? path;
                return [name, config as ConfigJson];
            })
        );

        this.createConfigs(Object.values(this.loadedConfigs)[0]);
    }

    protected createConfigs(config: ConfigJson) {
        this.images = Object.fromEntries((
            Object.entries(config.images).map(([name, link]) => [name, {name, link}])
        ));

        this.audios = Object.fromEntries((
            Object.entries(config.audios).map(([name, link]) => [name, {name, link}])
        ));

        Object.entries(config.alerts).forEach(([name, entry]) => {
            this.configs.set(name, {
                name: name,
                color: entry.color,
                audios: entry.audios.map((key) => (this.audios[key])).filter(Boolean),
                images: entry.images.map((key) => (this.images[key])).filter(Boolean),
                timeout: entry.timeout.toString(),
                animation: entry.animation
            });

            this.overrides.set(name, {
                name: name,
                color: null,
                audios: null,
                images: null,
                timeout: null,
                animation: null
            });
        });
    }

    public deconstructURL(url: URL): void {
        const serachParams: URLSearchParams = url.searchParams;

        for (const [alertName, _] of this.configs) {
            const color = serachParams.get(`${alertName}-color`);
            const timoeut = serachParams.get(`${alertName}-timeout`);
            const animation = serachParams.get(`${alertName}-animation`);

            const audios: AlertMedia[] = [];
            for (const name of this.getParamList(serachParams, `${alertName}-audios`)) {
                const audio = this.getAudio(name);

                if (!audio)
                    continue;

                audios.push(audio);
            }

            const images: AlertMedia[] = [];
            for (const name of this.getParamList(serachParams, `${alertName}-images`)) {
                const image = this.getImage(name);

                if (!image)
                    continue;

                images.push(image);
            }

            this.overrides.set(alertName, {
                name: alertName,
                color: color,
                timeout: timoeut,
                animation: animation,
                audios: audios,
                images: images
            });
        }
    }

    public constructSearchParams(): URLSearchParams {
        const searchParams = new URLSearchParams();

        for (const [alertName, override] of this.overrides) {
            if (override.color)
                searchParams.set(`${alertName}-color`, override.color.replace("#", ""));

            if (override.timeout)
                searchParams.set(`${alertName}-timeout`, override.timeout);

            if (override.animation)
                searchParams.set(`${alertName}-animation`, override.animation);

            if (override.images)
                searchParams.set(`${alertName}-images`, override.images.map((img) => img.name).join(","));

            if (override.audios) 
                searchParams.set(`${alertName}-audios`, override.audios.map((audio) => audio.name).join(","));
                
        }

        return searchParams;
    }

    getAlert(name: string): AlertEntry {
        return this.configs.get(name);
    }

    getAlerts(): AlertEntry[] {
        return Array.from(this.configs.values());
    }

    getAudio(name: string) {
        return this.audios[name];
    }

    getAudios() {
        return Object.values(this.audios);
    }

    getImage(name: string) {
        return this.images[name];
    }

    getImages(): AlertMedia[] {
        return Object.values(this.images);
    }

    getLoadedConfigs(): string[] {
        return Object.keys(this.loadedConfigs);
    }

    changeConfig(name: string) {
        const config = this.loadedConfigs[name];

        if (!config)
            return;

        this.configs.clear();
        this.overrides.clear();
        this.images = {};
        this.audios = {};

        this.createConfigs(config);
    }

    private getParamList(urlParams: URLSearchParams, paramName: string) {
        return urlParams.get(paramName)?.split(",") || [];
    }
}