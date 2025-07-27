import { Client } from "archipelago.js";

export const client = new Client();

interface AP_Settings {
  url: string;
  name: string;
  password?: string;
}

let onConnectedCallback: () => void = () => {};

client.socket.on("connected", () => {
  onConnectedCallback();
});

export function onConnected(fn: () => void) {
  onConnectedCallback = fn;
}

window.addEventListener("load", async () => {
  console.log("Getting URL parameters");

  const urlParams = new URLSearchParams(window.location.search);

  const url = urlParams.get("url");
  const name = urlParams.get("name");
  const password = urlParams.get("password") ?? undefined;

  if (!url || !name) {
    console.warn("Missing required URL parameters: url, port, or name");
    return;
  }

  console.log("Attempting to connect to Archipelago");

  await setupArchipelagoClient({ url, name, password });
});

async function setupArchipelagoClient(settings: AP_Settings) {
  try {
    console.log("Logging in...");

    // TODO: Use password in login once supported
    await client.login(settings.url, settings.name, undefined);

    console.log("Successfully logged in");
  } catch (error) {
    console.error("Login failed:", error);
  }
}