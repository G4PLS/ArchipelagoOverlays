export type AnimationKeyframes = Record<string, Record<string, string|number>>;

export interface AnimationConfig {
    duration: number;
    timing: string;
    iterations: number;
    keyframes: AnimationKeyframes;
}

export interface AnimationData {
    name: string;
    duration: string;
    timing: string;
    iterations: string;
}