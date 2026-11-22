"use client";
import { useEffect, useRef } from "react";
import Thumb from "./Thumb";
import type { TopicId } from "@/lib/sd/data";

type Item = { id: string; title: string; topic: TopicId; circle: boolean };
type Feed = { name: string; hue: number; items: Item[] };

// Three separate feeds drift together as the page scrolls. Scroll progress is written to one CSS
// variable (--p), so the animation is cheap. With reduced motion the final composition is shown.
export default function HeroFeeds({ feeds }: { feeds: Feed[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrap.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.setProperty("--p", "1"); el.dataset.static = "true"; return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, -r.top / span))));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="sd-hero" ref={wrap} style={{ ["--p" as string]: 0 }}>
      <div className="sd-hero-stick">
        <div className="sd-strips" role="group" aria-label="Three different personalized feeds from the same circle of friends">
          {feeds.map((f, k) => (
            <div className="sd-strip" key={f.name} style={{ ["--side" as string]: k - 1, ["--dy" as string]: k === 1 ? -46 : k === 0 ? 18 : 34, ["--h" as string]: f.hue }}>
              <div className="sd-strip-head"><span className="sd-me" style={{ ["--h" as string]: f.hue }}>{f.name[0]}</span>{f.name}</div>
              {f.items.map((it) => (
                <div className={`sd-mini${it.circle ? " is-circle" : ""}`} key={it.id}>
                  <div className="sd-thumb"><Thumb topic={it.topic} variant={it.id.length} />{it.circle && <em>From the circle</em>}</div>
                  <p>{it.title}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="sd-captions" aria-hidden="false">
          <span style={{ ["--a" as string]: 0.0 }}>Different minds.</span>{" "}
          <span style={{ ["--a" as string]: 0.28 }}>Different interests.</span>{" "}
          <span style={{ ["--a" as string]: 0.58 }}>Shared discovery.</span>
        </p>
      </div>
    </div>
  );
}
