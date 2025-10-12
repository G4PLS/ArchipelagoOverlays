export abstract class DynamicHtmlComponent<T> {
    protected element: T;

    constructor(element: T) {
        this.element = element;
    }

    protected abstract bindEvents(): void;
    protected abstract initialize(): void;
}