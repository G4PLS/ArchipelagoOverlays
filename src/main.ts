import { SettingsManager } from "./settings";
import type { ItemAlertConfig } from "./settings";

const fileInput: HTMLInputElement = document.getElementById("fileInput") as HTMLInputElement

fileInput.addEventListener("change", (event) => {
    const file = fileInput.files?.[0];

    console.log("UPLOADED")

    if (!file)
        return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = JSON.parse(e.target?.result as string)
            let settingsManager: SettingsManager = new SettingsManager(json)

            console.log(settingsManager.getAnimation("fade-in"))
            
            let alertConf: ItemAlertConfig = settingsManager.getAlertSettings("item-alert", "trap")
            console.log(alertConf.animation == null)
        }
        catch (err) {
            console.error(err)
        }
    }
    reader.readAsText(file);
})
