"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Thumb from "./Thumb";
import { Avatar, Brand, Chrome, SOURCE_LABEL, Tag, dur } from "./AppUI";
import { Icon } from "./Fig";
import { CIRCLES, circle, person, topicLabel, type TopicId } from "@/lib/sd/data";
import { NO_FEEDBACK, PERSONAL_MIX, SHARED_MIX, buildFeed, sourceShare, surprise, type Feedback, type Rec, type Source } from "@/lib/sd/engine";

type Mode = "personal" | "shared";
const ORDER: Source[] = ["personal", "circle", "explore"];

export default function Prototype({ persona = "alex", panel = true, tryThis, name = "prototype" }: { persona?: string; panel?: boolean; tryThis?: string[]; name?: string }) {
  const me = person(persona);
  const [mode, setMode] = useState<Mode>("personal");
  const [circleId, setCircleId] = useState("rabbit-hole");
  const [pick, setPick] = useState("rabbit-hole");
  const [sheet, setSheet] = useState(false);
  const [fb, setFb] = useState<Record<Mode, Feedback>>({ personal: NO_FEEDBACK, shared: NO_FEEDBACK });
  const [surprises, setSurprises] = useState<Rec[]>([]);
  const [surpriseN, setSurpriseN] = useState(0);
  const [detail, setDetail] = useState<Rec | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [flip, setFlip] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const backBtn = useRef<HTMLButtonElement>(null);
  const enterBtn = useRef<HTMLButtonElement>(null);
  const prevIds = useRef<string[]>([]);

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
    feedback: fb[mode], size: 10, exclude: shared ? surprises.map((s) => s.video.id) : [],
  }), [persona, shared, circleId, fb, mode, surprises]);
  const feed = useMemo(() => [...(shared ? surprises.filter((s) => !fb.shared.hidden.includes(s.video.id)) : []), ...base], [shared, surprises, base, fb]);
  const share = sourceShare(feed);
  const fresh = new Set(feed.map((r) => r.video.id).filter((id) => !prevIds.current.includes(id)));
  useEffect(() => { prevIds.current = feed.map((r) => r.video.id); });

  const chooseMode = (m: Mode) => {
    if (m === mode) return;
    if (m === "shared") { setSheet(true); return; }
    setMode("personal"); setSurprises([]); setDetail(null); setMenu(null); setFlip((n) => n + 1);
    note("Left Shared Discovery. Back to private browsing."); say("Back to Personal Discovery");
  };
  const enter = () => {
    setCircleId(pick); setMode("shared"); setSheet(false); setDetail(null); setFlip((n) => n + 1);
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
    setSurprises((s) => [r, ...s]); setSurpriseN((n) => n + 1);
    note(`Surprise: ${r.video.title}`); say(`New direction: ${topicLabel(r.video.topics[0] as TopicId)}`);
    feedRef.current?.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const why = (r: Rec) => (
    <div className="app-why">
      <b>Why you're seeing this</b>
      <div className="app-why-row">
        {r.source === "circle" ? <span className="ui-stack" aria-hidden="true">{circle(circleId).members.filter((m) => m !== persona).slice(0, 3).map((m) => <Avatar key={m} name={person(m).name} hue={person(m).hue} />)}</span>
          : r.source === "explore" ? <span className="ui-ico-bubble" aria-hidden="true"><Icon name="spark" /></span>
          : <Avatar name={me.name} hue={me.hue} />}
        <p>{r.reason}</p>
      </div>
    </div>
  );

  return (
    <div className={`sd-proto${panel ? " has-panel" : ""}`}>
      <div className="sd-app" data-mode={mode} role="group" aria-label={`Shared Discovery prototype, viewing as ${me.name}`}>
        <Chrome url="watch.example/home" />
        <header className="app-top">
          <Brand />
          <span className="app-search" aria-hidden="true"><Icon name="search" />Search</span>
          <Avatar name={me.name} hue={me.hue} />
        </header>
        <div className="app-modes">
          <div className="app-seg" role="group" aria-label="Discovery mode">
            <button ref={trigger} aria-pressed={!shared} onClick={() => chooseMode("personal")}><Icon name="lock" />Personal</button>
            <button aria-pressed={shared} onClick={() => chooseMode("shared")}><Icon name="people" />Shared Discovery</button>
          </div>
          <span className="app-chip" data-mode={mode} aria-live="polite">
            {shared ? <>{circle(circleId).name}<small>{circle(circleId).members.length} people</small></> : <>Private to you</>}
          </span>
          {shared && <button className="app-surprise" onClick={surpriseMe}><Icon name="spark" />Surprise me</button>}
        </div>
        <div className="app-feed" ref={feedRef} key={flip} tabIndex={-1}>
          {feed.map((r, i) => (
            <article className={`ui-card app-card${r.surprise ? " is-surprise" : ""}${fresh.has(r.video.id) && flip > 0 ? " is-new" : ""}`} key={r.video.id} style={{ ["--i" as string]: Math.min(i, 8) }}>
              <button className="app-open" onClick={() => setDetail(r)} tabIndex={-1} aria-hidden="true">
                <span className="ui-thumb"><Thumb video={r.video} /><em>{dur(r.video)}</em></span>
              </button>
              <div className="ui-meta app-meta">
                <div>
                  <button className="app-title" onClick={() => setDetail(r)}>{r.video.title}</button>
                  <p className="ui-sub">{r.video.kind} · {topicLabel(r.video.topics[0])}</p>
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
            </article>
          ))}
          {feed.length === 0 && <p className="app-empty">You've cleared this feed. Switch modes to start again.</p>}
        </div>

        {detail && (
          <div className="app-scrim" onClick={() => setDetail(null)}>
            <div className="app-pop app-detail" role="dialog" aria-label={detail.video.title} onClick={(e) => e.stopPropagation()}>
              <button ref={backBtn} className="app-back" onClick={() => setDetail(null)}><Icon name="back" />Back to feed</button>
              <div className="ui-thumb app-hero"><Thumb video={detail.video} /><em>{dur(detail.video)}</em></div>
              <h3>{detail.video.title}</h3>
              <p className="ui-sub">{detail.video.kind} · {detail.video.minutes} min · Fictional video</p>
              <p className="app-blurb">{detail.video.blurb}</p>
              {why(detail)}
              <div className="app-row">
                <button onClick={() => { more(detail); }}><Icon name="plus" />More like this</button>
                <button onClick={() => hide(detail)}><Icon name="x" />Not interested</button>
              </div>
            </div>
          </div>
        )}

        {sheet && (
          <div className="app-scrim" onClick={() => { setSheet(false); trigger.current?.focus(); }}>
            <div className="app-pop app-sheet" role="dialog" aria-labelledby="sd-sheet-h" onClick={(e) => e.stopPropagation()}>
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
            </div>
          </div>
        )}

        <div className="app-toast" role="status" aria-live="polite">
          {toast && <span key={toast.text}>{toast.text}{toast.undo && <button onClick={toast.undo}>Undo</button>}</span>}
        </div>
      </div>

      {panel && (
        <aside className="sd-panel" aria-label={`What the ${name} is doing`}>
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
      )}
    </div>
  );
}
