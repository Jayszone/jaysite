"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, LazyMotion, MotionConfig, domMax, m } from "motion/react";
import Thumb from "./Thumb";
import { Avatar, Brand, ChannelAv, Chrome, Dur, SOURCE_LABEL, Tag } from "./AppUI";
import { Icon } from "./Fig";
import { CIRCLES, TOPICS, circle, person, topicLabel, watchUrl, type TopicId } from "@/lib/sd/data";
import { NO_FEEDBACK, PERSONAL_MIX, SHARED_MIX, buildFeed, sourceShare, surprise, type Feedback, type Rec, type Source } from "@/lib/sd/engine";

type Mode = "personal" | "shared";
const ORDER: Source[] = ["personal", "circle", "explore"];
const SPRING = { type: "spring", stiffness: 420, damping: 38, mass: 0.8 } as const;
const RAIL: [string, string][] = [["home", "Home"], ["compass", "Explore"], ["people", "Circles"], ["feed", "Library"]];

/**
 * The embedded Shared Discovery app. Real videos, a rule-based recommender (lib/sd/engine.ts) and
 * real layout animation: cards keep their identity when the feed changes, so they move, enter and leave.
 */
export default function Prototype({ persona = "alex", tryThis, name = "prototype" }: { persona?: string; tryThis?: string[]; name?: string }) {
  const me = person(persona);
  const sid = name.replace(/\s+/g, "-");
  const [mode, setMode] = useState<Mode>("personal");
  const [circleId, setCircleId] = useState("rabbit-hole");
  const [pick, setPick] = useState("rabbit-hole");
  const [sheet, setSheet] = useState(false);
  const [fb, setFb] = useState<Record<Mode, Feedback>>({ personal: NO_FEEDBACK, shared: NO_FEEDBACK });
  const [surprises, setSurprises] = useState<Rec[]>([]);
  const [surpriseN, setSurpriseN] = useState(0);
  const [detail, setDetail] = useState<Rec | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [filter, setFilter] = useState<TopicId | null>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const enterBtn = useRef<HTMLButtonElement>(null);
  const backBtn = useRef<HTMLButtonElement>(null);

  const say = (text: string, undo?: () => void) => { setToast({ text, undo }); };
  const note = (line: string) => setLog((l) => [line, ...l].slice(0, 5));
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), toast.undo ? 6000 : 3200); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { if (sheet) enterBtn.current?.focus(); }, [sheet]);
  useEffect(() => { if (detail) backBtn.current?.focus(); }, [detail]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { if (sheet) { setSheet(false); trigger.current?.focus(); } else if (detail) setDetail(null); } };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [sheet, detail]);

  const shared = mode === "shared";
  const base = useMemo(() => buildFeed({
    userId: persona, circleId: shared ? circleId : null, mix: shared ? SHARED_MIX : PERSONAL_MIX,
    feedback: fb[mode], size: 12, exclude: shared ? surprises.map((s) => s.video.id) : [],
  }), [persona, shared, circleId, fb, mode, surprises]);
  const feed = useMemo(() => [...(shared ? surprises.filter((s) => !fb.shared.hidden.includes(s.video.id)) : []), ...base], [shared, surprises, base, fb]);
  const share = sourceShare(feed);
  const chips = useMemo(() => [...new Set(feed.map((r) => r.video.topics[0] as TopicId))].slice(0, 8), [feed]);
  const shown = filter ? feed.filter((r) => r.video.topics.includes(filter)) : feed;

  const chooseMode = (to: Mode) => {
    if (to === mode) return;
    if (to === "shared") { setSheet(true); return; }
    setMode("personal"); setSurprises([]); setDetail(null); setMenu(null); setFilter(null);
    feedRef.current?.scrollTo({ top: 0 });
    note("Left Shared Discovery. Back to private browsing."); say("Back to Personal Discovery");
  };
  const enter = () => {
    setCircleId(pick); setMode("shared"); setSheet(false); setDetail(null); setFilter(null);
    feedRef.current?.scrollTo({ top: 0 });
    note(`Entered Shared Discovery: ${circle(pick).name}`); say(`Shared Discovery · ${circle(pick).name}`);
  };
  const more = (r: Rec) => {
    const t = r.video.topics[0] as TopicId;
    setFb((f) => ({ ...f, [mode]: { ...f[mode], boost: { ...f[mode].boost, [t]: (f[mode].boost[t] ?? 0) + 0.35 } } }));
    note(`More like this: ${topicLabel(t)}`); say(`More ${topicLabel(t).toLowerCase()} coming up`); setMenu(null);
  };
  const hide = (r: Rec) => {
    const t = r.video.topics[0] as TopicId;
    const before = fb[mode];
    setFb((f) => ({ ...f, [mode]: { hidden: [...f[mode].hidden, r.video.id], boost: { ...f[mode].boost, [t]: (f[mode].boost[t] ?? 0) - 0.3 } } }));
    note(`Not interested: ${r.video.title}`); setMenu(null); setDetail(null);
    say("Okay, fewer like this", () => { setFb((f) => ({ ...f, [mode]: before })); note("Undid the last choice"); setToast(null); });
  };
  const surpriseMe = () => {
    const r = surprise(persona, surpriseN, [...feed.map((f) => f.video.id), ...surprises.map((s) => s.video.id)], fb.shared);
    if (!r) { say("Nothing new nearby right now"); return; }
    setSurprises((s) => [r, ...s]); setSurpriseN((n) => n + 1); setFilter(null);
    note(`Surprise: ${r.video.title}`); say(`New direction: ${topicLabel(r.video.topics[0] as TopicId)}`);
    feedRef.current?.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
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
        <LayoutGroup id={name}>
          <div className="sd-proto">
            <div className="sd-app app-yt" data-mode={mode} role="group" aria-label={`Shared Discovery prototype, viewing as ${me.name}`}>
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
                    {shared && <m.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="app-surprise" onClick={surpriseMe}><Icon name="spark" />Surprise me</m.button>}
                  </div>
                  <div className="app-chips" role="group" aria-label="Filter by subject">
                    <button aria-pressed={!filter} onClick={() => setFilter(null)}>All</button>
                    {chips.map((t) => <button key={t} aria-pressed={filter === t} onClick={() => setFilter(filter === t ? null : t)}>{TOPICS.find((x) => x.id === t)!.label}</button>)}
                  </div>
                  <div className="app-feed" ref={feedRef} tabIndex={-1}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      {shown.map((r) => (
                        <m.article layout="position" key={r.video.id} className={`ui-card app-card${r.surprise ? " is-surprise" : ""}`}
                          initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}>
                          <button className="app-open" onClick={() => setDetail(r)} tabIndex={-1} aria-hidden="true">
                            <span className="ui-thumb"><Thumb video={r.video} /><Dur v={r.video} /></span>
                          </button>
                          <div className="ui-body">
                            <ChannelAv name={r.video.channel} />
                            <div className="ui-meta">
                              <button className="app-title" onClick={() => setDetail(r)}>{r.video.title}</button>
                              <p className="ui-sub">{r.video.channel}</p>
                              {(shared || r.source === "explore") && <Tag source={r.source}>{r.surprise ? "Surprise" : SOURCE_LABEL[r.source]}</Tag>}
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
                    {shown.length === 0 && <p className="app-empty">{feed.length ? "Nothing here for that subject." : "You've cleared this feed. Switch modes to start again."}</p>}
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
                        <button onClick={() => { more(detail); }}><Icon name="plus" />More like this</button>
                        <button onClick={() => hide(detail)}><Icon name="x" />Not interested</button>
                        <a className="app-yt-link" href={watchUrl(detail.video)} target="_blank" rel="noopener noreferrer">Watch on YouTube<span className="sr-only"> (opens in a new tab)</span><Icon name="out" /></a>
                      </div>
                    </m.div>
                  </m.div>
                )}
                {sheet && (
                  <m.div key="sheet" className="app-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setSheet(false); trigger.current?.focus(); }}>
                    <m.div className="app-pop app-sheet" role="dialog" aria-labelledby={`${sid}-sheet-h`} onClick={(e) => e.stopPropagation()} initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }}>
                      <h3 id={`${sid}-sheet-h`}>Enter Shared Discovery</h3>
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

            <aside className="sd-annot" aria-label={`What the ${name} is doing`}>
              <div>
                <h3>Mode</h3>
                <p className="sd-big" data-mode={mode}>{shared ? `Shared Discovery · ${circle(circleId).name}` : "Personal"}</p>
                <p className="sd-note">{shared ? "Activity in this mode can shape the circle's recommendations. No one sees your searches or history." : "Nothing here is shared. Recommendations come only from your private activity."}</p>
              </div>
              <div>
                <h3>This feed is made of</h3>
                <div className="sd-mixbar" role="img" aria-label={ORDER.map((s) => `${Math.round(share[s] * 100)}% ${SOURCE_LABEL[s]}`).join(", ")}>
                  {ORDER.filter((s) => share[s] > 0).map((s) => <i key={s} className={`s-${s}`} style={{ flexGrow: share[s] }} />)}
                </div>
                <ul className="sd-legend">{ORDER.map((s) => <li key={s}><i className={`s-${s}`} />{SOURCE_LABEL[s]} <b>{Math.round(share[s] * 100)}%</b></li>)}</ul>
              </div>
              <div>
                <h3>What just changed</h3>
                {log.length ? <ol className="sd-log">{log.map((l, i) => <li key={`${l}${i}`}>{l}</li>)}</ol> : <p className="sd-note">Nothing yet. {tryThis?.[0] ?? "Tap Shared Discovery to begin."}</p>}
              </div>
              {tryThis && <div><h3>Try this</h3><ul className="sd-try">{tryThis.map((t) => <li key={t}>{t}</li>)}</ul></div>}
            </aside>
          </div>
        </LayoutGroup>
      </MotionConfig>
    </LazyMotion>
  );
}
