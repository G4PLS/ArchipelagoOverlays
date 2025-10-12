import type { FontConfig } from "@/types/fontSettings";
import { addToSearchParamIfNoMatch } from "@/utils/addToSearchParamIfMatch";

let fontConfig: FontConfig;
let fontConfigOverride: FontConfig;

const availableFonts: Record<string, string> = {
  "system-ui": "System UI",
  "-apple-system": "Apple System",
  "BlinkMacSystemFont": "BlinkMac System Font",
  "SegoeUI": "Segoe UI",
  "Roboto": "Roboto",
  "HelveticaNeue": "Helvetica Neue",
  "Arial": "Arial",
  "NotoSans": "Noto Sans",
  "LiberationSans": "Liberation Sans",
  "Georgia": "Georgia",
  "TimesNewRoman": "Times New Roman",
  "Times": "Times",
  "PalatinoLinotype": "Palatino Linotype",
  "BookAntiqua": "Book Antiqua",
  "Consolas": "Consolas",
  "Menlo": "Menlo",
  "Monaco": "Monaco",
  "CourierNew": "Courier New",
  "LiberationMono": "Liberation Mono",
  "sans-serif": "Sans-serif",
  "serif": "Serif",
  "monospace": "Monospace"
};

const avialableStyles: Record<string, string> = {
    "normal": "Normal",
    "bold": "Bold",
    "italic": "Italic",
    "bi": "Bold + Italic"
};

const availableShadows: Record<string, string> = {
    "normal": "None",
    "small": "Small",
    "medium": "Medium",
    "large": "Large"
}

export function loadFont() {
    fontConfig = {
        family: "Arial",
        size: "12",
        style: "normal",
        shadow: "normal"
    };

    fontConfigOverride = {
        family: undefined,
        size: undefined,
        style: undefined,
        shadow: undefined
    };

    deconstructFontUrlParams();
}

export function deconstructFontUrlParams(params?: URLSearchParams) {
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

    console.log("FONT", fontConfigOverride);
}

export function constructFontUrlParams(params?: URLSearchParams): URLSearchParams {
    const searchParams: URLSearchParams = params || new URLSearchParams();

    addToSearchParamIfNoMatch(searchParams, "font-family", fontConfigOverride.family, fontConfig.family);
    addToSearchParamIfNoMatch(searchParams, "font-size", fontConfigOverride.size, fontConfig.size);
    addToSearchParamIfNoMatch(searchParams, "font-style", fontConfigOverride.style, fontConfig.style);
    addToSearchParamIfNoMatch(searchParams, "font-shadow", fontConfigOverride.shadow, fontConfig.shadow);

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

export function getAvailableFonts(): Record<string, string> {
    return availableFonts;
}

export function getAvailableStyles(): Record<string, string> {
    return avialableStyles;
}

export function getAvailableShadows(): Record<string, string> {
    return availableShadows;
}

export function getFontFromAvailableFonts(key: string): string|undefined {
    return availableFonts[key];
}