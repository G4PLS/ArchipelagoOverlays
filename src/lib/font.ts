import type { FontConfig } from "@/types/fontSettings";
import { addToSearchParamIfMatch } from "@/utils/addToSearchParamIfMatch";

let fontConfig: FontConfig;
let fontConfigOverride: FontConfig;

export function loadFont() {
    fontConfig = {
        family: "Arial",
        size: "12",
        style: "bold",
        shadow: "none"
    };

    fontConfigOverride = {
        family: undefined,
        size: undefined,
        style: undefined,
        shadow: undefined
    };
}

export function deconstructUrlParams(params?: URLSearchParams) {
    const searchParams: URLSearchParams = params || new URL(window.location.href).searchParams;

    const family = searchParams.get("font-family");
    const size = searchParams.get("font-size");
    const style = searchParams.get("font-style");
    const shadow = searchParams.get("font-shadow");

    fontConfigOverride = {
        family: family ?? fontConfig.family,
        size: size ?? fontConfig.size,
        style: style ?? fontConfig.style,
        shadow: shadow ?? fontConfig.shadow
    };
}

export function constructUrlParams(): URLSearchParams {
    const searchParams: URLSearchParams = new URLSearchParams();

    addToSearchParamIfMatch(searchParams, "font-family", fontConfigOverride.family, fontConfig.family);
    addToSearchParamIfMatch(searchParams, "font-size", fontConfigOverride.size, fontConfig.size);
    addToSearchParamIfMatch(searchParams, "font-style", fontConfigOverride.style, fontConfig.style);
    addToSearchParamIfMatch(searchParams, "font-shadow", fontConfigOverride.shadow, fontConfig.shadow);

    return searchParams;
}

export function setFontOverride(override: Partial<FontConfig>) {
    const font = getFont();

    fontConfigOverride = {
        family: override.family ?? font.family,
        size: override.size ?? font.size,
        style: override.style ?? font.style,
        shadow: override.shadow ?? font.shadow
    }
}

export function getFont(): FontConfig {
    return {
        family: fontConfigOverride?.family ?? fontConfig.family,
        size: fontConfigOverride?.size ?? fontConfig.size,
        style: fontConfigOverride?.style ?? fontConfig.style,
        shadow: fontConfigOverride?.shadow ?? fontConfig.shadow
    }
}