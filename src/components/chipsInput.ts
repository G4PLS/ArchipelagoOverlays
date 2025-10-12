export type ChipsInputOptions = {
    input: HTMLInputElement;
    container: HTMLElement;
    chips?: string[];
    allowDuplicates?: boolean;
    onChange?: (chips: string[]) => void;
}

export class ChipsInput {
    private options: ChipsInputOptions;
    private currentChips: string[] = [];

    constructor(options: ChipsInputOptions) {
        this.options = options;
        this.setChips(options.chips);
        this.bindEvents();
    }

    private bindEvents() {
        const input = this.options.input;
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && input.value.trim() !== "") {
                e.preventDefault();
                this.addChip(input.value.trim());
                input.value = "";
            }
        });
    }

    private createChipElement(chip: string, index: number): HTMLSpanElement {
        const chipElement = document.createElement("span");

        chipElement.className = "chip";
        chipElement.textContent = chip;
        chipElement.dataset.index = index.toString();

        chipElement.addEventListener("click", (e) => {
            const i = Number((e.target as HTMLElement).dataset.index);
            this.removeChip(i);
        })

        return chipElement;
    }

    private triggerChange() {
        if (this.options.onChange)
            this.options.onChange(this.currentChips);
    }

    addChip(chip: string) {
        if (!this.options.allowDuplicates && this.currentChips.includes(chip))
            return;

        this.currentChips.push(chip);

        const chipElement = this.createChipElement(chip, this.currentChips.length - 1);
        this.options.container.appendChild(chipElement);

        this.triggerChange();
    }

    removeChip(index: number) {
        if (index < 0 || index >= this.currentChips.length)
            return;

        this.currentChips.splice(index, 1);

        const container = this.options.container;
        const chipElement = container.querySelector(`.chip[data-index="${index}"]`) as HTMLElement;

        if (chipElement)
            container.removeChild(chipElement);

        Array.from(container.children).forEach((child, i) => {
            (child as HTMLElement).dataset.index = i.toString();
        })

        this.triggerChange();
    }

    clear() {
        this.currentChips = [];
        this.options.container.innerHTML = "";
        this.triggerChange();
    }

    setChips(chips: string[]) {
        this.currentChips = [];
        this.options.container.innerHTML = "";

        for (const chip of chips)
            this.addChip(chip);
    }
}