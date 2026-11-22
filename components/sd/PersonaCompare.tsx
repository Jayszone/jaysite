"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, LazyMotion, MotionConfig, domMax, m } from "motion/react";
import Thumb from "./Thumb";
import { Avatar, Brand, ChannelAv, Chrome, Dur, SOURCE_LABEL, Tag } from "./AppUI";
import { Icon } from "./Fig";
import { circle, person } from "@/lib/sd/data";
import { SHARED_MIX, buildFeed, sourceShare, type Source } from "@/lib/sd/engine";

const WHO = ["alex", "sam", "maya"];
const ORDER: Source[] = ["personal", "circle", "explore"];
const SPRING = { type: "spring", stiffness: 380, damping: 38, mass: 0.9 } as const;

/** Demonstration B: the same circle, seen as three different members. Cards move, enter and leave. */
export default function PersonaCompare() {
  const [who, setWho] = useState("alex");
  const feeds = useMemo(() => Object.fromEntries(WHO.map((id) => [id, buildFeed({ userId: id, circleId: "rabbit-hole", mix: SHARED_MIX, size: 9 })])), []);
  const mine = feeds[who].slice(0, 6);
  const share = sourceShare(feeds[who]);
  const others = WHO.filter((x) => x !== who);
  const c = circle("rabbit-hole");
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user" transition={SPRING}>
        <LayoutGroup id="persona">
          <div className="sd-wide sd-figgap">
            <div className="sd-app app-yt is-compact" data-mode="shared" role="group" aria-label="The same circle as seen by three members">
              <Chrome url="watch.example" />
              <header className="app-top">
                <Brand />
                <span className="app-chip" data-mode="shared">{c.name}<small>{c.members.length} people</small></span>
                <div className="app-who" role="radiogroup" aria-label="View the circle as">
                  {WHO.map((id) => (
                    <button key={id} role="radio" aria-checked={who === id} onClick={() => setWho(id)}>
                      {who === id && <m.span layoutId="whopill" className="app-whopill" />}
                      <span className="app-lbl"><Avatar name={person(id).name} hue={person(id).hue} />{person(id).name}</span>
                    </button>
                  ))}
                </div>
              </header>
              <p className="app-sub-h"><b>Alex, Sam and Maya</b> all belong to this circle. This is {person(who).name}'s Home feed: <span>{person(who).tagline}</span>.</p>
              <div className="app-feed is-grid3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {mine.map((r) => (
                    <m.article layout="position" key={r.video.id} className="ui-card" initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.16 } }}>
                      <div className="ui-thumb"><Thumb video={r.video} /><Dur v={r.video} /></div>
                      <div className="ui-body">
                        <ChannelAv name={r.video.channel} />
                        <div className="ui-meta">
                          <p className="ui-title">{r.video.title}</p>
                          <p className="ui-sub">{r.video.channel}</p>
                          <Tag source={r.source}>{SOURCE_LABEL[r.source]}</Tag>
                        </div>
                      </div>
                    </m.article>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            <div className="sd-annot">
              <div>
                <h3>Same circle, different feed</h3>
                <ul className="sd-overlap">
                  {others.map((o) => {
                    const n = mine.filter((r) => feeds[o].slice(0, 6).some((x) => x.video.id === r.video.id)).length;
                    return <li key={o}><span>With {person(o).name}</span><b>{n} of {mine.length} in common</b></li>;
                  })}
                </ul>
              </div>
              <div>
                <h3>Where {person(who).name}'s feed comes from</h3>
                <div className="sd-mixbar" role="img" aria-label={`${Math.round(share.personal * 100)}% for you, ${Math.round(share.circle * 100)}% from the circle, ${Math.round(share.explore * 100)}% new territory`}>
                  {ORDER.filter((s) => share[s] > 0).map((s) => <i key={s} className={`s-${s}`} style={{ flexGrow: share[s] }} />)}
                </div>
                <ul className="sd-legend">{ORDER.map((s) => <li key={s}><i className={`s-${s}`} />{SOURCE_LABEL[s]} <b>{Math.round(share[s] * 100)}%</b></li>)}</ul>
              </div>
              <div><p className="sd-line">Everyone in the circle shapes the pool. Each person gets a different slice of it, weighted by their own interests.</p></div>
            </div>
          </div>
        </LayoutGroup>
      </MotionConfig>
    </LazyMotion>
  );
}
