// Fills lib/sd/durations.json (seconds per YouTube id) from the official YouTube Data API.
// Usage: YOUTUBE_API_KEY=... node scripts/fetch-video-durations.mjs
// Without a key the page simply shows no duration badge; nothing is guessed.
import fs from "node:fs";
const key = process.env.YOUTUBE_API_KEY;
if (!key) { console.error("Set YOUTUBE_API_KEY (Google Cloud, YouTube Data API v3)."); process.exit(1); }
const src = fs.readFileSync("lib/sd/data.ts", "utf8");
const ids = [...src.matchAll(/\{ id: "([\w-]{11})", title:/g)].map((m) => m[1]);
const out = {};
for (let i = 0; i < ids.length; i += 50) {
  const batch = ids.slice(i, i + 50);
  const r = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${batch.join(",")}&key=${key}`);
  if (!r.ok) { console.error(r.status, await r.text()); process.exit(1); }
  for (const v of (await r.json()).items ?? []) {
    const m = v.contentDetails.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    out[v.id] = (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0);
  }
}
fs.writeFileSync("lib/sd/durations.json", JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${Object.keys(out).length} of ${ids.length} durations.`);
