import { Priority, Queue } from "@/utils/queue";

export abstract class DisplayItem {
    protected timeout: number;

    abstract display(container: HTMLElement): Promise<void>;

    cancel() {
        clearTimeout(this.timeout)
    }
}

export class Display<T extends DisplayItem> {
    private queue: Queue<T> = new Queue<T>();
    private displayContainer: HTMLElement;
    private isAnimating: boolean = false;
    private currentAnimatingItem: T|null = null;

    constructor(displayContainer: HTMLElement) {
        this.displayContainer = displayContainer;

        this.queue.addEventListener("element-pushed", async () => {
            await this.processQueue();
        });
    }

    push(item: T, skipQueue?: boolean) {
        const priority = skipQueue ? Priority.CRITICAL : Priority.LOW;

        this.queue.push(item, priority);
    }

    async processQueue() {
        if (this.isAnimating)
            return;

        this.isAnimating = true;
        this.displayContainer.style.display = "";

        await this.displayItem();

        this.isAnimating = false;
    }

    async displayItem() {
        while (!this.queue.isEmpty()) {
            const item = this.queue.pop();

            if (!item)
                continue;

            this.currentAnimatingItem = item;

            this.displayContainer.style.visibility = "";
            await item.display(this.displayContainer);
            this.displayContainer.style.visibility = "hidden";
        }
    }

    async cancel() {
        if (!this.currentAnimatingItem)
            return;

        this.currentAnimatingItem.cancel();
        this.currentAnimatingItem = null;
        this.displayContainer.style.visibility = "hidden";

        this.displayItem();
    }

    lockQueue() {
        this.queue.lock();
    }

    unlockQueue() {
        this.queue.unlock();
    }
}