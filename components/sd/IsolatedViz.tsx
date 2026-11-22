"use client";
import { useEffect, useRef, useState } from "react";
import { Figure, Group, Node } from "./Fig";
import Wires from "./Wires";

const PEOPLE = [
  { id: "alex", name: "Alex", items: [["ai", "AI", "ai"], ["tech", "Technology", "tech"], ["design", "Design", "design"]] },
  { id: "sam", name: "Sam", items: [["arch", "Architecture", "arch"], ["hist", "History", "hist"], ["urban", "Urbanism", "urban"]] },
  { id: "jordan", name: "Jordan", items: [["phil", "Philosophy", "phil"], ["bio", "Biology", "bio"], ["psy", "Psychology", "psy"]] },
] as const;
const LABEL: Record<string, string> = {};
for (const p of PEOPLE) for (const [id, label] of p.items) LABEL[id] = label;

const LINKS: { a: string; b: string; text: string }[] = [
  { a: "design", b: "arch", text: "Design and architecture both ask how a space should feel to the person inside it." },
  { a: "ai", b: "phil", text: "Every question about machine intelligence runs into a question about what understanding is." },
  { a: "hist", b: "tech", text: "Most technology has a history of people, accidents and trade-offs that rarely gets told." },
];

export default function IsolatedViz() {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!box.current) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { t = setTimeout(() => setShown(true), 700); io.disconnect(); } }, { threshold: 0.7 });
    io.observe(box.current);
    return () => { io.disconnect(); if (t) clearTimeout(t); };
  }, []);
  const lit = (id: string) => shown && active !== null && (LINKS[active].a === id || LINKS[active].b === id);

  return (
    <Figure caption="Illustrative interests for three people. Each lives in a separate recommendation environment.">
      <div className="sd-bar">
        <p className="sd-line">{shown ? (active !== null ? LINKS[active].text : "Choose a connection to see why two interests might meet.") : "Each feed is a world of its own. Most of this never crosses over."}</p>
        <button className="sd-btn" aria-pressed={shown} onClick={() => { setShown((s) => !s); setActive(null); }}>{shown ? "Hide connections" : "Show connections"}</button>
      </div>
      <div className="sd-stage sd-iso" ref={box}>
        {shown && <Wires wires={LINKS.map((l, i) => ({ a: l.a, b: l.b, via: "top" as const, live: active === i, dim: active !== null && active !== i }))} />}
        {PEOPLE.map((p) => (
          <Group key={p.id} label={`${p.name}'s feed`}>
            <div className="sd-row3">{p.items.map(([id, label, icon]) => <Node key={id} id={id} icon={icon} label={label} tone={lit(id) ? "live" : ""} />)}</div>
          </Group>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{shown ? "Connections shown between the three feeds." : "Connections hidden."}</p>
      {shown && (
        <ul className="sd-chips" aria-label="Connections between interests">
          {LINKS.map((l, i) => (
            <li key={i}><button aria-pressed={active === i} onClick={() => setActive(active === i ? null : i)} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
              {LABEL[l.a]} <span aria-hidden="true">↔</span><span className="sr-only">and</span> {LABEL[l.b]}</button></li>
          ))}
        </ul>
      )}
    </Figure>
  );
}
