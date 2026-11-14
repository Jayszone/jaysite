import Link from "next/link";
import Frame from "@/components/Frame";
import CopyEmail from "@/components/CopyEmail";
import { getProjects, getSite } from "@/lib/content";

export default function Home() {
  const site = getSite(); const projects = getProjects();
  return (
    <div className="col">
      <div className="text text-wide">
        <div className="portrait" style={{ width: "min(46%, 240px)", marginBottom: "3rem" }}>
          {site.portrait ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={site.portrait} alt="Portrait of Jay Naik" /> : <span>Portrait placeholder<br />(set <code>portrait</code> in content/site.json)</span>}
        </div>
        <div className="prose-home">
          <p>Hi, I&rsquo;m Jay.</p>
          <p>Welcome to my corner of the internet. I&rsquo;m an engineer and AI product builder, and I&rsquo;m pursuing my MBA at Cornell.</p>
          <p>I&rsquo;m thoroughly curious about a myriad of topics. I&rsquo;m also persistent, and I think those traits define me.</p>
          <p>I like to read (not doing that a lot lately, lol). I like exploring different subjects and cultures, and how culture shapes businesses and personal decisions.</p>
          <p>This space is a bit of everything: <Link href="/" className="inline">/work</Link>, <Link href="/curiosities" className="inline">/curiosities</Link>, <Link href="/thinking" className="inline">/thinking</Link> and <Link href="/about" className="inline">/about</Link>.</p>
        </div>
        <div className="contact sans">
          <div><span className="lbl mute" style={{ fontSize: ".95rem" }}>Get in touch</span>
            <span style={{ display: "inline-flex", flexWrap: "wrap", gap: ".6rem 2rem" }}>
              {site.links.filter((l) => l.href).map((l) => <a key={l.label} className="dotted" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>)}
              <CopyEmail email={site.email} />
              {site.resume && <a className="dotted" href={site.resume}>Resume ↗</a>}
            </span>
            {site.emailIsPlaceholder && <span className="ph" style={{ marginLeft: 0, marginTop: ".6rem", display: "inline-block" }}>Placeholder email</span>}
          </div>
        </div>
      </div>

      <section className="section" aria-labelledby="sel">
        <h2 className="sh" id="sel">Selected work</h2>
        <div>
          {projects.map((p) => (
            <Link key={p.slug} href={`/work/${p.slug}`} className="entry">
              <Frame src={p.image} alt={p.title} />
              <h3>{p.title}{p.placeholder && <span className="ph">Placeholder</span>}</h3>
              <p>{p.summary.replace(/^PLACEHOLDER\.\s*/, "")}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
