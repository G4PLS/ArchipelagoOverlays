type AnimationKeyframes = Record<string, Record<string, string | number>>;

export interface AnimationConfig {
  name: string;
  duration: number; // in ms
  "timing-function": string;
  "iteration-count": number | "infinite";
  keyframes: AnimationKeyframes;
}

export interface AlertConfig {
  color: number[];
  audioSources: string[];
  imageSources: string[];
  animation: string;
  timeout: number;
}

export class SettingsManager {
  public config: any;

  constructor(initialConfig: any) {
    this.config = initialConfig
  }

  static async getLocalConfig(path: string) {
    try {
      const response = await fetch(path)

      if (!response.ok)
        return null;

      const fileContent = await response.text();
      const parsedConfig = JSON.parse(fileContent)
      return parsedConfig
    }
    catch (error) {
      console.error(error)
      return null;
    }
  }

  static async loadFromLocalConfig(path: string) {
    const config = await this.getLocalConfig(path);
    return new SettingsManager(config);
  }

  getAlertSettings(type: string, variant?: string): AlertConfig {
    let config = variant ? this.config?.alerts?.[type]?.[variant] : null;

    if (!config) {
      config = this.config?.alerts?.[type] ?? null;
    }

    return {
      color: config?.color ?? [255,255,255],
      audioSources: config?.["audio-sources"] ?? [],
      imageSources: config?.["image-sources"] ?? [],
      animation: config?.animation ?? "",
      timeout: config?.timeout ?? 2000,
    };
  }

  getAnimationRaw(animationName: string): AnimationConfig | null {
    const config = this.config?.animations?.[animationName] || null
    if (!config)
      return null

    return {
      name: animationName,
      duration: config?.duration ?? 2000,
      "timing-function": config?.["timing-function"] ?? null,
      "iteration-count": config?.["iteration-count"] ?? 1,
      keyframes: config?.keyframes ?? {}
    }
  }
}