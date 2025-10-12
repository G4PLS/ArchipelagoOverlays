export type TagSelectOptions = {
    select: HTMLSelectElement;
    tagContainer: HTMLElement;
    tags?: string[];
    selectedTags?: string[];
    onChange?: (tags: string[]) => void;
}

export class TagSelect {
    private options: TagSelectOptions;
    private currentTags: string[] = [];

    constructor(options: TagSelectOptions) {
        this.options = options;

        this.setTags(options.tags, options.selectedTags);
        this.bindEvents();
    }

    private bindEvents() {
        const select = this.options.select;
        select.addEventListener("change", () => {
            const value = select.value;

            if(value)
                this.addTag(value);

            select.selectedIndex = 0;
        })
    }

    private createTagElement(tag: string) {
        const tagElement = document.createElement("span");

        tagElement.className = "tag";
        tagElement.textContent = tag;
        tagElement.dataset.tag = tag;

        tagElement.addEventListener("click", (e) => {
            const tag = (e.target as HTMLElement).dataset.tag;
            this.removeTag(tag);
        });

        return tagElement;
    }

    private createOptionsElement(tag: string) {
        const optionsElement = document.createElement("option");

        optionsElement.dataset.tag = tag;
        optionsElement.value = tag;
        optionsElement.textContent = tag;

        return optionsElement;
    }

    private createPlaceHolderSelect() {
        const optionsElement = document.createElement("option");

        optionsElement.textContent = "Select a tag";
        optionsElement.disabled = true;
        optionsElement.selected = true;

        return optionsElement;
    }

    removeTag(tag: string) {
        const index = this.currentTags.indexOf(tag);
        if (index === -1)
            return;

        const tagElement = this.options.tagContainer.querySelector(`.tag[data-tag=${tag}]`);
        if (tagElement)
            tagElement.remove();

        const optionsElement = this.createOptionsElement(tag);
        this.options.select.appendChild(optionsElement);

        this.currentTags.splice(index, 1);
        this.triggerChange();
    }

    addTag(tag: string) {
        if (this.currentTags.includes(tag))
            return;

        const tagElement = this.createTagElement(tag);
        this.options.tagContainer.appendChild(tagElement);

        const optionElement = this.options.select.querySelector(`option[data-tag="${tag}"]`);
        
        if (optionElement)
            optionElement.remove();

        this.currentTags.push(tag);
        this.triggerChange();
    }

    private triggerChange() {
        if (this.options.onChange)
            this.options.onChange(this.currentTags);
    }

    setTags(tags: string[], selectedTags?: string[]) {
        this.currentTags = [];
        this.options.tagContainer.innerHTML = "";
        this.options.select.innerHTML = "";

        if (!tags)
            return;

        this.options.select.appendChild(this.createPlaceHolderSelect());

        tags.forEach(tag => {
            if (selectedTags.includes(tag)) {
                const tagElement = this.createTagElement(tag);
                this.options.tagContainer.appendChild(tagElement);
                this.currentTags.push(tag);
            } else {
                const optionsElement = this.createOptionsElement(tag);
                this.options.select.appendChild(optionsElement);
            }
        })

        this.triggerChange();
    }
}