import { DynamicHtmlComponent } from "./dynamicHtml";

export class Input extends DynamicHtmlComponent<HTMLInputElement> {
    private initialValue?: string;
    private placeholder?: string;
    private onChange?: (value: string, element: HTMLInputElement) => void;

    constructor(element: HTMLInputElement, initialValue?: string, placeholder?: string, onChange?: (value: string, element: HTMLInputElement) => void) {
        super(element);

        this.initialValue = initialValue ?? "";
        this.placeholder = placeholder ?? "";
        this.onChange = onChange;

        this.initialize();
        this.bindEvents();
    }

    protected bindEvents() {
        this.element.addEventListener("input", () => {
            this.triggerChange();
        })
    }

    protected initialize() {
        this.element.value = this.initialValue;
        this.element.placeholder = this.placeholder;
    }

    private triggerChange() {
        if (this.onChange)
            this.onChange(this.element.value, this.element);
    }

    setValue(value: string) {
        this.element.value = value ?? "";
    }

    setPlaceholder(placeholder: string) {
        this.placeholder = placeholder ?? "";
        this.element.placeholder = placeholder ?? "";
    }

    setOnChange(onChange: (value: string, element: HTMLInputElement) => void) {
        this.onChange = onChange;
    }

    getValue() {
        return this.element.value;
    }
}