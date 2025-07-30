import { removeAnimationFromElement } from "../animation";
import { SettingsManager, type AlertConfig, type AnimationConfig } from "../settingsManager";

const settingsManager = SettingsManager.getInstance();
await settingsManager.loadConfig("/config.json")

const animations = settingsManager.getAnimations();
const alerts = settingsManager.getAlerts();
const audios = settingsManager.getAudios();
const images = settingsManager.getImages();

function createTabGroup<T>(
    containerId: string,
    contentId: string,
    items: T[],
    getName: (item: T) => string,
    createSettings: (container: HTMLElement, item: T) => void
) {
    const tabsContainer = document.getElementById(containerId);
    const contentContainer = document.getElementById(contentId);

    items.forEach((item, index) => {
        const name = getName(item);

        // Create tab
        const tab = document.createElement("div");
        tab.className = `tab ${index === 0 ? "active" : ""}`;
        tab.textContent = name;
        tab.dataset.target = name;
        tabsContainer?.appendChild(tab);

        // Create tab content
        const content = document.createElement("div");
        content.className = `tab-content settings-box ${index === 0 ? "active" : ""}`;
        content.id = name;
        contentContainer?.appendChild(content);

        // Create settings for this item
        createSettings(content, item);

        // Tab click handler
        tab.addEventListener("click", () => {
            // Remove active class only in this group
            tabsContainer?.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            contentContainer?.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

            // Activate this tab + its content
            tab.classList.add("active");
            document.getElementById(tab.dataset.target!)?.classList.add("active");
        });
    });
}

function createAlertSettings(container: HTMLElement, alert: AlertConfig) {
    addInput(container, `${alert.name}-color`, "Color", "color", alert.color);
    addInput(container, `${alert.name}-timeout`, "Timeout (ms)", "number", alert.timeout?.toString(), { min: "0", step: "100" })
    addSelect(container, `${alert.name}-animation`, "Animation", animations.map(a => a.name), alert.animation || "");
    addTagSelector(container, `${alert.name}-images`, "Images", images.map(image => image.name), alert.imageSources?.map(image => image.name));
    addTagSelector(container, `${alert.name}-audios`, "Audios", audios.map(audio => audio.name), alert.audioSources?.map(audio => audio.name));
}

function createAnimationSettings(container: HTMLElement, animation: AnimationConfig) {
    addInput(container, `${animation.name}-duration`, "Duration (ms)", "number", animation.duration?.toString(), { min: "0", step: "100" })
    addSelect(container, `${animation.name}-timing-function`, "Timing Function", ["ease-in", "ease-out", "ease-in-out", "linear", "step-start", "step-end"], animation.timingFunction);
    addInput(container, `${animation.name}-iterations`, "Iterations", "number", animation.iterationCount.toString(), {min: "1", max:"100", step:"1"});
}

function addInput(container: HTMLElement, id: string, labelText: string, type: string, value: string, attributes: Record<string, string> = {}) {
    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = id;

    const input = document.createElement("input");
    input.type = type;
    input.value = value;
    input.id = id;
    Object.entries(attributes).forEach(([k, v]) => input.setAttribute(k, v));

    container.appendChild(label);
    container.appendChild(input);
}

function addSelect(
    container: HTMLElement,
    id: string,
    labelText: string,
    options: string[],
    selected: string
) {
    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = id;

    const select = document.createElement("select");
    select.id = id;

    options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
    });
    select.value = selected;

    container.appendChild(label);
    container.appendChild(select);
}

function addTagSelector(
    container: HTMLElement,
    id: string,
    labelText: string,
    allItems: string[],
    initialSelected: string[] = []
) {
    // Label
    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = id;

    // Tag container
    const tagContainer = document.createElement("div");
    tagContainer.className = "tag-container";
    tagContainer.id = `${id}-tags`;

    // Selector
    const select = document.createElement("select");
    select.id = id;
    select.className = "tag-selector";

    // Default placeholder
    const placeholder = document.createElement("option");
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.value = "";
    placeholder.textContent = "-- Select item --";
    select.appendChild(placeholder);

    // Helper: Create tag element
    function createTag(item: string) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = item;

        tag.addEventListener("click", () => {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            select.appendChild(option);
            tag.remove();
        });

        tagContainer.appendChild(tag);
    }

    // Add initial tags
    initialSelected.forEach(item => {
        if (allItems.includes(item)) {
            createTag(item);
        }
    });

    // Add remaining options to selector
    allItems.forEach(item => {
        if (!initialSelected.includes(item)) {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            select.appendChild(option);
        }
    });

    // Handle selection
    select.addEventListener("change", () => {
        const value = select.value;
        if (!value) return;

        createTag(value);
        select.querySelector(`option[value="${value}"]`)?.remove();
        select.value = "";
    });

    const mainContainer = document.createElement("div");
    mainContainer.classList.add("tag-main-container");

    mainContainer.appendChild(tagContainer)
    mainContainer.appendChild(select)

    // Append everything
    container.appendChild(label);
    container.appendChild(mainContainer);
}

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


function generateUrl() {
    const baseUrl = "http://localhost:5173/alert";
    const params = new URLSearchParams();

    // ARCHIPELAGO
    const archipelagoUrlElement: HTMLInputElement = document.getElementById("archipelago-url") as HTMLInputElement;
    if (archipelagoUrlElement) {
        const fullUrl = archipelagoUrlElement.value;

        const parts = fullUrl.split(":");

        if (parts.length == 1) {
            params.set("url", fullUrl);
        }
        else if (parts.length == 2) {
            params.set("url", parts[0])
            params.set("port", parts[1])
        }
    }

    const archipelagoSlotElement = Array.from(document.querySelectorAll(`#archipelago-slot-tags .tag`))
            .map(tag => tag.textContent || "");
    if (archipelagoSlotElement) {
        params.set(`slots`, archipelagoSlotElement.join(","));
    }

    const archipelagoPasswordElement: HTMLInputElement = document.getElementById("archipelago-password") as HTMLInputElement;
    if (archipelagoPasswordElement) {
        params.set("password", archipelagoPasswordElement.value);
    }

    // FONT
    const fontElement: HTMLSelectElement = document.getElementById("font") as HTMLSelectElement;
    if (fontElement) {
        params.set("font", fontElement.value);
    }

    const fontStyleElement: HTMLSelectElement = document.getElementById("font-style") as HTMLSelectElement;
    if (fontStyleElement) {
        params.set("font-style", fontStyleElement.value);
    }

    const fontSizeElement: HTMLInputElement = document.getElementById("font-size") as HTMLInputElement;
    if (fontSizeElement) {
        params.set("font-size", fontSizeElement.value);
    }

    const strokeWidthElement: HTMLSelectElement = document.getElementById("stroke-width") as HTMLSelectElement;
    if (strokeWidthElement) {
        params.set("stroke-width", strokeWidthElement.value);
    }

    const shadowElement: HTMLSelectElement = document.getElementById("shadow-select") as HTMLSelectElement;
    if (shadowElement) {
        params.set("shadow-select", shadowElement.value);
    }

    // ALERTS
    alerts.forEach(alert => {
        const colorElement: HTMLInputElement = document.getElementById(`${alert.name}-color`) as HTMLInputElement;
        if (colorElement && colorElement.value.toLowerCase() !== alert.color.toLowerCase()) {
            params.set(`${alert.name}-color`, colorElement.value.replace(/^#/, ""));
        }

        const timeoutElement: HTMLInputElement = document.getElementById(`${alert.name}-timeout`) as HTMLInputElement;
        if (timeoutElement && Number(timeoutElement.value) !== alert.timeout) {
            params.set(`${alert.name}-timeout`, timeoutElement.value);
        }

        const animationElement: HTMLSelectElement = document.getElementById(`${alert.name}-animation`) as HTMLSelectElement;
        if (animationElement && animationElement.value !== alert.animation) {
            params.set(`${alert.name}-animation`, animationElement.value);
        }

        const audioTags = Array.from(document.querySelectorAll(`#${alert.name}-audios-tags .tag`))
            .map(tag => tag.textContent || "");
        const defaultAudios = alert.audioSources.map(a => a.name);
        if (JSON.stringify(audioTags) !== JSON.stringify(defaultAudios)) {
            params.set(`${alert.name}-audios`, audioTags.join(","));
        }

        const imageTags = Array.from(document.querySelectorAll(`#${alert.name}-images-tags .tag`))
            .map(tag => tag.textContent || "");
        const defaultImages = alert.imageSources.map(i => i.name);
        if (JSON.stringify(imageTags) !== JSON.stringify(defaultImages)) {
            params.set(`${alert.name}-images`, imageTags.join(","));
        }
    });

    // ANIMATIONS
    animations.forEach(animation => {
        const durationElement: HTMLInputElement = document.getElementById(`${animation.name}-duration`) as HTMLInputElement;
        if (durationElement && Number(durationElement.value) !== animation.duration) {
            params.set(`${animation.name}-duration`, durationElement.value);
        }
    });

    const finalUrl = `${baseUrl}?${params.toString()}`;
    console.log(finalUrl);
    return finalUrl;
}

createTabGroup("alert-tabs", "alert-tab-container", alerts, alert => alert.name, createAlertSettings)
createTabGroup("animation-tabs", "animation-tab-container", animations, animation => animation.name, createAnimationSettings)
initTagInput("archipelago-slot")

document.getElementById("generate-url-button")?.addEventListener("click", () => {
    const url = generateUrl();
    navigator.clipboard.writeText(url);
});

