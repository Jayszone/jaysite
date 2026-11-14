// Turns the static export (out/) into self-contained pages for the hosted preview.
// Usage: EXPORT=1 npm run build && node scripts/make-preview.mjs   → writes preview/
import fs from "node:fs";
import path from "node:path";

const OUT = "out", DEST = "preview";
fs.rmSync(DEST, { recursive: true, force: true });

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const pages = walk(OUT).filter((f) => f.endsWith("index.html") && !/_not-found|404/.test(f)).map((f) => path.relative(OUT, f));

// CSS: inline, minus the self-hosted @font-face rules (fonts come from Google Fonts in the preview).
const cssFile = walk(OUT + "/_next/static/chunks").find((f) => f.endsWith(".css"));
const css = fs.readFileSync(cssFile, "utf8").replace(/@font-face\s*\{[^}]*\}/g, "");
const fonts = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..700;1,400..700&family=Inter:wght@400..600&display=swap">';

const shim = `<script>(function(){var r=document.documentElement,T=['light','olive','ember'];
try{var s=localStorage.getItem('theme');if(s)r.dataset.theme=s}catch(e){}
document.querySelectorAll('.theme').forEach(function(b){b.addEventListener('click',function(){var n=T[(T.indexOf(r.dataset.theme||'light')+1)%3];r.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(e){}})});
var p=document.querySelector('.ftr .r');
if(p){var tz=p.dataset.tz,pl=p.dataset.place;var m=function(h){return h<6?'most likely asleep.':h<9?'probably making coffee.':h<18?'probably building something.':h<23?'probably reading something.':'winding down.'};
var tick=function(){try{var d=new Date(),h=+new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',hourCycle:'h23'}).format(d),t=new Intl.DateTimeFormat('en-US',{timeZone:tz,hour:'numeric',minute:'2-digit'}).format(d).toLowerCase();p.textContent=t+(pl?' in '+pl:'')+', '+m(h)}catch(e){}};tick();setInterval(tick,30000)}
document.querySelectorAll('button.copy').forEach(function(b){b.addEventListener('click',function(){var a=(b.getAttribute('aria-label')||'').replace(/^Copy email address /,'');var done=function(){var o=b.firstChild.textContent;b.firstChild.textContent='Copied';setTimeout(function(){b.firstChild.textContent=o},1600)};try{navigator.clipboard.writeText(a).then(done,function(){})}catch(e){}})});
})();</script>`;

for (const rel of pages) {
  let html = fs.readFileSync(path.join(OUT, rel), "utf8");
  const depth = rel.split("/").length - 1, up = "../".repeat(depth);
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, "Jay Naik"])[1];
  let body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, ""])[1];
  body = body.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<next-route-announcer[\s\S]*?<\/next-route-announcer>/g, "");
  // internal links → relative file paths
  body = body.replace(/href="(\/[^"]*)"/g, (m, h) => {
    if (h.startsWith("//") || h.startsWith("/_next")) return m;
    const [p, hash] = h.split("#");
    const target = p === "/" ? "index.html" : p.replace(/^\//, "").replace(/\/?$/, "/") + "index.html";
    return `href="${up}${target}${hash ? "#" + hash : ""}"`;
  });
  const inner = `<title>${title}</title>\n${fonts}\n<style>${css}</style>\n${body}\n${shim}`;
  const out = path.join(DEST, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  // The root page is wrapped by the host; every other page must be a full document.
  fs.writeFileSync(out, rel === "index.html" ? inner
    : `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${inner.replace("<body", "<body")}`.replace(`${fonts}\n<style>${css}</style>\n`, `${fonts}\n<style>${css}</style>\n</head><body>\n`) + "</body></html>");
}
console.log(pages.length + " pages →", DEST);
