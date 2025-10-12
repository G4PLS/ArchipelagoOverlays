export type TabBarOptions = {
    tabContainer: HTMLElement;
    contentContainer: HTMLElement;
    tabs?: string[];
    onTabActivated?: (tabId: string, contentContainer: HTMLElement) => void;
    initialTab?: string;
}

export class TabGroup {
    private options: TabBarOptions;
    private activeTab: string;

    constructor(options: TabBarOptions) {
        this.options = options;
        this.activeTab = options.initialTab || options.tabs[0] || "";
    
        this.setTabs(this.options.tabs, this.activeTab);
    }

    rerender() {
        this.render();
    }

    private render() {
        const tabContainer = this.options.tabContainer;

        tabContainer.innerHTML = "";

        for (const tab of this.options.tabs) {
            const tabElement = this.createTab(tab, tab === this.activeTab);
            tabContainer.appendChild(tabElement);
        }

        if (this.activeTab)
            this.activateTab(this.activeTab);
    }

    private createTab(tab: string, isActiveTab: boolean): HTMLButtonElement {
        const tabElement = document.createElement("button");

        tabElement.className = "tab";

        if (isActiveTab)
            tabElement.classList.add("active");

        tabElement.textContent = tab;
        tabElement.dataset.tab = tab;

        tabElement.addEventListener("click", (e) => {
            const tab = (e.target as HTMLElement).dataset.tab;
            this.activateTab(tab);
        })

        return tabElement;
    }

    activateTab(tab: string) {
        const activeTab = this.options.tabContainer.querySelector(`.tab[data-tab="${this.activeTab}"]`);
        const newTab = this.options.tabContainer.querySelector(`.tab[data-tab="${tab}"]`);

        if (!newTab)
            return;

        if (activeTab)
            activeTab.classList.remove("active");
        this.activeTab = tab;
        newTab.classList.add("active");

        if (this.options.onTabActivated) {
            this.options.onTabActivated(tab, this.options.contentContainer);
        }
    }

    setTabs(tabs: string[], activeTab?: string) {
        this.activeTab = activeTab || tabs[0] || "";
        this.render();
    }
}