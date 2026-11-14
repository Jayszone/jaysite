import { THEMES } from "./themes";

export const currentTheme = () => document.documentElement.dataset.theme || THEMES[0].name;

/** Applies and persists a theme, cross-fading where the browser supports View Transitions. */
export function applyTheme(name: string) {
  const run = () => {
    document.documentElement.dataset.theme = name;
    try { localStorage.setItem("theme", name); } catch { /* storage unavailable */ }
  };
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (d.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) d.startViewTransition(run);
  else run();
}

export function randomTheme() {
  const others = THEMES.filter((t) => t.name !== currentTheme());
  return others[Math.floor(Math.random() * others.length)].name;
}

export function nextTheme() {
  const i = THEMES.findIndex((t) => t.name === currentTheme());
  return THEMES[(i + 1) % THEMES.length].name;
}
