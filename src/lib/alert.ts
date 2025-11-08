import alerts from '@/data/alerts.json';
import type { AlertInstance } from '@/types/alert';
import { addIfNoMatch } from '@/utils/searchParams';
import { stringToNumber } from '@/utils/stringToNumber';

const configs: Map<string, AlertInstance> = new Map();
const overrides: Map<string, AlertInstance> = new Map();

function initializeAlerts() {
    Object.entries(alerts).forEach(([name, entry]) => {
        configs.set(name, {
            name,
            timeout: entry.timeout,
            translations: entry.translations,
            audioReferences: entry["audio-references"],
            imageReferences: entry["image-references"],
            animation: entry.animation,
        });

        overrides.set(name, {
            name,
            timeout: undefined,
            translations: undefined,
            audioReferences: undefined,
            imageReferences: undefined,
            animation: {
                reference: undefined,
                duration: undefined,
                iterations: undefined,
                timing: undefined,
            },
        });
    });

    console.log("INITIALIZED ALERTS");
}

export function reload() {
    configs.clear();
    overrides.clear();
    initializeAlerts();
}

export function deconstructAlertParams(params: URLSearchParams) {
    for (const [name, data] of configs) {
        const timeoutString: string = params.get(`${name}-timeout`);
        const audios: string[] = params.get(`${name}-a`)?.split(",");
        const images: string[] = params.get(`${name}-i`)?.split(",");

        const animReference: string = params.get(`${name}-anim`);
        const animDurationStr: string = params.get(`${name}-anim-duration`);
        const animIterationsStr: string = params.get(`${name}-anim-iterations`);
        const animTiming: string = params.get(`${name}-anim-timing`);

        const timeout = stringToNumber(timeoutString, data.timeout);
        const animDuration = stringToNumber(animDurationStr, data.animation.duration);
        const animIterations = stringToNumber(animIterationsStr, data.animation.iterations);

        overrides.set(name, {
            name,
            timeout: timeout,
            translations: undefined,
            audioReferences: audios,
            imageReferences: images,
            animation: {
                reference: animReference,
                duration: animDuration,
                iterations: animIterations,
                timing: animTiming,
            },
        });
    }
}

export function constructAlertParams(params: URLSearchParams) {
    for (const [name, data] of overrides) {
        const base = configs.get(name);

        if (!base)
            continue;

        addIfNoMatch(params, `${name}-timeout`, data.timeout, [undefined, base.timeout]);
        addIfNoMatch(params, `${name}-a`, data.audioReferences, [undefined, base.audioReferences]);
        addIfNoMatch(params, `${name}-i`, data.imageReferences, [undefined, base.imageReferences]);

        const animation = data.animation;
        const baseAnimation = base.animation;
        addIfNoMatch(params, `${name}-anim`, animation.reference, [undefined, baseAnimation.reference]);
        addIfNoMatch(params, `${name}-anim-duration`, animation.duration, [undefined, baseAnimation.duration]);
        addIfNoMatch(params, `${name}-anim-iterations`, animation.iterations, [undefined, baseAnimation.iterations]);
        addIfNoMatch(params, `${name}-anim-timing`, animation.timing, [undefined, baseAnimation.timing]);
    }
}

export function setAlertOverride(name: string, overrideValues: Partial<Omit<AlertInstance, "name" | "animation">> & {animation?: Partial<AlertInstance["animation"]>}) {
    const override = overrides.get(name);

    if (!override) {
        return;
    }

    overrides.set(name, {
        ...override,
        ...overrideValues,
        animation: {
            ...override.animation,
            ...overrideValues.animation
        },
        translations: undefined
    });
}

export function getAlert(name: string): AlertInstance {
    const config = configs.get(name);
    const override = overrides.get(name);

    if(!config)
        return null;

    return {
        name,
        timeout: override?.timeout ?? config.timeout,
        translations: config.translations,
        audioReferences: override?.audioReferences ?? config.audioReferences,
        imageReferences: override?.imageReferences ?? config.imageReferences,
        animation: {
            reference: override?.animation.reference ?? config.animation.reference,
            duration: override?.animation.duration ?? config.animation.duration,
            iterations: override?.animation.iterations ?? config.animation.iterations,
            timing: override?.animation.timing ?? config.animation.timing
        }
    }
}

export function getAlerts(): AlertInstance[] {
    return Array.from(configs.keys()).map(key => getAlert(key));
}

initializeAlerts();