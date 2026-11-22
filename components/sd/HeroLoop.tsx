"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import Thumb from "./Thumb";
import { Avatar, Brand, ChannelAv, Chrome, Dur, Tag } from "./AppUI";
import { Icon } from "./Fig";
import { person, video } from "@/lib/sd/data";

// The opening visual: one cinematic screen of the fictional "Watch" app. It loops quietly from a
// familiar Personal feed (AI, technology, computing) to Shared Discovery (things a circle of
// friends found). A preview, not a control: the real, interactive version is in The Experience.
const FAMILIAR = ["aircAruvnKk", "wjZofJX0v4M", "Ilg3gGewQ5U", "0OyhASRR0To", "moYxYEfxO7g", "EK32jo7i5LQ"].map(video);
const SHARED = ["gFP-7Z9HLww", "_IOPlGPQPuM", "Xd8muMF6uVc", "9HXXQBz6Vv0", "Z8dZSySRX_g", "uSMGENDH_QI"].map(video);
const CHIPS = { personal: ["Artificial intelligence", "Technology", "Computing"], shared: ["Ancient Egypt", "Renaissance architecture", "Nuclear microreactors", "Ocean life"] };
const HOLD = { personal: 3200, shared: 4200 };

export default function HeroLoop() {
  const root = useRef<HTMLDivElement>(null);
  const [shared, setShared] = useState(true); // static (reduced motion / no JS) shows the end state
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShared(false);
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.3 });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live) return;
    let t: ReturnType<typeof setTimeout>;
    const flip = (to: boolean) => { setShared(to); t = setTimeout(() => flip(!to), to ? HOLD.shared : HOLD.personal); };
    t = setTimeout(() => flip(!shared), shared ? HOLD.shared : HOLD.personal);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);

  const set = shared ? SHARED : FAMILIAR;
  const chips = shared ? CHIPS.shared : CHIPS.personal;
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="sd-wide sd-rise" style={{ ["--i" as string]: 3 }} ref={root}>
          <div className="sd-app hero-app" data-mode={shared ? "shared" : "personal"} role="img"
            aria-label="A mock-up of a video app. Its Home feed changes from familiar topics, such as AI, technology and computing, to subjects a circle of friends has been exploring: ancient Egypt, Renaissance architecture, nuclear microreactors and ocean life.">
            <Chrome url="watch.example" />
            <div className="app-top" aria-hidden="true">
              <Brand />
              <span className="app-search"><Icon name="search" />Search</span>
              <Avatar name="Alex" hue={person("alex").hue} />
            </div>
            <div className="hero-bar" aria-hidden="true">
              <div className="hero-seg">
                <span className={!shared ? "on" : ""}>{!shared && <m.i layoutId="heropill" className="hero-pill" transition={{ type: "spring", stiffness: 420, damping: 38 }} />}<b><Icon name="lock" />Personal</b></span>
                <span className={shared ? "on" : ""}>{shared && <m.i layoutId="heropill" className="hero-pill" transition={{ type: "spring", stiffness: 420, damping: 38 }} />}<b><Icon name="people" />Shared Discovery</b></span>
              </div>
              <div className="hero-topics">
                <AnimatePresence mode="wait" initial={false}>
                  <m.div key={String(shared)} className="hero-topics-in" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                    {chips.map((c) => <span key={c}>{c}</span>)}
                  </m.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="hero-grid" aria-hidden="true">
              <AnimatePresence mode="popLayout" initial={false}>
                {set.map((v, i) => (
                  <m.article key={v.id} className="ui-card" initial={{ opacity: 0, y: 22, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.28 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 34, delay: 0.05 * i }}>
                    <div className="ui-thumb"><Thumb video={v} size="max" /><Dur v={v} /></div>
                    <div className="ui-body">
                      <ChannelAv name={v.channel} />
                      <div className="ui-meta">
                        <p className="ui-title">{v.title}</p>
                        <p className="ui-sub">{v.channel}</p>
                        {shared && <Tag source="circle">From your circle</Tag>}
                      </div>
                    </div>
                  </m.article>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
