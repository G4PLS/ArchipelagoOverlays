export function injectStyle(id: string, css: string) {
    let styleElement = document.querySelector(`#${id}`) as HTMLStyleElement | null;

    if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = id;
        document.head.appendChild(styleElement);
    }

    styleElement.innerHTML = css;
}

export function removeStyle(id: string) {
    const styleElement = document.querySelector(`#${id}`) as HTMLStyleElement;

    if (!styleElement)
        return;

    styleElement.remove();
}

export function applyStyles(element: HTMLElement, styles: Record<string, string>) {
    Object.entries(styles).forEach(([prop, value]) => {
        element.style.setProperty(prop, value);
    });

    element.offsetWidth;
}

export function removeStyles(element: HTMLElement, props: string[]) {
    props.forEach(prop => {
        element.style.removeProperty(prop);
    })

    element.offsetWidth;
}