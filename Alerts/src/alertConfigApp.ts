import { SettingsManager, type AlertConfig, type AnimationConfig } from "@/SettingsManager";
import { URLParser } from "@/URLParser";
import "@/alertConfig.css";

const urlParser = URLParser.getInstance();
await urlParser.initializeDefaultParams();

const settingsManager = SettingsManager.getInstance();

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
    addInput(container, `${alert.name}-timeout`, "Timeout (ms)", "number", alert.timeout?.toString(), { min: "0", step: "100" });
    addSelect(container, `${alert.name}-animation`, "Animation", animations.map(a => a.name), alert.animation || "");
    addTagSelector(container, `${alert.name}-images`, "Images", images.map(image => image.name), alert.imageSources?.map(image => image.name));
    addTagSelector(container, `${alert.name}-audios`, "Audios", audios.map(audio => audio.name), alert.audioSources?.map(audio => audio.name));
}

function createAnimationSettings(container: HTMLElement, animation: AnimationConfig) {
    addInput(container, `${animation.name}-duration`, "Duration (ms)", "number", animation.duration?.toString(), { min: "0", step: "100" });
    addSelect(container, `${animation.name}-timing-function`, "Timing Function", ["ease-in", "ease-out", "ease-in-out", "linear", "step-start", "step-end"], animation.timingFunction);
    addInput(container, `${animation.name}-iterations`, "Iterations", "number", animation.iterationCount.toString(), { min: "1", max: "100", step: "1" });
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

    mainContainer.appendChild(tagContainer);
    mainContainer.appendChild(select);

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
    // ARCHIPELAGO
    const archipelagoUrlElement: HTMLInputElement = document.getElementById("archipelago-url") as HTMLInputElement;
    if (archipelagoUrlElement) {
        urlParser.archipelagoParams.url = archipelagoUrlElement.value;
    }

    const archipelagoSlotElement = Array.from(document.querySelectorAll(`#archipelago-slot-tags .tag`))
        .map(tag => tag.textContent || "");
    if (archipelagoSlotElement) {
        urlParser.archipelagoParams.slots = archipelagoSlotElement;
    }

    const archipelagoPasswordElement: HTMLInputElement = document.getElementById("archipelago-password") as HTMLInputElement;
    if (archipelagoPasswordElement) {
        urlParser.archipelagoParams.password = archipelagoPasswordElement.value;
    }

    // FONT
    const fontElement: HTMLSelectElement = document.getElementById("font") as HTMLSelectElement;
    if (fontElement) {
        urlParser.fontParams.font = fontElement.value;
    }

    const fontStyleElement: HTMLSelectElement = document.getElementById("font-style") as HTMLSelectElement;
    if (fontStyleElement) {
        urlParser.fontParams.style = fontStyleElement.value;
    }

    const fontSizeElement: HTMLInputElement = document.getElementById("font-size") as HTMLInputElement;
    if (fontSizeElement) {
        urlParser.fontParams.size = fontSizeElement.value;
    }

    const strokeWidthElement: HTMLSelectElement = document.getElementById("stroke-width") as HTMLSelectElement;
    if (strokeWidthElement) {
        urlParser.fontParams.strokeWidth = strokeWidthElement.value;
    }

    const shadowElement: HTMLSelectElement = document.getElementById("shadow-select") as HTMLSelectElement;
    if (shadowElement) {
        urlParser.fontParams.shadow = shadowElement.value;
    }

    const imageWidthElement: HTMLInputElement = document.getElementById("image-size-width") as HTMLInputElement;
    if (imageWidthElement) {
        urlParser.imageParams.width = imageWidthElement.value;
    }

    const imageHeightElement: HTMLInputElement = document.getElementById("image-size-height") as HTMLInputElement;
    if (imageHeightElement) {
        urlParser.imageParams.height = imageHeightElement.value;
    }

    const imageContrastElement: HTMLInputElement = document.getElementById("image-contrast") as HTMLInputElement;
    if (imageContrastElement) {
        urlParser.imageParams.contrast = imageContrastElement.value;
    }

    // ALERTS
    alerts.forEach(alert => {
        if (!urlParser.alertParams.has(alert.name)) {
            urlParser.alertParams.set(alert.name, null);
        }

        const alertParams = urlParser.alertParams.get(alert.name);

        const colorElement: HTMLInputElement = document.getElementById(`${alert.name}-color`) as HTMLInputElement;
        if (colorElement && colorElement.value.toLowerCase() !== alert.color.toLowerCase()) {
            alertParams.color = colorElement.value.replace(/^#/, "");
        }

        const timeoutElement: HTMLInputElement = document.getElementById(`${alert.name}-timeout`) as HTMLInputElement;
        if (timeoutElement && Number(timeoutElement.value) !== alert.timeout) {
            alertParams.timeout = timeoutElement.value;
        }

        const animationElement: HTMLSelectElement = document.getElementById(`${alert.name}-animation`) as HTMLSelectElement;
        if (animationElement && animationElement.value !== alert.animation) {
            alertParams.animation = animationElement.value;
        }

        const audioTags = Array.from(document.querySelectorAll(`#${alert.name}-audios-tags .tag`))
            .map(tag => tag.textContent || "");
        const defaultAudios = alert.audioSources.map(a => a.name);
        if (JSON.stringify(audioTags) !== JSON.stringify(defaultAudios)) {
            alertParams.audios = audioTags;
        }

        const imageTags = Array.from(document.querySelectorAll(`#${alert.name}-images-tags .tag`))
            .map(tag => tag.textContent || "");
        const defaultImages = alert.imageSources.map(i => i.name);
        if (JSON.stringify(imageTags) !== JSON.stringify(defaultImages)) {
            alertParams.images = imageTags;
        }
    });

    // ANIMATIONS
    animations.forEach(animation => {
        if (!urlParser.animationParams.has(animation.name)) {
            urlParser.animationParams.set(animation.name, null);
        }

        const animationParams = urlParser.animationParams.get(alert.name);

        const durationElement: HTMLInputElement = document.getElementById(`${animation.name}-duration`) as HTMLInputElement;
        if (durationElement && Number(durationElement.value) !== animation.duration) {
            animationParams.duration = durationElement.value;
        }
    });

    return urlParser.constructUrl();
}

createTabGroup("alert-tabs", "alert-tab-container", alerts, alert => alert.name, createAlertSettings);
createTabGroup("animation-tabs", "animation-tab-container", animations, animation => animation.name, createAnimationSettings);
initTagInput("archipelago-slot");

document.getElementById("generate-url-button")?.addEventListener("click", () => {
    const url = generateUrl();
    navigator.clipboard.writeText(url.toString());
});