import type { FontData, FontInstance } from "@/types/font";
import { addIfNoMatch } from "@/utils/searchParams";

const fontConfig: FontInstance = {
  family: "Arial",
  size: "12",
  style: "normal",
  shadow: "normal"
}

let fontOverride: FontInstance = {
  family: undefined,
  size: undefined,
  style: undefined,
  shadow: undefined
}

const fontData: FontData = {
  availableFonts: {
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
  },
  avaiableStyles: {
    "normal": "Normal",
    "bold": "Bold",
    "italic": "Italic",
    "bi": "Bold + Italic"
  },
  availableShadows: {
      "normal": "None",
    "small": "Small",
    "medium": "Medium",
    "large": "Large"
  }
}

export function deconstructFontParams(params: URLSearchParams) { 
  const family = params.get("font-family");
  const size = params.get("font-size");
  const style = params.get("font-style");
  const shadow = params.get("font-shadow");

  fontOverride = {
    family,
    size,
    style,
    shadow
  };
}

export function constructFontParams(params: URLSearchParams) {
  addIfNoMatch(params, "font-family", fontOverride.family, [fontConfig.family, undefined]);
  addIfNoMatch(params, "font-size", fontOverride.size, [fontConfig.size, undefined]);
  addIfNoMatch(params, "font-style", fontOverride.style, [fontConfig.style, undefined]);
  addIfNoMatch(params, "font-shadow", fontOverride.shadow, [fontConfig.shadow, undefined]);
}

export function setFontOverride(overrideValues: Partial<FontInstance>) {
  fontOverride = {
    ...fontOverride,
    ...overrideValues
  }
}

export function getFont(): FontInstance {
  return {
    family: fontOverride.family ?? fontConfig.family,
    size: fontOverride.size ?? fontConfig.size,
    style: fontOverride.style ?? fontConfig.style,
    shadow: fontOverride.shadow ?? fontConfig.shadow,
  }
}

export function getFontData() {
  return fontData;
}