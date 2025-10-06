import { Priority, Queue } from "../Queue";

export class DisplayManager<T extends DisplayManagerItem> {
    queue: Queue<T> = new Queue<T>();
    displayContainer: HTMLElement;
    isAnimating: boolean = false;
    private currentAnimatingItem: T;

    constructor(displayContainer: HTMLElement) {
        this.displayContainer = displayContainer;

        this.queue.addEventListener("element-pushed", async () => {
            await this.processQueue();
        });
    }

    push(item: T, skipQueue?: boolean) {
        if (skipQueue)
            this.isAnimating = false;

        const priority = skipQueue ? Priority.CRITICAL : Priority.LOW;

        this.queue.push(item, priority);
    }

    async processQueue() {
        if (this.isAnimating)
            return;

        this.isAnimating = true;
        this.displayContainer.style.display = "";

        const item: T = this.queue.pop();

        if (item) {
            this.currentAnimatingItem = item;
            await item.display(this.displayContainer);
            this.isAnimating = false;
            this.displayContainer.style.display = "none";
            this.processQueue();
        }

        this.displayContainer.style.display = "none";
        this.isAnimating = false;
    }

    cancel() {
        if (!this.currentAnimatingItem)
            return;

        this.currentAnimatingItem.cancel();
        this.isAnimating = false;
        this.displayContainer.style.display = "none";
    }

    lockQueue() {
        this.queue.lock();
    }

    unlockQueue() {
        this.queue.unlock();
    }
}

export abstract class DisplayManagerItem {
    protected timeout: number;

    abstract display(displayContainer: HTMLElement): Promise<void>;

    cancel() {
        clearTimeout(this.timeout);
    }
}