import { SettingsManager } from "./settingsManager"

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
            let settingsManager: SettingsManager = SettingsManager.getInstance()
        }
        catch (err) {
            console.error(err)
        }
    }
    reader.readAsText(file);
})
