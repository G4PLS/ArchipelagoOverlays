import { DynamicHtmlComponent } from "./dynamicHtml";

export type Option = {
  text: string;
  value: string;
};

export type OptionPlaceholder = {
  text: string;
  hidden?: boolean;
};

export class Select extends DynamicHtmlComponent<HTMLSelectElement> {
  private options?: Option[];
  private initialOption?: string;
  private placeholder?: OptionPlaceholder;
  onChange?: (value: string, element: HTMLSelectElement) => void;

  constructor(
    element: HTMLSelectElement,
    options?: Option[],
    initialOption?: string,
    placeholder?: OptionPlaceholder,
    onChange?: (value: string, element: HTMLSelectElement) => void
  ) {
    super(element);

    this.options = options;
    this.initialOption = initialOption;
    this.placeholder = placeholder;
    this.onChange = onChange;

    this.initialize();
    this.bindEvents();
  }

  protected bindEvents(): void {
    this.element.addEventListener("change", () => {
      this.triggerChange();
    });
  }

  protected initialize(): void {
    this.element.innerHTML = "";

    if (this.options) {
      this.options.forEach((option) => {
        const element = this.createOptionElement(option);
        this.element.add(element);
      });
    }

    if (this.placeholder) {
      const element = this.createPlaceholderElement(this.placeholder);
      this.element.prepend(element);
    }

    if (this.initialOption) this.element.value = this.initialOption;
  }

  private triggerChange() {
    if (this.onChange) this.onChange(this.element.value, this.element);
  }

  private createOptionElement(option: Option): HTMLOptionElement {
    const element: HTMLOptionElement = document.createElement("option");

    element.value = option.value;
    element.textContent = option.text;

    return element;
  }

  private createPlaceholderElement(
    placeholder: OptionPlaceholder
  ): HTMLOptionElement {
    const element: HTMLOptionElement = document.createElement("option");

    element.value = "";
    element.disabled = true;
    element.textContent = placeholder.text;
    element.hidden = placeholder.hidden || false;

    return element;
  }

  setOptions(options: Option[], initialOption?: string) {
    this.options = options;
    this.initialOption = initialOption;

    this.initialize();
  }

  addOption(option: Option, index?: number, select?: boolean) {
    if (!this.options) this.options = [];

    const element = this.createOptionElement(option);

    if (index >= 0 && index < this.options.length) {
      this.element.add(element, index);
      this.options.splice(index, 0, option);
    } else {
      this.element.add(element);
      this.options.push(option);
    }

    if (select) {
      this.element.value = option.value;
      this.triggerChange();
    }
  }

  removeOption(value: string) {
    if (!this.options) return;

    this.options = this.options.filter((opt) => opt.value !== value);

    const element = this.element.querySelector(`option[value="${value}"]`);

    if (element) element.remove();
  }

  getValue() {
    return this.element.value;
  }
}
