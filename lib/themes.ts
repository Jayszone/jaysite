import themes from "@/content/themes.json";

export type Theme = { name: string; stops: string[]; fg: string; mute: number };
export const THEMES = themes as Theme[];

/** CSS custom properties for every theme. Single source: content/themes.json. */
export function themeCss() {
  return THEMES.map((t) => {
    const img = t.stops.length > 1 ? `linear-gradient(160deg, ${t.stops.join(", ")})` : "none";
    return `:root[data-theme="${t.name}"]{--bg:${t.stops[0]};--bg-img:${img};--fg:${t.fg};--mute:color-mix(in srgb, ${t.fg} ${Math.round(t.mute * 100)}%, transparent);--line:color-mix(in srgb, ${t.fg} 24%, transparent);--panel:color-mix(in srgb, ${t.fg} 6%, transparent)}`;
  }).join("\n");
}
