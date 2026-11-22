"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, LazyMotion, MotionConfig, domMax, m } from "motion/react";
import Thumb from "./Thumb";
import { Avatar, Brand, ChannelAv, Chrome, Dur, SOURCE_LABEL, Tag } from "./AppUI";
import { Icon } from "./Fig";
import { CIRCLES, TOPICS, circle, person, topicLabel, watchUrl, type TopicId } from "@/lib/sd/data";
import { NO_FEEDBACK, PERSONAL_MIX, SHARED_MIX, buildFeed, type Feedback, type Rec } from "@/lib/sd/engine";

type Mode = "personal" | "shared";
const SPRING = { type: "spring", stiffness: 420, damping: 38, mass: 0.8 } as const;
const RAIL: [string, string][] = [["home", "Home"], ["compass", "Explore"], ["people", "Circles"], ["feed", "Library"]];
const TIMING = { personal: 3200, shared: 4200, rest: 1600 };

/**
 * Experience A: the Shared Discovery app. Real videos, a rule-based recommender (lib/sd/engine.ts)
 * and real layout animation. When it scrolls into view it demonstrates Personal -> Shared by
 * itself; any touch hands control to the visitor. The real product would ask for consent first.
 */
export default function Prototype({ persona = "alex" }: { persona?: string }) {
  const me = person(persona);
  const [mode, setMode] = useState<Mode>("personal");
  const [circleId, setCircleId] = useState("rabbit-hole");
  const [pick, setPick] = useState("rabbit-hole");
  const [sheet, setSheet] = useState(false);
  const [fb, setFb] = useState<Record<Mode, Feedback>>({ personal: NO_FEEDBACK, shared: NO_FEEDBACK });
  const [detail, setDetail] = useState<Rec | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [filter, setFilter] = useState<TopicId | null>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const [auto, setAuto] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [visible, setVisible] = useState(false);
  const started = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const enterBtn = useRef<HTMLButtonElement>(null);
  const backBtn = useRef<HTMLButtonElement>(null);

  const say = (text: string, undo?: () => void) => { setToast({ text, undo }); };
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), toast.undo ? 6000 : 3200); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { if (sheet) enterBtn.current?.focus(); }, [sheet]);
  useEffect(() => { if (detail) backBtn.current?.focus(); }, [detail]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { if (sheet) { setSheet(false); trigger.current?.focus(); } else if (detail) setDetail(null); } };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [sheet, detail]);

  const shared = mode === "shared";
  const base = useMemo(() => buildFeed({
    userId: persona, circleId: shared ? circleId : null, mix: shared ? SHARED_MIX : { ...PERSONAL_MIX, explore: 0 },
    feedback: fb[mode], size: 12,
  }), [persona, shared, circleId, fb, mode]);
  const chips = useMemo(() => [...new Set(base.map((r) => r.video.topics[0] as TopicId))].slice(0, 8), [base]);
  const shown = filter ? base.filter((r) => r.video.topics.includes(filter)) : base;

  const reset = useCallback(() => { setDetail(null); setMenu(null); setFilter(null); setToast(null); feedRef.current?.scrollTo({ top: 0 }); }, []);
  const toShared = useCallback((id: string) => { setCircleId(id); setMode("shared"); setSheet(false); reset(); }, [reset]);
  const toPersonal = useCallback(() => { setMode("personal"); reset(); }, [reset]);

  // Automatic demonstration: only while the app is on screen, never with reduced motion.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.isIntersecting && !started.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) { started.current = true; setAuto(true); }
    }, { threshold: 0.45 });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || !visible) return;
    let t: ReturnType<typeof setTimeout>;
    const run = () => {
      toPersonal();
      t = setTimeout(() => { toShared("rabbit-hole"); t = setTimeout(() => { toPersonal(); t = setTimeout(run, TIMING.rest); }, TIMING.shared); }, TIMING.personal);
    };
    run();
    return () => clearTimeout(t);
  }, [auto, visible, runKey, toPersonal, toShared]);

  const chooseMode = (to: Mode) => {
    if (to === mode) return;
    if (to === "shared") { setSheet(true); return; }
    toPersonal(); say("Back to Personal Discovery");
  };
  const enter = () => { toShared(pick); say(`Shared Discovery · ${circle(pick).name}`); };
  const more = (r: Rec) => {
    const t = r.video.topics[0] as TopicId;
    setFb((f) => ({ ...f, [mode]: { ...f[mode], boost: { ...f[mode].boost, [t]: (f[mode].boost[t] ?? 0) + 0.35 } } }));
    say(`More ${topicLabel(t).toLowerCase()} coming up`); setMenu(null);
  };
  const hide = (r: Rec) => {
    const t = r.video.topics[0] as TopicId;
    const before = fb[mode];
    setFb((f) => ({ ...f, [mode]: { hidden: [...f[mode].hidden, r.video.id], boost: { ...f[mode].boost, [t]: (f[mode].boost[t] ?? 0) - 0.3 } } }));
    setMenu(null); setDetail(null);
    say("Okay, fewer like this", () => { setFb((f) => ({ ...f, [mode]: before })); setToast(null); });
  };

  const why = (r: Rec) => (
    <div className="app-why">
      {r.source === "circle" ? <span className="ui-stack" aria-hidden="true">{circle(circleId).members.filter((x) => x !== persona).slice(0, 3).map((x) => <Avatar key={x} name={person(x).name} hue={person(x).hue} />)}</span>
        : r.source === "explore" ? <span className="ui-ico-bubble" aria-hidden="true"><Icon name="spark" /></span>
        : <Avatar name={me.name} hue={me.hue} />}
      <p><b>Why you're seeing this</b>{r.reason}</p>
    </div>
  );

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user" transition={SPRING}>
        <LayoutGroup id="demo-a">
          <div className="sd-proto" ref={root}>
            <div className="sd-app app-yt" data-mode={mode} role="group" aria-label={`Shared Discovery prototype, viewing as ${me.name}`}
              onPointerDownCapture={() => setAuto(false)} onKeyDownCapture={() => setAuto(false)}>
              <Chrome url="watch.example" />
              <header className="app-top">
                <span className="app-burger" aria-hidden="true"><Icon name="feed" /></span>
                <Brand />
                <span className="app-search" aria-hidden="true"><Icon name="search" /><span>Search</span></span>
                <Avatar name={me.name} hue={me.hue} />
              </header>
              <div className="app-body">
                <nav className="app-rail" aria-hidden="true">
                  {RAIL.map(([ic, label], i) => <span key={label} className={i === 0 ? "on" : ""}><Icon name={ic} />{label}</span>)}
                </nav>
                <div className="app-main">
                  <div className="app-modes">
                    <div className="app-seg" role="group" aria-label="Discovery mode">
                      <button ref={trigger} aria-pressed={!shared} onClick={() => chooseMode("personal")}>{!shared && <m.span layoutId="segpill" className="app-pill" />}<span className="app-lbl"><Icon name="lock" />Personal</span></button>
                      <button aria-pressed={shared} onClick={() => chooseMode("shared")}>{shared && <m.span layoutId="segpill" className="app-pill" />}<span className="app-lbl"><Icon name="people" />Shared Discovery</span></button>
                    </div>
                    <span className="app-chip" data-mode={mode} aria-live="polite">
                      {shared ? <>{circle(circleId).name}<small>{circle(circleId).members.length} people</small></> : <>Private to you</>}
                    </span>
                  </div>
                  <div className="app-chips" role="group" aria-label="Filter by subject">
                    <button aria-pressed={!filter} onClick={() => setFilter(null)}>All</button>
                    {chips.map((t) => <button key={t} aria-pressed={filter === t} onClick={() => setFilter(filter === t ? null : t)}>{TOPICS.find((x) => x.id === t)!.label}</button>)}
                  </div>
                  <div className="app-feed" ref={feedRef} tabIndex={-1}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      {shown.map((r) => (
                        <m.article layout="position" key={r.video.id} className="ui-card app-card"
                          initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}>
                          <button className="app-open" onClick={() => setDetail(r)} tabIndex={-1} aria-hidden="true">
                            <span className="ui-thumb"><Thumb video={r.video} /><Dur v={r.video} /></span>
                          </button>
                          <div className="ui-body">
                            <ChannelAv name={r.video.channel} />
                            <div className="ui-meta">
                              <button className="app-title" onClick={() => setDetail(r)}>{r.video.title}</button>
                              <p className="ui-sub">{r.video.channel}</p>
                              {(shared || r.source === "explore") && <Tag source={r.source}>{SOURCE_LABEL[r.source]}</Tag>}
                            </div>
                            <button className="app-more" aria-expanded={menu === r.video.id} aria-label={`More options for ${r.video.title}`} onClick={() => setMenu(menu === r.video.id ? null : r.video.id)}><Icon name="more" /></button>
                          </div>
                          {menu === r.video.id && (
                            <div className="app-menu" role="group" aria-label="Feedback">
                              <button onClick={() => more(r)}><Icon name="plus" />More like this</button>
                              <button onClick={() => hide(r)}><Icon name="x" />Not interested</button>
                            </div>
                          )}
                        </m.article>
                      ))}
                    </AnimatePresence>
                    {shown.length === 0 && <p className="app-empty">{base.length ? "Nothing here for that subject." : "You've cleared this feed. Switch modes to start again."}</p>}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {detail && (
                  <m.div key="detail" className="app-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetail(null)}>
                    <m.div className="app-pop app-detail" role="dialog" aria-label={detail.video.title} onClick={(e) => e.stopPropagation()} initial={{ y: 24, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 12, scale: 0.97, opacity: 0 }}>
                      <button ref={backBtn} className="app-back" onClick={() => setDetail(null)}><Icon name="back" />Back to feed</button>
                      <div className="ui-thumb app-hero"><Thumb video={detail.video} size="max" /><Dur v={detail.video} /></div>
                      <h3>{detail.video.title}</h3>
                      <p className="app-chan"><ChannelAv name={detail.video.channel} />{detail.video.channel}</p>
                      {why(detail)}
                      <div className="app-row">
                        <button onClick={() => more(detail)}><Icon name="plus" />More like this</button>
                        <button onClick={() => hide(detail)}><Icon name="x" />Not interested</button>
                        <a className="app-yt-link" href={watchUrl(detail.video)} target="_blank" rel="noopener noreferrer">Watch on YouTube<span className="sr-only"> (opens in a new tab)</span><Icon name="out" /></a>
                      </div>
                    </m.div>
                  </m.div>
                )}
                {sheet && (
                  <m.div key="sheet" className="app-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setSheet(false); trigger.current?.focus(); }}>
                    <m.div className="app-pop app-sheet" role="dialog" aria-labelledby="sd-sheet-h" onClick={(e) => e.stopPropagation()} initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }}>
                      <h3 id="sd-sheet-h">Enter Shared Discovery</h3>
                      <ul>
                        <li><Icon name="people" /><span>What you explore in this mode helps shape your circle's recommendations.</span></li>
                        <li><Icon name="lock" /><span>Friends never see your searches or watch history.</span></li>
                        <li><Icon name="door" /><span>Leave any time. Personal browsing stays private.</span></li>
                      </ul>
                      <div className="app-circles" role="radiogroup" aria-label="Choose a private circle">
                        {CIRCLES.map((c) => (
                          <button key={c.id} role="radio" aria-checked={pick === c.id} onClick={() => setPick(c.id)}>
                            <b>{c.name}</b><small>{c.members.length} people · Private</small>
                          </button>
                        ))}
                      </div>
                      <button ref={enterBtn} className="app-go" onClick={enter}>Enter Shared Discovery</button>
                      <button className="app-skip" onClick={() => { setSheet(false); trigger.current?.focus(); }}>Not now</button>
                    </m.div>
                  </m.div>
                )}
              </AnimatePresence>

              <div className="app-toast" role="status" aria-live="polite">
                <AnimatePresence>{toast && <m.span key={toast.text} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }}>{toast.text}{toast.undo && <button onClick={toast.undo}>Undo</button>}</m.span>}</AnimatePresence>
              </div>
            </div>

            <div className="demo-bar">
              <div className="demo-ctl">
                <button onClick={() => (auto ? setAuto(false) : (setRunKey((k) => k + 1), setAuto(true)))}><Icon name={auto ? "pause" : "play2"} />{auto ? "Pause demo" : "Play demo"}</button>
                <button onClick={() => { setRunKey((k) => k + 1); setAuto(true); }}><Icon name="replay" />Replay</button>
              </div>
              <p className="sd-cap">{auto ? "Switching on its own for this page. Touch anything to take over." : "You're in control."} In the real product, entering Shared Discovery always asks for your consent first.</p>
            </div>
          </div>
        </LayoutGroup>
      </MotionConfig>
    </LazyMotion>
  );
}
