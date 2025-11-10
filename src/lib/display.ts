import { Priority, Queue } from "@/utils/queue";

export abstract class DisplayItem {
    protected timeout: number;

    abstract display(container: HTMLElement): Promise<void>;

    cancel() {
        clearTimeout(this.timeout);
    }
}

export class Display<T extends DisplayItem> {
    private queue: Queue<T> = new Queue<T>();
    private displayContainer: HTMLElement;
    private activeItems: Set<T> = new Set();
    private maxConcurrent: number;

    constructor(displayContainer: HTMLElement, maxConcurrent: number = 1) {
        this.displayContainer = displayContainer;
        this.maxConcurrent = maxConcurrent;

        this.queue.addEventListener("element-pushed", () => {
            this.processQueue();
        });
    }

    push(item: T, skipQueue?: boolean) {
        const priority = skipQueue ? Priority.CRITICAL : Priority.LOW;
        this.queue.push(item, priority);
    }

    private async processQueue() {
        while (!this.queue.isEmpty() && this.activeItems.size < this.maxConcurrent) {
            const item = this.queue.pop();
            if (!item) continue;

            this.activeItems.add(item);

            item.display(this.displayContainer).then(() => {
                this.activeItems.delete(item);
                this.processQueue();
            }).catch(() => {
                this.activeItems.delete(item);
                this.processQueue();
            });
        }
    }

    cancelAll() {
        for (const item of this.activeItems) {
            item.cancel();
        }
        this.activeItems.clear();
    }

    clearAll() {
        this.queue.clear();
        this.cancelAll();
    }

    lockQueue() {
        this.queue.lock();
    }

    unlockQueue() {
        this.queue.unlock();
        this.processQueue(); // resume processing
    }
}
