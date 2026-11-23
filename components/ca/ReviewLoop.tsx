"use client";
import "./ca.css";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { CASE, OUTCOMES, QUESTIONS, SRC, type OutcomeKey } from "./data";

// Visual 2: a focused human + AI review loop. The citation is the interaction that matters:
// opening one draws a line from the answer to the exact passage in the source document.
const RETRIEVE = ["Searching guidance", "Ranking by relevance", "Writing a cited answer"];
const STAGES = ["Analyst question", "AI-assisted guidance", "Human review"];
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ReviewLoop() {
  const [stage, setStage] = useState(1);
  const [q, setQ] = useState<number | null>(null);
  const [sub, setSub] = useState(0); // retrieval progress 0..3
  const [open, setOpen] = useState<number | null>(null); // answer step whose citation is open
  const [outcome, setOutcome] = useState<OutcomeKey | null>(null);
  const [line, setLine] = useState<{ d: string; a: [number, number]; b: [number, number] } | null>(null);
  const body = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ready = q !== null && sub >= RETRIEVE.length;
  const Q = q !== null ? QUESTIONS[q] : null;
  const cur = Q && open !== null ? Q.steps[open] : null;
  const src = cur ? SRC[cur.cite[0]] : null;

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);

  const pick = (i: number) => {
    clear(); setQ(i); setOpen(null); setOutcome(null); setStage(2);
    if (reduced()) { setSub(RETRIEVE.length); return; }
    setSub(0);
    RETRIEVE.forEach((_, k) => timers.current.push(setTimeout(() => setSub(k + 1), 480 * (k + 1))));
  };
  const replay = () => { clear(); setStage(1); setQ(null); setSub(0); setOpen(null); setOutcome(null); setLine(null); };

  // Connector line from the open citation to its highlighted passage (wide screens only).
  const measure = useCallback(() => {
    const host = body.current;
    const chip = host?.querySelector<HTMLElement>("[data-chip][aria-pressed='true']");
    const hit = host?.querySelector<HTMLElement>("[data-hit]");
    if (!host || !chip || !hit || window.innerWidth < 960) { setLine(null); return; }
    const h = host.getBoundingClientRect(), a = chip.getBoundingClientRect(), b = hit.getBoundingClientRect(), p = paper.current?.getBoundingClientRect();
    if (p && (b.top < p.top || b.bottom > p.bottom)) { setLine(null); return; }
    const ans = chip?.closest<HTMLElement>(".rl-ans")?.getBoundingClientRect(); const x1 = (ans ? ans.right : a.right) - h.left, y1 = a.top + a.height / 2 - h.top, x2 = b.left - h.left, y2 = b.top + Math.min(b.height / 2, 24) - h.top;
    const k = Math.max(30, (x2 - x1) / 2);
    setLine({ d: `M${x1} ${y1} C${x1 + k} ${y1} ${x2 - k} ${y2} ${x2} ${y2}`, a: [x1, y1], b: [x2, y2] });
  }, []);
  useLayoutEffect(() => {
    measure();
    const el = paper.current; el?.addEventListener("scroll", measure);
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 380);
    return () => { el?.removeEventListener("scroll", measure); window.removeEventListener("resize", measure); clearTimeout(t); };
  }, [measure, open, q, ready, stage]);
  useEffect(() => {
    const mark = paper.current?.querySelector<HTMLElement>("[data-hit]");
    if (mark && paper.current) paper.current.scrollTo({ top: Math.max(0, mark.offsetTop - 60), behavior: reduced() ? "auto" : "smooth" });
  }, [open, q]);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <figure className="rl-wrap">
          <div className="rl ca-canvas" role="group" aria-label="Interactive demonstration: an analyst, an AI assistant and a review decision">
            <ol className="rl-rail">
              {STAGES.map((s, i) => {
                const n = i + 1, on = stage === n, done = stage > n, can = n === 1 || (n === 2 && q !== null) || (n === 3 && ready);
                return (
                  <li key={s} className={`${on ? "is-on" : ""}${done ? " is-done" : ""}`}>
                    <button disabled={!can} aria-current={on ? "step" : undefined} onClick={() => setStage(n)}>
                      <span className="rl-n">0{n}</span><span className="rl-t">{s}</span>
                    </button>
                  </li>
                );
              })}
              <li className="rl-replay"><button onClick={replay}>Replay</button></li>
            </ol>

            <div className="rl-body" ref={body}>
              <div className="rl-main">
                <div className="rl-case"><span className="ca-lab">Claim exception · illustrative</span><b>{CASE.reason}</b><span>Date of service {CASE.dos} · {CASE.service} · provider {CASE.then.toLowerCase()} then, {CASE.now.toLowerCase()} now</span></div>

                {q === null && (
                  <div className="rl-ask">
                    <p className="ca-lab">Select the analyst's question</p>
                    <ul>
                      {QUESTIONS.map((x, i) => <li key={x.q}><button onClick={() => pick(i)}><span>{x.q}</span><i aria-hidden="true">→</i></button></li>)}
                    </ul>
                  </div>
                )}

                {Q && (
                  <div className="rl-flow">
                    <p className="rl-q"><span className="ca-lab">Analyst asks</span>{Q.q}</p>
                    {!ready && (
                      <ol className="rl-ret" aria-live="polite">
                        {RETRIEVE.map((r, k) => <li key={r} className={sub > k ? "is-done" : sub === k ? "is-now" : ""}><i aria-hidden="true" />{r}</li>)}
                      </ol>
                    )}
                    <AnimatePresence>
                      {ready && (
                        <m.div className="rl-ans" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                          <p className="rl-flag"><i aria-hidden="true" />Draft for analyst validation. Not a decision.</p>
                          <ol>
                            {Q.steps.map((s, i) => (
                              <li key={s.text}>
                                <span>{s.text}</span>
                                <button data-chip aria-pressed={open === i} aria-label={`Open source ${i + 1}: ${SRC[s.cite[0]].id}, section ${SRC[s.cite[0]].paras[s.cite[1]].n}`} onClick={() => setOpen(open === i ? null : i)}>{i + 1}</button>
                              </li>
                            ))}
                          </ol>
                          {stage < 3 && <button className="rl-next" onClick={() => setStage(3)}>Review the sources</button>}
                        </m.div>
                      )}
                    </AnimatePresence>
                    {stage === 3 && ready && (
                      <m.div className="rl-review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                        <p className="ca-lab">Your review. The decision is yours.</p>
                        <div role="group" aria-label="Review outcome">
                          {(Object.keys(OUTCOMES) as OutcomeKey[]).map((k) => <button key={k} aria-pressed={outcome === k} onClick={() => setOutcome(k)}>{OUTCOMES[k].label}</button>)}
                        </div>
                        <p className="rl-res" aria-live="polite">{outcome ? <><b>{OUTCOMES[outcome].label}.</b> {OUTCOMES[outcome].note} Recorded by the analyst.</> : "Open a citation, read the passage, then choose an outcome."}</p>
                      </m.div>
                    )}
                  </div>
                )}
              </div>

              <aside className="rl-src" aria-label="Source document">
                {!ready && (
                  <div className="rl-kb">
                    <p className="ca-lab">Knowledge base</p>
                    <ul>{SRC.map((s, i) => <li key={s.id} className={q !== null && sub > i ? "is-lit" : ""}><b>{s.id}</b><span>{s.title}</span><em>{s.type} · {s.pages} · {s.version}</em></li>)}</ul>
                  </div>
                )}
                {ready && !src && (
                  <div className="rl-kb">
                    <p className="ca-lab">Retrieved guidance</p>
                    <ul>{[...new Set(Q!.steps.map((s) => s.cite[0]))].map((i) => <li key={i} className="is-lit"><b>{SRC[i].id}</b><span>{SRC[i].title}</span><em>{SRC[i].version} · effective {SRC[i].effective}</em></li>)}</ul>
                    <p className="rl-hint">Select a number in the answer to open its source.</p>
                  </div>
                )}
                {ready && src && cur && (
                  <div className="rl-doc">
                    <header>
                      <b>{src.id}</b><span>{src.title}</span>
                      <dl><div><dt>Section</dt><dd>{src.paras[cur.cite[1]].n}</dd></div><div><dt>Version</dt><dd>{src.version}</dd></div><div><dt>Effective</dt><dd>{src.effective}</dd></div><div><dt>Updated</dt><dd>{src.updated}</dd></div></dl>
                    </header>
                    <div className="rl-paper" ref={paper} tabIndex={0} role="region" aria-label="Source text, scrollable">
                      {src.paras.map((p, i) => i === cur.cite[1]
                        ? <p key={p.n} className="is-hit"><b>{p.n}. </b><mark data-hit>{p.text}</mark></p>
                        : <p key={p.n}><b>{p.n}. </b>{p.text}</p>)}
                    </div>
                  </div>
                )}
              </aside>
              {line && <svg className="rl-line" aria-hidden="true"><path d={line.d} /><circle r="3.5" cx={line.a[0]} cy={line.a[1]} /><circle r="3.5" cx={line.b[0]} cy={line.b[1]} /></svg>}
            </div>
          </div>
          <figcaption>Illustrative. The claim, procedures and rules are fictional. The assistant retrieves and explains; the analyst checks the cited passage and decides.</figcaption>
        </figure>
      </MotionConfig>
    </LazyMotion>
  );
}
