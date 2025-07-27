import type { AnimationConfig } from "./settings";

export function generateAnimationCss(animationConfig: AnimationConfig): string | null {

    // Build keyframes CSS string
    let keyframesCss = `@keyframes ${animationConfig.name} {`;
    for (const [percent, props] of Object.entries(animationConfig.keyframes)) {
      keyframesCss += `\n  ${percent} {`;
      for (const [prop, val] of Object.entries(props)) {
        keyframesCss += ` ${prop}: ${val};`;
      }
      keyframesCss += ` }`;
    }
    keyframesCss += `\n}`;

    // Build animation CSS shorthand property
    const animCss = `
      animation-name: ${animationConfig.name};
      animation-duration: ${animationConfig.duration}ms;
      animation-timing-function: ${animationConfig["timing-function"]};
      animation-iteration-count: ${animationConfig["iteration-count"]};
    `;

    // Return combined CSS string (keyframes + animation properties)
    return keyframesCss + "\n\n" + animCss;
}

export function applyAnimationToElement(element: HTMLElement, animationCss?: string | null) {
    if (!animationCss)
        return;

  // Separate keyframes and animation properties
  const [keyframesCss, animProperties] = animationCss.split("\n\n");

  // Create or reuse a <style> tag in document head for keyframes
  let styleTag = document.getElementById("dynamic-animation-styles") as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "dynamic-animation-styles";
    document.head.appendChild(styleTag);
  }

  // Add the keyframes CSS if not already present (naive check)
  if (!styleTag.textContent?.includes(keyframesCss)) {
    styleTag.appendChild(document.createTextNode(keyframesCss));
  }

  // Parse the animation properties and apply them to the element.style
  animProperties.trim().split("\n").forEach(line => {
    const [prop, value] = line.split(":").map(s => s.trim());
    if (prop && value) {
      // camelCase the CSS property for style property
      const jsProp = prop.replace(/-([a-z])/g, (m, p1) => p1.toUpperCase());
      (element.style as any)[jsProp] = value.replace(";", "");
    }
  });
}

export function removeAnimationFromElement(element: HTMLElement) {
  element.style.animationName = "";
  element.style.animationDuration = "";
  element.style.animationTimingFunction = "";
  element.style.animationIterationCount = "";
}