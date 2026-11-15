import themes from "@/content/themes.json";

export type Theme = { name: string; stops: string[]; fg: string; mute: number };
export const THEMES = themes as Theme[];

// ---- Heading "pop" colours -------------------------------------------------------------
// Six hues (pink, blue, yellow, green, orange, violet). For each theme, lightness is moved away
// from the background until the text reaches 4.6:1 against EVERY background stop, so a colour
// stays as vivid as possible while remaining readable (e.g. yellow is bright on dark, gold on white).
const hex2rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = (c: number[]) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const contrast = (a: number[], b: number[]) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
function hsl2rgb(h: number, s: number, l: number) {
  const k = (n: number) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
}
const toHex = (c: number[]) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
export const POP_HUES = [330, 215, 44, 150, 24, 265];
export function popColors(t: Theme): string[] {
  const bgs = t.stops.map(hex2rgb);
  const dark = bgs.reduce((m, b) => m + lum(b), 0) / bgs.length < 0.3;
  return POP_HUES.map((h) => {
    for (let step = 0; step <= 50; step++) {
      const rgb = hsl2rgb(h, 0.85, dark ? 0.5 + step * 0.01 : 0.5 - step * 0.01);
      if (Math.min(...bgs.map((b) => contrast(rgb, b))) >= 4.6) return toHex(rgb);
    }
    return t.fg;
  });
}
const popVars = (t: Theme) => popColors(t).map((c, i) => `--pop-${i + 1}:${c}`).join(";");

/** CSS custom properties for every theme. Single source: content/themes.json. */
export function themeCss() {
  const base = `:root{${popVars(THEMES[0])}}\n`;
  return base + THEMES.map((t) => {
    const img = t.stops.length > 1 ? `linear-gradient(160deg, ${t.stops.join(", ")})` : "none";
    return `:root[data-theme="${t.name}"]{--bg:${t.stops[0]};--bg-img:${img};--fg:${t.fg};--mute:color-mix(in srgb, ${t.fg} ${Math.round(t.mute * 100)}%, transparent);--line:color-mix(in srgb, ${t.fg} 24%, transparent);--panel:color-mix(in srgb, ${t.fg} 6%, transparent);${popVars(t)}}`;
  }).join("\n");
}
