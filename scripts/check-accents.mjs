// Checks diagram text stays readable on each project's tinted boxes in every theme.
// Run: node scripts/check-accents.mjs
import fs from "node:fs";
const themes = JSON.parse(fs.readFileSync("content/themes.json", "utf8"));
const accents = Object.fromEntries(fs.readdirSync("content/projects").map((f) => {
  const t = fs.readFileSync("content/projects/" + f, "utf8"); const m = t.match(/^accent:\s*"?(#[0-9a-fA-F]{6})"?/m);
  return [f.replace(/\.mdx$/, ""), m && m[1]];
}).filter(([, a]) => a));
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const mix = (a, b, t) => a.map((c, i) => c * t + b[i] * (1 - t));
const TONE2 = Number(process.argv[2] ?? 0.38);
let bad = 0;
for (const [name, acc] of Object.entries(accents)) {
  let worst = 99, who = "";
  for (const t of themes) for (const s of t.stops) {
    const bg = rgb(s), fg = rgb(t.fg), fill = mix(rgb(acc), bg, TONE2), txt = mix(fg, fill, Number(process.argv[3] ?? 1));
    const r = ratio(txt, fill); if (r < worst) { worst = r; who = t.name; }
  }
  const ok = worst >= 4.5; if (!ok) bad++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name.padEnd(24)} ${acc}  worst ${worst.toFixed(1)}:1 (${who}) at ${TONE2 * 100}% tint`);
}
process.exit(bad ? 1 : 0);
