import { AlertManager } from "./AlertManager";
import { AnimationManager } from "@/settings/AnimationManager";
import { addSelect, addInput, addTagSelector, createTabGroup } from "./utility/HtmlUtils";
import "../style.css";
import animationConfig from "./settings/animation.json"

const animationManager = AnimationManager.getInstance();
animationManager.load(animationConfig);

const alertManager = AlertManager.getInstance();
alertManager.load();


const configSelect: HTMLSelectElement = document.getElementById("config-select") as HTMLSelectElement;

function buildTabs() {
    // Ich will mich einfach erhängen... Wenn change = override aber kein reset wenn orig = override...
createTabGroup("alert-tabs", "alert-tab-container", alertManager.getAlerts(), alert => alert.name, (container, alert) => {
    const animations = animationManager.getAnimations();
    const images = alertManager.getImages();
    const audios = alertManager.getAudios();

    addInput(container, `${alert.name}-color`, "Color", "color", alert.color, (value: string) => {
        const alertEntry = alertManager.getOverride(alert.name);

        if (!alertEntry)
            return;
        
        if (alert.color == value)
            alertEntry.color = null;
        else
            alertEntry.color = value;
    });

    addInput(container, `${alert.name}-timeout`, "Timeout (ms)", "number", alert.timeout?.toString(), (value) => {
        const alertEntry = alertManager.getOverride(alert.name);

        if (!alertEntry)
            return;
        
        if (alert.timeout == value)
            alertEntry.timeout = null;
        else
            alertEntry.timeout = value;
    }, { min: "0", step: "100" });

    addSelect(container, `${alert.name}-animation`, "Animation", animations.map(a => a.name), alert.animation || "", (value) => {
        const alertEntry = alertManager.getOverride(alert.name);

        if (!alertEntry)
            return;
        
        if (alert.animation == value)
            alertEntry.animation = null;
        else
            alertEntry.animation = value;
    });

    addTagSelector(container, `${alert.name}-images`, "Images", images.map(img => img.name), alert.images?.map(image => image.name), (values) => {
        const alertEntry = alertManager.getOverride(alert.name);
        if(!alertEntry)
            return;

        const images = []

        for (const value of values) {
            const media = alertManager.getImage(value);

            if(!media)
                continue;

            images.push(media);
        }

        alertEntry.images = images;
    });

    addTagSelector(container, `${alert.name}-audios`, "Audios", audios.map(audio => audio.name), alert.audios?.map(audio => audio.name), (values) => {
        const alertEntry = alertManager.getOverride(alert.name);

        if(!alertEntry)
            return;

        const audios = []

        for (const value of values) {
            const media = alertManager.getAudio(value);

            if(!media)
                continue;

            audios.push(media);
        }

        alertEntry.audios = audios;

        console.log(alert.name, alertManager.getOverride(alert.name));
    });
});

createTabGroup("animation-tabs", "animation-tab-container", animationManager.getAnimations(), animation => animation.name, (container, animation) => {
    addInput(container, `${animation.name}-duration`, "Duration (ms)", "number", animation.duration?.toString(), (value) => {

    }, { min: "0", step: "100" });

    addSelect(container, `${animation.name}-timing-function`, "Timing", ["ease-in", "ease-out", "ease-in-out", "linear", "step-start", "step-end"], animation.timing, (value) => {

    });

    addInput(container, `${animation.name}-iterations`, "Iterations", "number", animation.iterations.toString(), (value) => {

    }, { min: "1", max: "100", step: "1" });
});
}

for (const config of alertManager.getLoadedConfigs()) {
    const option = document.createElement("option");
    option.value = config;
    option.textContent = config;

    configSelect.appendChild(option);
}

configSelect.addEventListener("change", () => {
    const alertTabsContainer = document.getElementById("alert-tabs");
    const alertTabContentContainer = document.getElementById("alert-tab-container");
    const animationTabsContainer = document.getElementById("animation-tabs");
    const animationTabContentContainer = document.getElementById("animation-tab-container");

    // Clear old UI
    alertTabsContainer.innerHTML = "";
    alertTabContentContainer.innerHTML = "";
    animationTabsContainer.innerHTML = "";
    animationTabContentContainer.innerHTML = "";

    alertManager.changeConfig(configSelect.value);
    buildTabs();
})

const button = document.getElementById("generate-url-button")
button.addEventListener("click", () => {
    const alertParams = alertManager.constructSearchParams()
    const animationParams = animationManager.constructSearchParams();

    console.log(alertParams.toString());
    console.log(animationParams.toString());
})

buildTabs();
//
/*

function initTagInput(idPrefix: string, initialTags: string[] = []) {
    const tagContainer = document.getElementById(`${idPrefix}-tags`);
    const input = document.getElementById(`${idPrefix}-tag-entry`) as HTMLInputElement;

    if (!tagContainer || !input) {
        console.error(`Tag container or input not found for prefix: ${idPrefix}`);
        return;
    }

    // Helper: Create tag element
    function createTag(item: string) {
        if (!item.trim()) return;

        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = item;

        // Remove tag on click
        tag.addEventListener("click", () => {
            tag.remove();
        });

        tagContainer!.appendChild(tag);
    }

    // Add initial tags
    initialTags.forEach(tag => createTag(tag));

    // Handle input (Enter key adds tag)
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            createTag(input.value);
            input.value = "";
        }
    });
}

initTagInput("archipelago-slot");
*/