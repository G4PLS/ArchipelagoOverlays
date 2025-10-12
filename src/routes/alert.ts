import '@/styles/pages/alert.css'
import { Alert, ItemAlert } from '@/components/alertItems';
import { Display } from '@/lib/display';
import {loadAnimation} from '@/lib/animation'
import { loadAlert, getAlert } from '@/lib/alertManager';
import { loadMedia } from '@/lib/media';
import { loadLanguage } from '@/lib/textParser';
import { loadFont } from '@/lib/font';
import { loadArchipelagoConfig } from '@/lib/archipelagoConnection';

const container: HTMLDivElement = document.querySelector(".alert-container")!;

loadArchipelagoConfig();
loadFont();
loadLanguage();
await loadMedia("/assets/alert/media.json");
await loadAnimation("/assets/alert/animations.json");
await loadAlert("/assets/alert/alerts.json");

const alertDisplay = new Display<Alert>(container);
alertDisplay.push(new Alert("", getAlert("load")));

let i = 0;
(window as any).test = (force: boolean = true) => {
    alertDisplay.push(new ItemAlert("ITEM", "GAPLS", i.toString(), getAlert("progression-item")), force);
    i++;
}