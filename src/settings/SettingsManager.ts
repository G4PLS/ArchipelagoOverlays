export type JsonConfig = {}

export interface Entry {}

export abstract class SettingsManager<TEntry extends Entry, TConfig extends JsonConfig> {
    protected configs: Map<string, TEntry> = new Map();
    protected overrides: Map<string, TEntry> = new Map();

    protected constructor() {}

    public load(config: TConfig) {
        this.createConfigs(config);
        this.deconstructURL(new URL(window.location.href));
    }

    public getConfig(key: string): TEntry {
        return this.configs.get(key);
    }

    public getConfigs(): TEntry[] {
        return Array.from(this.configs.values());
    }

    public getOverride(key: string): TEntry {
        return this.overrides.get(key);
    }

    public getOverrides(): TEntry[] {
        return Array.from(this.overrides.values());
    }

    protected abstract createConfigs(config: TConfig): void;

    public abstract deconstructURL(url: URL): void;
    public abstract constructSearchParams(): URLSearchParams;
}