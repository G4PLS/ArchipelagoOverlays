import './style.css';

const collapsibleInputListTemplate = document.createElement('template');

collapsibleInputListTemplate.innerHTML = `
<details class="collapsible-input__collapsible border-radius">
    <summary>
        <input class="collapsible-input__main border-radius" type="text">
        <button class="collapsible-input__add border-radius" type="button">+</button>
    </summary>

    <ul class="collapsible-input__list"></ul>
</details>
`

const inputListElementTempalte = document.createElement('template');
inputListElementTempalte.innerHTML = `
<li class="collapsible-input__list-element">
    <input class="border-radius" type="text">
    <button class="border-radius"><img src="/ArchipelagoOverlays/assets/images/trash.svg"></button>
</li>
`

export class CollapsibleInputList extends HTMLElement {
    private details!: HTMLDetailsElement;
    private mainInput!: HTMLInputElement;
    private addButton!: HTMLButtonElement;
    private list!: HTMLUListElement;

    constructor() {
        super();

        const clonedCollapsibleInputListTemplate = collapsibleInputListTemplate.content.cloneNode(true) as DocumentFragment;
        this.appendChild(clonedCollapsibleInputListTemplate);

        this.details = this.querySelector('details')!;
        this.mainInput = this.querySelector('.collapsible-input__main')!;
        this.addButton = this.querySelector('.collapsible-input__add')!;
        this.list = this.querySelector('.collapsible-input__list')!;

        this.addButton.addEventListener('click', () => this.addCurrentToList());

        this.mainInput.addEventListener('keypress', (e) => {
            if (e.key === "Enter")
                this.addCurrentToList();
        })

        this.mainInput.placeholder = this.getAttribute("placeholder") || ""
    }

    private addCurrentToList() {
        const currentText = this.mainInput.value;

        if (currentText === "" || currentText === null)
            return;

        this.createNewListEntry(currentText);
    }

    private createNewListEntry(text: string) {
        const listElementClone = inputListElementTempalte.content.cloneNode(true) as DocumentFragment;

        const listElement = listElementClone.querySelector('li')!;
        const input = listElement.querySelector('input')!;
        const removeButton = listElement.querySelector('button');

        input.value = text;
        this.mainInput.value = "";

        removeButton.addEventListener('click', () => {
            listElement.remove();
            this.dispatchListChange();
        });

        this.list.appendChild(listElement);
        this.dispatchListChange();
    }

    private dispatchListChange() {
        this.dispatchEvent(new CustomEvent('list-change', {
            detail: this.getCurrent(),
            bubbles: true,
            composed: true
        }));
    }

    setCurrent(values: string[]) {
        this.list.innerHTML = "";
        
        values.forEach(value => {
            if (value.trim() === "")
                return;

            this.createNewListEntry(value);
        });
    }

    getCurrent() {
        return Array.from(this.list.querySelectorAll('input'))
        .map(input => input.value.trim()).
        filter(value => value.length > 0);
    }
}

customElements.define('collapsible-input-list', CollapsibleInputList);