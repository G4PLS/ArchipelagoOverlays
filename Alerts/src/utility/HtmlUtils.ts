export function createTabGroup<T>(containerId: string, contentId: string, items: T[], getName: (item: T) => string, createSettings: (container: HTMLElement, item: T) => void
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

export function addInput(container: HTMLElement, id: string, labelText: string, type: string, value: string, change_callback = (_value: any) => {}, attributes: Record<string, string> = {}) {
    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = id;

    const input = document.createElement("input");
    input.type = type;
    input.value = value;
    input.id = id;
    Object.entries(attributes).forEach(([k, v]) => input.setAttribute(k, v));

    input.addEventListener("change", () => {
        change_callback(input.value);
    });

    container.appendChild(label);
    container.appendChild(input);
}

export function addSelect(container: HTMLElement, id: string, labelText: string, options: string[], selected: string, change_callback = (_value: any) => {}) {
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

    select.addEventListener("change", () => {
        change_callback(select.value);
    });

    container.appendChild(label);
    container.appendChild(select);
}

export function addTagSelector(container: HTMLElement, id: string, labelText: string, allItems: string[], initialSelected: string[] = [], change_callback = (_value: string[]) => {}) {
    // Label
    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = id;

    // Tag container
    const tagContainer = document.createElement("div");
    tagContainer.className = "tag-list";
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
            change_callback(getAllTags());
        });

        tagContainer.appendChild(tag);
    }

    function getAllTags(): string[] {
        return Array.from(tagContainer.querySelectorAll(".tag")).map(tag => tag.textContent || "");
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
        change_callback(getAllTags());
    });

    const mainContainer = document.createElement("div");
    mainContainer.classList.add("tag-container");

    mainContainer.appendChild(tagContainer);
    mainContainer.appendChild(select);

    // Append everything
    container.appendChild(label);
    container.appendChild(mainContainer);
}

function addTagInput() {

}