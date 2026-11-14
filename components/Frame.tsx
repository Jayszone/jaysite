// A framed visual. Real image if provided, otherwise a clearly-labelled placeholder.
import { VISUALS } from "./Visuals";

export default function Frame({ src, alt = "", visual }: { src?: string; alt?: string; visual?: string }) {
  const Viz = visual ? VISUALS[visual] : undefined;
  return (
    <div className="frame">
      <div className={`inner${Viz ? " has-viz" : ""}`}>
        {Viz ? <Viz /> : src ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={src} alt={alt} loading="lazy" /> : (
          <div className="card" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        )}
      </div>
      {!src && !Viz && <p className="cap">Placeholder visual. Add <code>image:</code> to the project frontmatter.</p>}
    </div>
  );
}
