import { constructAlertParams, deconstructAlertParams } from "@/lib/alert";
import { constructArchipelagoParams, deconstructArchipelagoParams } from "@/lib/archipelago/config";
import type { UrlParser } from "@/types/urlParser";

export const alertUrlParser: UrlParser = {
    currentVersion: "1.0.0",
    migrationSteps: {},
    urlDeconstructors: [
        deconstructAlertParams,
        deconstructArchipelagoParams,
    ],
    urlConstructors: [
        constructAlertParams,
        constructArchipelagoParams
    ]
}