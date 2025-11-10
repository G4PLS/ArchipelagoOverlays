export enum Priority {
    LOW,
    CRITICAL,
}

type PriorityMap<T> = Record<Priority, T[]>;

export class Queue<T> extends EventTarget {
    private data: PriorityMap<T> = {
        [Priority.LOW]: [],
        [Priority.CRITICAL]: [],
    };

    private locked: boolean = false;

    public push(element: T, priority: Priority) {
        this.data[priority].push(element);
        this.dispatchEvent(new Event("element-pushed"));
    }

    pop() {
        if (this.data[Priority.CRITICAL].length > 0)
            return this.data[Priority.CRITICAL].shift()!;
        else if (!this.locked) {
            return this.data[Priority.LOW].shift()!;
        }

        return null;
    }

    lock() {
        this.locked = true;
    }

    unlock() {
        this.locked = false;
    }

    isEmpty() {
        return Object.values(this.data).every(arr => arr.length === 0);
    }

    clear() {
        this.data = {
            [Priority.LOW]: [],
            [Priority.CRITICAL]: [],
        };
    }
}