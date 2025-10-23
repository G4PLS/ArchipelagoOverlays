import './style.css';

const multiSelectTemplate = document.createElement('template');
multiSelectTemplate.innerHTML = `
<div class="multi-select__display"></div>
<div class="multi-select__options"></div>
`

const multiSelectOptionTemplate = document.createElement('template');
multiSelectOptionTemplate.innerHTML = `
<div class="multi-select__option"></div>
`


export interface MultiSelectItem {
  label: string;
  value?: string;
}

export class MultiSelect extends HTMLElement {
  private display!: HTMLDivElement;
  private optionsContainer!: HTMLDivElement;
  private selectedValues: Set<string> = new Set();
  private options: MultiSelectItem[] = [];

  constructor() {
    super();

    this.tabIndex = 0;

    const clonedMutliSelect = multiSelectTemplate.content.cloneNode(true) as DocumentFragment;
    this.appendChild(clonedMutliSelect);

    this.display = this.querySelector('.multi-select__display');
    this.optionsContainer = this.querySelector('.multi-select__options');

    this.display.addEventListener('click', e => {
      e.stopPropagation();
      this.optionsContainer.style.display =
        this.optionsContainer.style.display === 'flex' ? 'none' : 'flex';
    });

    document.addEventListener('click', () => {
      this.optionsContainer.style.display = 'none';
    });

    this.updateDisplayPlaceholder();
  }

  private dispatchChangeEvent() {
    this.dispatchEvent(new CustomEvent('change', {
        detail: this.getSelected(),
        bubbles: true,
        composed: true
    }));
  }

  private updateDisplayPlaceholder() {
    if (this.display.childElementCount === 0) {
        this.display.setAttribute('data-placeholder', this.getAttribute('placeholder') || 'Select...');
    } else {
        this.display.removeAttribute('data-placeholder');
    }
    }

  setOptions(options: MultiSelectItem[], selectedOptions?: string[]) {
    this.options = options;
    this.selectedValues.clear();

    this.optionsContainer.innerHTML = '';
    this.display.innerHTML = '';

    options.forEach((opt, index) => {
      if (opt.value === undefined)
        opt.value = opt.label;

      const clonedOptionElement = multiSelectOptionTemplate.content.cloneNode(true) as DocumentFragment;

      const div = clonedOptionElement.querySelector('div');
      div.textContent = opt.label;
      div.dataset.value = opt.value;
      div.dataset.index = index.toString();

      div.addEventListener('click', e => {
        e.stopPropagation();
        this.addItem(div);
      });

      this.optionsContainer.appendChild(div);

      if (selectedOptions && selectedOptions.includes(opt.value)) {
        const optionElement = this.optionsContainer.querySelector(`[data-value=${opt.value}]`) as HTMLDivElement;
        if (optionElement)
          this.addItem(optionElement);
      }
    });
    this.updateDisplayPlaceholder();
  }

  private addItem(optionEl: HTMLDivElement) {
    const value = optionEl.dataset.value!;

    if (this.selectedValues.has(value)) return;
    this.selectedValues.add(value);

    // Remove from options container
    optionEl.remove();

    // Add to display
    const displayItem = document.createElement('div');
    displayItem.textContent = optionEl.textContent;
    displayItem.dataset.value = value;
    displayItem.dataset.index = optionEl.dataset.index!;
    displayItem.className = 'multi-select__selected-item';

    displayItem.addEventListener('click', e => {
      e.stopPropagation();
      this.removeItem(displayItem);
    });

    this.display.appendChild(displayItem);
    this.updateDisplayPlaceholder();
    this.dispatchChangeEvent();
  }

  private removeItem(displayItem: HTMLDivElement) {
    const value = displayItem.dataset.value!;
    this.selectedValues.delete(value);

    displayItem.remove();

    // Recreate option and insert in correct order
    const optionEl = document.createElement('div');
    optionEl.textContent = displayItem.textContent;
    optionEl.dataset.value = value;
    optionEl.dataset.index = displayItem.dataset.index!;
    optionEl.className = 'multi-select__option';

    optionEl.addEventListener('click', e => {
      e.stopPropagation();
      this.addItem(optionEl);
    });

    const idx = parseInt(optionEl.dataset.index!);
    const children = Array.from(this.optionsContainer.children) as HTMLDivElement[];
    const insertBefore = children.find(c => parseInt(c.dataset.index!) > idx);
    if (insertBefore) {
      this.optionsContainer.insertBefore(optionEl, insertBefore);
    } else {
      this.optionsContainer.appendChild(optionEl);
    }
    this.updateDisplayPlaceholder();
    this.dispatchChangeEvent();
  }

  getSelected(): string[] {
    return Array.from(this.selectedValues);
  }
}

customElements.define('multi-select', MultiSelect);