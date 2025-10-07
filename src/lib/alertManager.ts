import type { AlertConfig, AlertData } from "@/types/alertSettings";
import { loadConfig } from "@/utils/configLoader";

const configs: Map<string, AlertData> = new Map();
const overrides: Map<string, AlertData> = new Map();

export async function loadAlert(path: string) {
    await loadConfig<AlertConfig>(path, createConfigs, deconstructUrlParams);
    console.log("ALERTS", configs, overrides);
}

function deconstructUrlParams() {
    const searchParams: URLSearchParams = new URL(window.location.href).searchParams;

    for (const [alertName, data] of configs) {
        const audios = searchParams.get(`${alertName}-audios`)?.split(",");
        const images = searchParams.get(`${alertName}-images`)?.split(",");
        const animation = searchParams.get(`${alertName}-animation`);
        const timeoutString = searchParams.get(`${alertName}-timeout`)

        let timeout = data.timeout;

        if (timeoutString !== null) {
            timeout = Number(timeoutString);

            if (isNaN(timeout))
                timeout = data.timeout
        }

        overrides.set(alertName, {
            ...data,
            name: alertName,
            animation: animation || data.animation,
            audios: audios || data.audios,
            images: images || data.images,
            timeout: timeout,
        });
    }
}

function createConfigs(config: Record<string, AlertConfig>) {
    Object.entries(config).forEach(([name, entry]) => {
        configs.set(name, {
            name,
            ...entry
        });

        overrides.set(name, {
            name,
            ...entry
        });
    })
}

export function getAlert(name: string): AlertData {
    const config = configs.get(name);
    const override = overrides.get(name);

    return {
        name: override.name ?? config.name,
        translations: override.translations ?? config.translations,
        style: override.style ?? config.style,
        audios: override.audios ?? config.audios,
        images: override.images ?? config.images,
        timeout: override.timeout ?? config.timeout,
        animation: override.animation ?? config.animation,
    };
}