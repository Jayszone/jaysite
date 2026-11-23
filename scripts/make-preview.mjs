// Turns the static export (out/) into self-contained pages for the hosted preview.
// Usage: EXPORT=1 npm run build && node scripts/make-preview.mjs   → writes preview/
import fs from "node:fs";
import path from "node:path";

const OUT = "out", DEST = "preview";
fs.rmSync(DEST, { recursive: true, force: true });

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const pages = walk(OUT).filter((f) => f.endsWith("index.html") && !/_not-found|404/.test(f)).map((f) => path.relative(OUT, f));

// CSS: inline, minus the self-hosted @font-face rules (fonts come from Google Fonts in the preview).
const cssFiles = walk(OUT + "/_next/static/chunks").filter((f) => f.endsWith(".css"));
const css = cssFiles.map((f) => fs.readFileSync(f, "utf8")).join("\n").replace(/@font-face\s*\{[^}]*\}/g, "");
const THEMES = JSON.parse(fs.readFileSync("content/themes.json", "utf8")).map((t) => t.name);
const fonts = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..700;1,400..700&family=Inter:wght@400..600&family=Patrick+Hand&display=swap">';

const shim = `<script>(function(){var r=document.documentElement,T=${JSON.stringify(THEMES)};
function apply(n){var run=function(){r.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(e){}};
if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.startViewTransition(run);else run()}
try{var s=localStorage.getItem('theme');if(s)r.dataset.theme=s}catch(e){}
var cur=function(){return r.dataset.theme||T[0]};
document.querySelectorAll('.theme').forEach(function(b){b.addEventListener('click',function(){apply(T[(T.indexOf(cur())+1)%T.length])})});
var IGN='a,button,input,textarea,select,summary,details,label,dialog,p,h1,h2,h3,h4,li,dd,dt,figure,pre,code,table,blockquote,time,img,svg';
document.addEventListener('click',function(e){var t=e.target;if(!t||!t.closest||e.defaultPrevented||e.button!==0||t.closest(IGN))return;if(String(getSelection()).length)return;
var o=T.filter(function(x){return x!==cur()});apply(o[Math.floor(Math.random()*o.length)])});
var p=document.querySelector('.ftr .r');
if(p){var tz=p.dataset.tz,pl=p.dataset.place;var m=function(h){return h<6?'most likely asleep.':h<9?'probably making coffee.':h<18?'probably building something.':h<23?'probably reading something.':'winding down.'};
var tick=function(){try{var d=new Date(),h=+new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',hourCycle:'h23'}).format(d),t=new Intl.DateTimeFormat('en-US',{timeZone:tz,hour:'numeric',minute:'2-digit'}).format(d).toLowerCase();p.textContent=t+(pl?' in '+pl:'')+', '+m(h)}catch(e){}};tick();setInterval(tick,30000)}
document.querySelectorAll('button.copy').forEach(function(b){b.addEventListener('click',function(){var a=(b.getAttribute('aria-label')||'').replace(/^Copy email address /,'');var done=function(){var o=b.firstChild.textContent;b.firstChild.textContent='Copied';setTimeout(function(){b.firstChild.textContent=o},1600)};try{navigator.clipboard.writeText(a).then(done,function(){})}catch(e){}})});
})();</script>`;

for (const rel of pages) {
  let html = fs.readFileSync(path.join(OUT, rel), "utf8");
  const depth = rel.split("/").length - 1, up = "../".repeat(depth);
  const headCss = [...(html.match(/<head>[\s\S]*?<\/head>/) || [""])[0].matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");
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
  body = body.replace(/src="(\/[^"\/][^"]*)"/g, (m, h) => h.startsWith("/_next") ? m : `src="${up}${h.slice(1)}"`);
  const staticNote = /class="rl-wrap"/.test(body)
    ? '<p style="font:14px/1.5 Inter,system-ui,sans-serif;background:#fff3cd;color:#3b2f00;margin:0;padding:.7rem 1rem;text-align:center">Static preview: the Before/After and review-loop visuals are interactive on the live site and locally (<b>npm run dev</b>).</p>'
    : /class="sd"/.test(body)
    ? '<p style="font:14px/1.5 Inter,system-ui,sans-serif;background:#fff3cd;color:#3b2f00;margin:0;padding:.7rem 1rem;text-align:center">Static preview: the interactive prototype and sliders need the live site. Run it locally with <b>git pull</b> and <b>npm run dev</b>, then open /work/shared-discovery.</p>' : "";
  const previewCss = /class="sd"/.test(body) ? ".sd-hero{--p:1 !important;height:auto}.sd-hero-stick{position:static !important;height:auto !important;padding-block:2rem}" : "";
  const inner = `<title>${title}</title>\n${fonts}\n<style>${css}\n${headCss}\n${previewCss}</style>\n${staticNote}${body}\n${shim}`;
  const out = path.join(DEST, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  // The root page is wrapped by the host; every other page must be a full document.
  fs.writeFileSync(out, rel === "index.html" ? inner
    : `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${inner.replace("<body", "<body")}`.replace(`${fonts}\n<style>${css}\n${headCss}</style>\n`, `${fonts}\n<style>${css}\n${headCss}</style>\n</head><body>\n`) + "</body></html>");
}
for (const f of fs.existsSync("public") ? fs.readdirSync("public") : []) fs.copyFileSync(path.join("public", f), path.join(DEST, f));
console.log(pages.length + " pages →", DEST);
