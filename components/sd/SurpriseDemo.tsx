"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domMax, m } from "motion/react";
import Thumb from "./Thumb";
import { Avatar, Brand, ChannelAv, Chrome } from "./AppUI";
import { Icon } from "./Fig";
import { VIDEOS, person, topicLabel, watchUrl } from "@/lib/sd/data";
import { surprise, type Rec } from "@/lib/sd/engine";

const WHO = ["alex", "sam", "maya"];
const SPRING = { type: "spring", stiffness: 260, damping: 28, mass: 0.9 } as const;

/** Demonstration C: press Surprise me, get something unexpected but close to a real interest. */
export default function SurpriseDemo() {
  const [who, setWho] = useState("alex");
  const [n, setN] = useState(0);
  const [cur, setCur] = useState<Rec | null>(null);
  const [past, setPast] = useState<Rec[]>([]);
  const [spin, setSpin] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const reduce = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const go = (user = who, count = n, history = past, current = cur) => {
    const seen = [...history, ...(current ? [current] : [])].map((r) => r.video.id);
    const r = surprise(user, count, seen);
    if (!r) return;
    const land = () => { if (timer.current) clearInterval(timer.current); setSpin(null); if (current) setPast((p) => [current, ...p].slice(0, 5)); setCur(r); setN(count + 1); };
    if (reduce()) { land(); return; }
    let i = 0;
    timer.current = setInterval(() => { setSpin(VIDEOS[(i * 7 + count * 5) % VIDEOS.length].id); i++; if (i > 6) land(); }, 90);
  };
  const pickWho = (id: string) => { if (timer.current) clearInterval(timer.current); setSpin(null); setWho(id); setCur(null); setPast([]); setN(0); };
  const v = cur?.video;
  const near = cur ? cur.reason.replace("A new direction, next to your interest in ", "") : "";

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user" transition={SPRING}>
        <div className="sd-wide sd-figgap">
          <div className="sd-app app-yt is-surprise-demo" data-mode="shared" role="group" aria-label="Surprise me demonstration">
            <Chrome url="watch.example" />
            <header className="app-top">
              <Brand />
              <div className="app-who" role="radiogroup" aria-label="Surprise me for">
                {WHO.map((id) => (
                  <button key={id} role="radio" aria-checked={who === id} onClick={() => pickWho(id)}>
                    {who === id && <m.span layoutId="surpill" className="app-whopill" />}
                    <span className="app-lbl"><Avatar name={person(id).name} hue={person(id).hue} />{person(id).name}</span>
                  </button>
                ))}
              </div>
              <button className="app-surprise" onClick={() => go()} disabled={!!spin}><Icon name="spark" />Surprise me</button>
            </header>
            <div className="sur-stage">
              <div className="sur-main">
                <div className="sur-frame ui-thumb">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {spin ? (
                      <m.div key={`spin-${spin}`} className="sur-fill" initial={{ opacity: 0.6, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.08 }}>
                        <Thumb video={{ id: spin }} size="max" />
                      </m.div>
                    ) : v ? (
                      <m.div key={v.id} className="sur-fill" initial={{ opacity: 0, scale: 1.08, filter: "blur(14px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.98 }}>
                        <Thumb video={v} size="max" />
                      </m.div>
                    ) : (
                      <m.div key="empty" className="sur-empty" exit={{ opacity: 0 }}>
                        <Icon name="spark" /><p>Press <b>Surprise me</b> for something you would not have searched for.</p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="sur-info" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    {v && !spin && (
                      <m.div key={v.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        <h3>{v.title}</h3>
                        <p className="sur-chan"><ChannelAv name={v.channel} />{v.channel}</p>
                        <p className="sur-near"><Icon name="spark" />Next to your interest in {near}</p>
                        <div className="app-row">
                          <button onClick={() => go()}><Icon name="shuffle" />Another</button>
                          <a className="app-yt-link" href={watchUrl(v)} target="_blank" rel="noopener noreferrer">Watch on YouTube<span className="sr-only"> (opens in a new tab)</span><Icon name="out" /></a>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <aside className="sur-past" aria-label="Earlier surprises">
                <h3>{past.length ? "Earlier" : "Your first one is waiting"}</h3>
                <ul>
                  <AnimatePresence initial={false}>
                    {past.map((r) => (
                      <m.li key={r.video.id} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                        <span className="ui-thumb"><Thumb video={r.video} /></span>
                        <span><b>{r.video.title}</b><small>{topicLabel(r.video.topics[0])}</small></span>
                      </m.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </aside>
            </div>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
