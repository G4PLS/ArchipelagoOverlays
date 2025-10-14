import { type Translation } from "@/types/alertSettings";
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
  alertName: string,
  translations: Translation
): string {
  if (!translations)
    return "";

  const text = translations[lang];

  if (!text)
    return "";

  if (!variables)
    return text;

  const formattedText = text.replace(/{{(\w+)}}/g, (_, key) => {
    // Only allow keys defined in TranslationVariables
    if (!(key in variables)) {
        console.error(`{{${key}}} is not defined in "${text}"`);
        return "";
    }

    const value = variables[key as keyof TranslationVariables] ?? "";
    return `<span class="variable ${key} ${alertName}-${key}">${value}</span>`
  });
  return formattedText;
}
