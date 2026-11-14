// A framed visual. Real image if provided, otherwise a clearly-labelled placeholder.
export default function Frame({ src, alt = "" }: { src?: string; alt?: string }) {
  return (
    <div className="frame">
      <div className="inner">
        {src ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={src} alt={alt} loading="lazy" /> : (
          <div className="card" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        )}
      </div>
      {!src && <p className="cap">Placeholder visual. Add <code>image:</code> to the project frontmatter.</p>}
    </div>
  );
}
