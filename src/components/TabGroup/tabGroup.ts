import './style.css';

const tabGroupTemplate = document.createElement("template");
tabGroupTemplate.innerHTML = `
<div class="tab-group__tabs">

</div>

<div class="tab-group__content">

</div>
`

const tabTemplate = document.createElement("template");
tabTemplate.innerHTML = `
<div class="tab">
    <button class="tab__button">item</button>
</div>
`

export interface TabData {
    label: string;
    value?: string;
}

export class TabGroup extends HTMLElement {
    private tabContainer!: HTMLDivElement;
    private contentContainer!: HTMLDivElement;
    private tabs: TabData[];
    private currentTab: TabData;

    constructor() {
        super();

        const children = Array.from(this.children);

        const clonedTabGroupTemplate = tabGroupTemplate.content.cloneNode(true) as DocumentFragment;
        this.appendChild(clonedTabGroupTemplate);

        this.tabContainer = this.querySelector('.tab-group__tabs');
        this.contentContainer = this.querySelector('.tab-group__content');

        children.forEach(child => this.contentContainer.appendChild(child));
    }

    private dispatchTabChange() {
        this.dispatchEvent(new CustomEvent('tab-change', {
            detail: this.currentTab,
            bubbles: true,
            composed: true
        }));
    }

    rerender() {
        this.tabContainer.innerHTML = "";

        this.tabs.forEach((tab, index) => {
            if (tab.value === undefined)
                tab.value = tab.label;

            const clonedTabTemplate = tabTemplate.content.cloneNode(true) as DocumentFragment;

            const button = clonedTabTemplate.querySelector('.tab__button') as HTMLButtonElement;

            button.value = tab.value;
            button.textContent = tab.label;

            if (index === 0) {
                button.classList.add("active");
                this.currentTab = tab;
                this.dispatchTabChange();
            }

            button.addEventListener('click', () => {
                if (this.currentTab) {
                    const oldTab = this.tabContainer.querySelector(`.tab__button[value=${this.currentTab.value}]`) as HTMLButtonElement;

                    if (oldTab.value === button.value)
                        return;

                    oldTab.classList.remove("active");
                }

                button.classList.add("active");
                this.currentTab = {value: button.value ?? button.textContent, label: button.textContent};
                this.dispatchTabChange();
            });

            this.tabContainer.appendChild(button.parentElement);
        });
    }

    setTabs(tabs: TabData[]) {
        this.tabContainer.innerHTML = "";
        this.tabs = tabs;

        tabs.forEach((tab, index) => {
            if (tab.value === undefined)
                tab.value = tab.label;

            const clonedTabTemplate = tabTemplate.content.cloneNode(true) as DocumentFragment;

            const button = clonedTabTemplate.querySelector('.tab__button') as HTMLButtonElement;

            button.value = tab.value;
            button.textContent = tab.label;

            if (index === 0) {
                button.classList.add("active");
                this.currentTab = tab;
                this.dispatchTabChange();
            }

            button.addEventListener('click', () => {
                if (this.currentTab) {
                    const oldTab = this.tabContainer.querySelector(`.tab__button[value=${this.currentTab.value}]`) as HTMLButtonElement;

                    if (oldTab.value === button.value)
                        return;

                    oldTab.classList.remove("active");
                }

                button.classList.add("active");
                this.currentTab = {value: button.value ?? button.textContent, label: button.textContent};
                this.dispatchTabChange();
            });

            this.tabContainer.appendChild(button.parentElement);
        });
    }

    getCurrentTab() {
        return this.currentTab;
    }
}

customElements.define('tab-group', TabGroup);