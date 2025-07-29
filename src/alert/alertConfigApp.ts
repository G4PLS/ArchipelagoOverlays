import { SettingsManager, type AlertConfig, type AnimationConfig } from "../settingsManager";

const settingsManager = SettingsManager.getInstance();
await settingsManager.loadConfig("/config.json")

const animations = settingsManager.getAnimations();
const alerts = settingsManager.getAlerts();

const alertTabsContainer = document.getElementById("tabs");
const alertTabContentContainer = document.getElementById("tabs-content");
let alertTabIndex = 0;

for (let alert of alerts) {
    const tab = document.createElement("div");

    tab.className = `tab ${alertTabIndex === 0 ? 'active' : ''}`;
    tab.textContent = alert.name;
    tab.dataset.target = alert.name;
    alertTabsContainer?.appendChild(tab);

    const content = document.createElement("div");

    content.className = `tab-content settings-box ${alertTabIndex === 0 ? 'active' : ''}`;
    content.id = alert.name;

    alertTabContentContainer?.appendChild(content);

    const alertName = document.createElement("label");
    alertName.textContent = alert.name;
    
    createAlertSettings(content, alert);

    tab.addEventListener("click", () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
    });

    alertTabIndex++;
}

function createAlertSettings(container: HTMLElement, alert: AlertConfig) {
    if (alert?.color) {
        const id = `${alert.name}-color`

        const label = document.createElement("label");
        label.textContent = "Color";
        label.htmlFor = id;

        const input = document.createElement("input");
        input.type = "color";
        input.value = alert.color;
        input.id = id;

        container.appendChild(label);
        container.appendChild(input);
    }

    if (alert?.timeout) {
        const id = `${alert.name}-timeout`

        const label = document.createElement("label");
        label.textContent = "Timeout";
        label.htmlFor = id;

        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.step = "100";
        input.value = alert.timeout.toString();
        input.id = id;

        container.appendChild(label);
        container.appendChild(input);
    }

    if (alert?.animation && animations) {
        const id = `${alert.name}-animation`

        const label = document.createElement("label");
        label.textContent = "Animation";
        label.htmlFor = id;

        const input = document.createElement("select");
        input.id = id;

        animations.forEach(animation => {
            const option = document.createElement("option");
            option.value = animation.name;
            option.textContent = animation.name;
            input.appendChild(option);
        });

        input.value = alert.animation;

        container.appendChild(label);
        container.appendChild(input);
    }
}

const animationTabsContainer = document.getElementById("animations");
const animationTabContentContainer = document.getElementById("animations-content");
let animationTabIndex = 0;

for (let animation of animations) {
     const tab = document.createElement("div");

    tab.className = `tab ${animationTabIndex === 0 ? 'active' : ''}`;
    tab.textContent = animation.name;
    tab.dataset.target = animation.name;
    animationTabsContainer?.appendChild(tab);

    const content = document.createElement("div");

    content.className = `tab-content settings-box ${animationTabIndex === 0 ? 'active' : ''}`;
    content.id = animation.name;

    animationTabContentContainer?.appendChild(content);

    const animationName = document.createElement("label");
    animationName.textContent = alert.name;
    
    createAnimationSettings(content, animation);

    tab.addEventListener("click", () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
    });

    animationTabIndex++;
}

function createAnimationSettings(container: HTMLElement, animation: AnimationConfig) {
    if (animation?.duration) {

        const id = `${animation.name}-duration`

        const label = document.createElement("label");
        label.textContent = "Duration";
        label.htmlFor = id;

        const input = document.createElement("input");
        input.type = "number";
        input.value = animation.duration.toString();
        input.min = "0";
        input.step = "100";
        input.id = id;

        container.appendChild(label);
        container.appendChild(input);
    }
}