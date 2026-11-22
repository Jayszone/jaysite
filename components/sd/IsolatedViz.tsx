"use client";
import { useEffect, useRef, useState } from "react";

type Interest = { id: string; label: string; who: string; x: number; y: number };
const PEOPLE = [
  { id: "alex", name: "Alex", hue: 218, cx: 160, items: [["ai", "AI", -58, -76], ["tech", "Technology", 70, -16], ["design", "Design", -42, 74]] },
  { id: "sam", name: "Sam", hue: 28, cx: 480, items: [["arch", "Architecture", -62, -70], ["hist", "History", 66, -18], ["urban", "Urbanism", -34, 76]] },
  { id: "jordan", name: "Jordan", hue: 300, cx: 800, items: [["phil", "Philosophy", -60, -72], ["bio", "Biology", 68, -14], ["psy", "Psychology", -38, 76]] },
] as const;
const NODES: Record<string, Interest> = {};
for (const p of PEOPLE) for (const [id, label, dx, dy] of p.items) NODES[id] = { id, label, who: p.name, x: p.cx + dx, y: 190 + dy };

const LINKS: { a: string; b: string; text: string }[] = [
  { a: "design", b: "arch", text: "Design and architecture both ask how a space should feel to the person inside it." },
  { a: "ai", b: "phil", text: "Every question about machine intelligence runs into a question about what understanding is." },
  { a: "hist", b: "tech", text: "Most technology has a history of people, accidents and trade-offs that rarely gets told." },
  { a: "psy", b: "design", text: "Good design depends on how people actually behave, which is psychology's whole subject." },
  { a: "urban", b: "psy", text: "A city is a very large environment for human behavior." },
  { a: "bio", b: "arch", text: "Some of the best structures borrow from things that grew, not things that were built." },
];

export default function IsolatedViz() {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!box.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { const t = setTimeout(() => setShown(true), 700); (io as unknown as { t?: ReturnType<typeof setTimeout> }).t = t; io.disconnect(); } }, { threshold: 0.7 });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  return (
    <div className="sd-viz" ref={box}>
      <div className="sd-viz-bar">
        <p className="sd-cap">Illustrative interests for three people. Each lives in a separate recommendation environment.</p>
        <button className="sd-btn" aria-pressed={shown} onClick={() => { setShown((s) => !s); setActive(null); }}>{shown ? "Hide connections" : "Show connections"}</button>
      </div>
      <svg viewBox="0 0 960 380" role="img" aria-label="Three people with separate sets of interests. When connections are shown, lines link interests that overlap across people." className="sd-svg">
        {PEOPLE.map((p) => (
          <g key={p.id} style={{ ["--h" as string]: p.hue }}>
            <circle className="sd-orbit" cx={p.cx} cy={190} r={128} />
            <text className="sd-who" x={p.cx} y={340} textAnchor="middle">{p.name}</text>
          </g>
        ))}
        {LINKS.map((l, i) => {
          const a = NODES[l.a], b = NODES[l.b];
          const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - 50 - Math.abs(a.x - b.x) * 0.14 - (i % 2) * 16;
          return <path key={i} className={`sd-link${shown ? " on" : ""}${active === i ? " act" : ""}`} d={`M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`} pathLength={1} style={{ ["--d" as string]: `${i * 0.12}s` }} />;
        })}
        {PEOPLE.map((p) => p.items.map(([id, label]) => {
          const n = NODES[id];
          const linked = active !== null && (LINKS[active].a === id || LINKS[active].b === id);
          return (
            <g key={id} className={`sd-node${linked ? " act" : ""}`} style={{ ["--h" as string]: p.hue }} transform={`translate(${n.x} ${n.y})`}>
              <rect x={-52} y={-17} width={104} height={34} rx={17} />
              <text textAnchor="middle" y={5}>{label}</text>
            </g>
          );
        }))}
      </svg>
      <div className="sd-viz-foot" aria-live="polite">
        <p className="sd-line">{shown ? (active !== null ? LINKS[active].text : "Choose a connection to see why two interests might meet.") : "Each feed is a world of its own. Most of this never crosses over."}</p>
        {shown && (
          <ul className="sd-chips">
            {LINKS.map((l, i) => (
              <li key={i}><button aria-pressed={active === i} onClick={() => setActive(active === i ? null : i)} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
                {NODES[l.a].label} <span aria-hidden="true">↔</span><span className="sr-only">and</span> {NODES[l.b].label}</button></li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
