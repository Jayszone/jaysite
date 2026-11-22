// Fills lib/sd/durations.json (seconds per video) and lib/sd/channels.json (channel name -> real
// profile picture URL on YouTube's image host) from the official YouTube Data API v3.
// Usage: YOUTUBE_API_KEY=... node scripts/fetch-video-durations.mjs
// Without a key the page shows monogram avatars and no duration badge; nothing is guessed.
import fs from "node:fs";
const key = process.env.YOUTUBE_API_KEY;
if (!key) { console.error("Set YOUTUBE_API_KEY (Google Cloud, YouTube Data API v3)."); process.exit(1); }
const api = async (path) => { const r = await fetch(`https://www.googleapis.com/youtube/v3/${path}&key=${key}`); if (!r.ok) { console.error(r.status, await r.text()); process.exit(1); } return r.json(); };
const src = fs.readFileSync("lib/sd/data.ts", "utf8");
const rows = [...src.matchAll(/\{ id: "([\w-]{11})", title: .*?channel: ("(?:[^"\\]|\\.)*")/g)].map((m) => ({ id: m[1], channel: JSON.parse(m[2]) }));
const durations = {}, chanOf = {}, chanName = {};
for (let i = 0; i < rows.length; i += 50) {
  const batch = rows.slice(i, i + 50);
  for (const v of (await api(`videos?part=contentDetails,snippet&id=${batch.map((b) => b.id).join(",")}`)).items ?? []) {
    const m = v.contentDetails.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    durations[v.id] = (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0);
    chanOf[v.snippet.channelId] = true; chanName[v.id] = v.snippet.channelId;
  }
}
const avatars = {};
const ids = Object.keys(chanOf);
for (let i = 0; i < ids.length; i += 50) {
  for (const c of (await api(`channels?part=snippet&id=${ids.slice(i, i + 50).join(",")}`)).items ?? []) avatars[c.id] = (c.snippet.thumbnails.medium ?? c.snippet.thumbnails.default).url;
}
// Key by the channel name shown on the cards (oEmbed's author_name), via the videos that use it.
const byName = {};
for (const r of rows) if (chanName[r.id] && avatars[chanName[r.id]]) byName[r.channel] = avatars[chanName[r.id]];
fs.writeFileSync("lib/sd/durations.json", JSON.stringify(durations, null, 2) + "\n");
fs.writeFileSync("lib/sd/channels.json", JSON.stringify(byName, null, 2) + "\n");
console.log(`Wrote ${Object.keys(durations).length}/${rows.length} durations and ${Object.keys(byName).length} channel pictures.`);
