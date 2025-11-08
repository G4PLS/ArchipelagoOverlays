import type { AlertInstance } from "@/types/alert";
import type { TranslationVariables } from "@/types/translationVariables";

const fallbackLang: string = "en";
let lang: string = "en";

export function parse(alert: AlertInstance, variables: TranslationVariables) {
    if (!alert || !alert.translations)
        return "";

    const text = alert.translations[lang] || alert.translations[fallbackLang];

    if (!text)
        return "";

    return replaceText(text, variables);
}

function replaceText(input: string, variables: TranslationVariables) {
    input = input.replace(/\{\{(\w+)\}\}/g, (_, variable) => {
        const key = variable as keyof TranslationVariables;
        const value = variables[key] ?? key;

        return `<span class=${variable}>${value}</span>`
    });

    input = input.replace(/\[\[(\w+):([^\]]+)\]\]/g, (_, key, value) => {
        return `<span class=${key}>${value}</span>`
    });

    return input;
}