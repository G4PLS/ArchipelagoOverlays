import { DisplayItem } from "../display";

const toastTemplate: HTMLTemplateElement = document.createElement("template");
toastTemplate.innerHTML = `
<div class="toast">
    <h2 class="toast__title"></h2>
</div>
`

export class Toast extends DisplayItem {
    private title: string;
    protected readonly TYPE: string;
    private resolve: () => void;

    constructor(title: string) {
        super();

        this.title = title;
    }

    cancel(): void {
        if (this.resolve)
            this.resolve();
    }

    async display(displayContainer: HTMLElement) {
        await new Promise<void>(resolve => {
            const clonedToast = toastTemplate.content.cloneNode(true) as DocumentFragment;

            const toastElement: HTMLDivElement = clonedToast.querySelector(".toast")
            const titleElement: HTMLHeadingElement = clonedToast.querySelector(".toast__title");

            toastElement.classList.add(this.TYPE);
            titleElement.textContent = this.title;

            toastElement.addEventListener("animationend", () => {
                this.resolve = null;
                toastElement.remove();
                resolve();
            }, {once: true});

            toastElement.addEventListener("click", () => {
                toastElement.remove();
                resolve();
            })

            displayContainer.appendChild(toastElement);
            this.resolve = resolve;
        });
    }
}