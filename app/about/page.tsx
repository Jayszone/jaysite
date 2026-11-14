import type { Metadata } from "next";
import { getLenses, getSite, getTimeline } from "@/lib/content";
export const metadata: Metadata = { title: "About", description: "Engineer, AI product builder and MBA student." };

export default function About() {
  const site = getSite(); const tl = getTimeline(); const lenses = getLenses();
  return (
    <>
      <div className="col">
        <div className="about">
          <div className="portrait">
            {site.portrait ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={site.portrait} alt="Portrait of Jay Naik" /> : <span>Photo placeholder</span>}
          </div>
          <div className="t">
            <p>Hi, I&rsquo;m Jay, an engineer and AI product builder.</p>
            <p>{site.intro}</p>
          </div>
        </div>

        <section className="section" aria-labelledby="xp">
          <h2 className="sh" id="xp">Experience</h2>
          <ol className="xp">
            {tl.entries.map((e) => (
              <li key={e.org}>
                <span className="when">{e.period}</span>
                <span>{e.org}{e.placeholder && <span className="ph">Placeholder</span>}<span className="sub">{e.role}</span>{e.summary && <span className="sub" style={{ marginTop: ".3rem" }}>{e.summary}</span>}</span>
              </li>
            ))}
          </ol>
          {tl.note && <p className="mute sans" style={{ marginTop: "1rem", fontSize: ".8rem" }}>{tl.note}</p>}
        </section>

        <section className="section" aria-labelledby="lens"><h2 className="sh" id="lens">Through my lens</h2></section>
      </div>
      <div className="lenses" role="group" aria-label="Photo collage">
        {lenses.map((l, i) => (
          <figure className="lens" key={i} style={{ ["--x" as string]: l.x, ["--y" as string]: l.y, ["--w" as string]: l.w, ["--ar" as string]: l.ar, ["--s" as string]: l.s }}>
            {l.src ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={l.src} alt={l.alt} loading="lazy" /> : <div className="ph-img">Photo placeholder<br />(content/lenses.json)</div>}
          </figure>
        ))}
      </div>
    </>
  );
}
