import type { Metadata } from "next";
import { getCuriosities } from "@/lib/content";
export const metadata: Metadata = { title: "Curiosities", description: "Things worth wondering about." };

export default function Curiosities() {
  return (
    <div className="col">
      <h1 className="sh">Curiosities</h1>
      <p className="mute" style={{ marginTop: "2rem", maxWidth: "36rem" }}>Things I keep wondering about. <span className="ph">Sample set. Edit content/curiosities.json</span></p>
      <ul className="cur" style={{ marginTop: "3rem" }}>
        {getCuriosities().map((c) => (
          <li key={c.id} id={c.id}>
            <details>
              <summary><span><span className="tt">{c.title}</span><span className="bl">{c.blurb}</span></span><span className="kick">{c.kicker}</span></summary>
              <div className="det">{c.detail.split("\n\n").map((para, i) => <p key={i} style={i ? { marginTop: "1rem" } : undefined}>{para}</p>)}{c.images && (<figure className="gal"><div className="gal-row">{c.images.map((im) => /* eslint-disable-next-line @next/next/no-img-element */ <img key={im.src} src={im.src} alt={im.alt} loading="lazy" style={{ flex: im.ratio }} />)}</div>{c.caption && <figcaption>{c.caption}</figcaption>}</figure>)}{c.link && <p style={{ marginTop: "1rem" }}><a className="inline" href={c.link} target="_blank" rel="noopener noreferrer">Source ↗</a></p>}</div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
