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
    if (alert?.color) {
        addInput(container, `${alert.name}-color`, "Color", "color", alert.color);
    }
    if (alert?.timeout) {
        addInput(container, `${alert.name}-timeout`, "Timeout", "number", alert.timeout.toString(), { min: "0", step: "100" })
    }
    if (alert?.animation) {
        addSelect(container, `${alert.name}-animation`, "Animation", animations.map(a => a.name), alert.animation);
    }
    if (alert?.audioSources) {
        addTagSelector(container, `${alert.name}-audios`, "Audios", audios.map(audio => audio.name), alert.audioSources.map(audio => audio.name));
    }
    if (alert?.imageSources) {
        addTagSelector(container, `${alert.name}-images`, "Images", images.map(image => image.name), alert.imageSources.map(image => image.name));
    }
}

function createAnimationSettings(container: HTMLElement, animation: AnimationConfig) {
    if (animation?.duration) {
        addInput(container, `${animation.name}-timeout`, "Duration", "number", animation.duration.toString(), { min: "0", step: "100" })
    }
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

function generateUrl() {
    const baseUrl = "http://localhost:5173/alert";
    const params = new URLSearchParams();

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

    animations.forEach(animation => {
        const durationElement: HTMLInputElement = document.getElementById(`${animation.name}-timeout`) as HTMLInputElement;
        if (durationElement && Number(durationElement.value) !== animation.duration) {
            params.set(`${animation.name}-timeout`, durationElement.value);
        }
    });

    const finalUrl = `${baseUrl}?${params.toString()}`;
    console.log(finalUrl);
    return finalUrl;
}

createTabGroup("alert-tabs", "alert-tab-container", alerts, alert => alert.name, createAlertSettings)
createTabGroup("animation-tabs", "animation-tab-container", animations, animation => animation.name, createAnimationSettings)

document.getElementById("generate-url-button")?.addEventListener("click", () => {
    const url = generateUrl();
    navigator.clipboard.writeText(url);
});