export type AnimationKeyframeConfig = Record<string, Record<string, Record<string, string|number>>>;

export interface AnimationConfig {
    duration: number;
    iterations: number;
    timing: string;
}