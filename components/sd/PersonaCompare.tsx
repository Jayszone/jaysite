"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, LazyMotion, MotionConfig, domMax, m } from "motion/react";
import Thumb from "./Thumb";
import { Avatar, Brand, ChannelAv, Chrome, Dur, SOURCE_LABEL, Tag } from "./AppUI";
import { Icon } from "./Fig";
import { circle, person } from "@/lib/sd/data";
import { SHARED_MIX, buildFeed, surprise, type Rec } from "@/lib/sd/engine";

const WHO = ["alex", "sam", "maya"];
const SPRING = { type: "spring", stiffness: 380, damping: 38, mass: 0.9 } as const;

/**
 * Experience B and C: the same circle, seen as three different members, and a Surprise me button
 * that slips one unfamiliar-but-close video into the feed.
 */
export default function PersonaCompare() {
  const [who, setWho] = useState("alex");
  const [extras, setExtras] = useState<Rec[]>([]);
  const feeds = useMemo(() => Object.fromEntries(WHO.map((id) => [id, buildFeed({ userId: id, circleId: "rabbit-hole", mix: SHARED_MIX, size: 9 })])), []);
  const c = circle("rabbit-hole");
  const feed = [...extras, ...feeds[who].filter((r) => !extras.some((e) => e.video.id === r.video.id))].slice(0, 6);
  const pickWho = (id: string) => { setWho(id); setExtras([]); };
  const surpriseMe = () => {
    const r = surprise(who, extras.length, [...feed.map((f) => f.video.id), ...extras.map((e) => e.video.id)]);
    if (r) setExtras((e) => [r, ...e].slice(0, 3));
  };
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user" transition={SPRING}>
        <LayoutGroup id="persona">
          <div className="sd-app app-yt is-compact" data-mode="shared" role="group" aria-label="The same circle as seen by three members">
            <Chrome url="watch.example" />
            <header className="app-top">
              <Brand />
              <span className="app-chip" data-mode="shared">{c.name}<small>{c.members.length} people</small></span>
              <div className="app-who" role="radiogroup" aria-label="View the circle as">
                {WHO.map((id) => (
                  <button key={id} role="radio" aria-checked={who === id} onClick={() => pickWho(id)}>
                    {who === id && <m.span layoutId="whopill" className="app-whopill" />}
                    <span className="app-lbl"><Avatar name={person(id).name} hue={person(id).hue} />{person(id).name}</span>
                  </button>
                ))}
              </div>
              <button className="app-surprise" onClick={surpriseMe}><Icon name="spark" />Surprise me</button>
            </header>
            <div className="app-feed is-grid3">
              <AnimatePresence mode="popLayout" initial={false}>
                {feed.map((r) => {
                  const fresh = extras.some((e) => e.video.id === r.video.id);
                  return (
                    <m.article layout="position" key={r.video.id} className={`ui-card${fresh ? " is-fresh" : ""}`}
                      initial={fresh ? { opacity: 0, scale: 0.86, filter: "blur(12px)" } : { opacity: 0, y: 18, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.16 } }}>
                      <div className="ui-thumb"><Thumb video={r.video} /><Dur v={r.video} /></div>
                      <div className="ui-body">
                        <ChannelAv name={r.video.channel} />
                        <div className="ui-meta">
                          <p className="ui-title">{r.video.title}</p>
                          <p className="ui-sub">{r.video.channel}</p>
                          <Tag source={r.source}>{fresh ? "Surprise" : SOURCE_LABEL[r.source]}</Tag>
                        </div>
                      </div>
                    </m.article>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </LayoutGroup>
      </MotionConfig>
    </LazyMotion>
  );
}
