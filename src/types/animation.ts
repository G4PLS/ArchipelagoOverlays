export type AnimationConfig = Record<string, Record<string, string|number>>;

export interface AnimationData {
    name: string;
    duration: string;
    timing: string;
    iterations: string;
}