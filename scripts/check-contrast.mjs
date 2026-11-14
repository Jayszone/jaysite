// Verifies body text (fg) and muted text (fg at `mute` alpha) reach WCAG AA (4.5:1)
// against EVERY background stop of every theme. Run: node scripts/check-contrast.mjs
import fs from "node:fs";
const themes = JSON.parse(fs.readFileSync("content/themes.json", "utf8"));
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
let bad = 0;
for (const t of themes) {
  const fg = rgb(t.fg);
  let worstFg = 99, worstMute = 99;
  for (const s of t.stops) {
    const bg = rgb(s);
    const mute = fg.map((c, i) => c * t.mute + bg[i] * (1 - t.mute));
    worstFg = Math.min(worstFg, ratio(fg, bg)); worstMute = Math.min(worstMute, ratio(mute, bg));
  }
  const ok = worstFg >= 4.5 && worstMute >= 4.5; if (!ok) bad++;
  console.log(`${ok ? "ok  " : "FAIL"} ${t.name.padEnd(9)} text ${worstFg.toFixed(1)}:1  muted ${worstMute.toFixed(1)}:1`);
}
process.exit(bad ? 1 : 0);
