import { Priority, Queue } from "@/utils/queue";

export type ToastType = "error" | "success";

export interface Toast {
    toastType: ToastType;
    message: string;
}

const toastTemplate: HTMLTemplateElement = document.createElement("template");
toastTemplate.innerHTML = `
<div class="toast">
    <p class="toast__message"></p>
</div>
`

export class ToastManager {
    private queue: Queue<Toast> = new Queue<Toast>();
    private toastPlaying: boolean = false;
    private toastContainer: HTMLElement;

    constructor() {
        this.queue.addEventListener('element-pushed', async () => {
            await this.processQueue();
        });

        this.toastContainer = document.querySelector("#toast-container");

        if (!this.toastContainer) {
            this.toastContainer = document.createElement("div");
            this.toastContainer.id = "toast-container";
            document.body.appendChild(this.toastContainer);
        }
    }

    push(toast: Toast, skipQueue?: boolean) {
        const priority = skipQueue ? Priority.CRITICAL : Priority.LOW;
        this.queue.push(toast, priority);
    }

    async processQueue() {
        if(this.toastPlaying)
            return;

        this.toastPlaying = true;

        await this.displayToast();

        this.toastPlaying = false;
    }

    async displayToast() {
        while (!this.queue.isEmpty()) {
            const toast = this.queue.pop();

            if (!toast)
                continue;

            const toastElement: HTMLDivElement = this.createToast(toast);

            await new Promise<void>(resolve => {
                this.toastContainer.appendChild(toastElement);

                toastElement.addEventListener("animationend", () => {
                    toastElement.remove();
                    toastElement.classList.add(toast.toastType);
                    resolve();
                }, {once: true});
            });
        }
    }

    createToast(toast: Toast) {
        const clonedToast = toastTemplate.content.cloneNode(true) as DocumentFragment;

        const toastElement: HTMLDivElement = clonedToast.querySelector(".toast")
        const messageElement = clonedToast.querySelector(".toast__message");

        toastElement.classList.add(toast.toastType);
        messageElement.textContent = toast.message;

        return toastElement;
    }
}