import { type StyleMap, type Translation } from "@/types/alertSettings";
import type { TranslationVariables } from "@/types/translationVariables";

/*
sender: Preson that sended
target: Person that received
item: Item that was received
*/

const fallbackLang: string = "en";
let lang: string = "en";

export function loadLanguage() {
    const searchParams: URLSearchParams = new URL(window.location.href).searchParams;

    lang = searchParams.get("lang") || fallbackLang;
    console.log("LANGUAGE", lang);
}

export function parseText(
  variables: TranslationVariables,
  style: StyleMap,
  translations: Translation
): string {
  const text = translations[lang];

  if (!text) return;

  const formattedText = text.replace(/{{(\w+)}}/g, (_, key) => {
    // Only allow keys defined in TranslationVariables
    if (!(key in variables)) {
        console.error(`{{${key}}} is not defined in "${text}"`);
        return "";
    }

    const value = variables[key as keyof TranslationVariables] ?? "";
    const styleCss = style[key] ? `color: ${style[key].color};` : "";
    const idCss = key;
    return `<span id="${idCss}" style="${styleCss}">${value}</span>`;
  });
  return formattedText;
}
