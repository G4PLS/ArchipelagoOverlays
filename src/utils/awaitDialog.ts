export async function awaitDialog(dialog: HTMLDialogElement): Promise<string> {
  return new Promise((resolve) => {
    const handler = () => {
      dialog.removeEventListener("close", handler);
      resolve(dialog.returnValue);
    };
    dialog.addEventListener("close", handler);
    dialog.showModal();
  });
}