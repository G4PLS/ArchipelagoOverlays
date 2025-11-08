type UrlPartMigration = (parser: UrlParser, params: URLSearchParams) => boolean;
type MigrationStep = UrlPartMigration[];

type UrlHandler = (params: URLSearchParams) => void;

export interface UrlParser {
    currentVersion: string;
    migrationSteps: Record<string, MigrationStep>
    urlDeconstructors: UrlHandler[];
    urlConstructors: UrlHandler[];
}