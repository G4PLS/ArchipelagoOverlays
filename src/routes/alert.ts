import '@/styles/alert.css'
import { Alert, ItemAlert } from '@/components/alertItems';
import { Display } from '@/lib/display';
import {loadAnimation} from '@/lib/animation'
import { loadAlert, getAlert } from '@/lib/alertManager';
import { loadMedia } from '@/lib/media';
import { loadLanguage } from '@/lib/textParser';

const container: HTMLDivElement = document.querySelector("#alert-container")!;


loadLanguage()
loadMedia("/alert/media.json");
loadAnimation("/alert/animations.json");
loadAlert("/alert/alerts.json");

const AlertDisplay = new Display<Alert>(container);

let i = 0;
(window as any).test = (force: boolean = true) => {
    AlertDisplay.push(new ItemAlert("ITEM", "GAPLS", i.toString(), getAlert("progression-item")), force);
    i++;
}