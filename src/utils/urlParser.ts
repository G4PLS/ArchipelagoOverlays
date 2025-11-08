import type { MigrationDialogResult } from "@/types/migrationDialogResult";
import type { UrlParser } from "@/types/urlParser";
import { gt, lte, SemVer } from "semver";

export async function tryUrlMigration(urlParser: UrlParser, params?: URLSearchParams, showMigrationDialog?: (urlVersion: string, parserVersion: string) => Promise<MigrationDialogResult>): Promise<boolean> {
    const searchParams = params ?? new URL(window.location.origin).searchParams;

    const urlVersion = new SemVer(searchParams.get("v") ?? "1.0.0");
    const parserVersion = new SemVer(urlParser.currentVersion);

    if (lte(parserVersion, urlVersion))
        return true;

    if (showMigrationDialog) {
        const result = await showMigrationDialog(urlVersion.version, parserVersion.version);
        
        if (result === "denied")
            return false;
    }

    const migrationSteps = urlParser.migrationSteps;
    const sortedMigrationSteps = Object.keys(migrationSteps)
        .map(v => new SemVer(v))
        .sort((a, b) => a.compare(b))
        .filter(stepVersion => gt(stepVersion, urlVersion) && !gt(stepVersion, parserVersion));

    for (const migrationStepVersion of sortedMigrationSteps) {
        const currentMigrationSteps = migrationSteps[migrationStepVersion.version];

        for (const migrationFunction of currentMigrationSteps) {
            if (!migrationFunction(urlParser, searchParams))
                return false;
        }

        searchParams.set("v", migrationStepVersion.version);
    }

    searchParams.set("v", urlParser.currentVersion);

    return true;
}

export function deconstructUrl(urlParser: UrlParser, params?: URLSearchParams) {
    const searchParams = params ?? new URL(window.location.href).searchParams;
    
    for (const urlDeconstructor of urlParser.urlDeconstructors)
        urlDeconstructor(searchParams);
}

export function constructUrl(urlParser: UrlParser, params?: URLSearchParams) {
    const searchParams = params ?? new URL(window.location.origin).searchParams;

    searchParams.set("v", urlParser.currentVersion);

    for (const urlConstructor of urlParser.urlConstructors)
        urlConstructor(searchParams);
}