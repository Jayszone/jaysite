"use client";
import "./ca.css";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, LazyMotion, MotionConfig, domMax, m } from "motion/react";
import { CASE, QUESTIONS, SRC, OUTCOMES, type OutcomeKey } from "./data";

// Visual 1: the same exception worked two ways. The documents that sprawl across the manual
// investigation fold into a short list of sources behind a cited answer.
const BEFORE = ["Exception appears", "Search the knowledge base", "Open the documents that return", "Find the passage by reading", "Check which version applies", "Interpret it, then decide"];
const AFTER = ["Ask the question", "Assistant retrieves guidance", "Answer with citations", "Verify the source passage", "Decide or escalate"];
const MORE = [
  { id: "SOP-114", title: "Network status on the date of service", type: "PDF", pages: "38 pp", version: "v7" },
  { id: "SOP-114", title: "Network status on the date of service", type: "PDF", pages: "36 pp", version: "v6", old: true },
  { id: "SOP-118", title: "Timely filing limits", type: "DOCX", pages: "12 pp", version: "v4" },
  { id: "SOP-131", title: "Continuity of care", type: "PDF", pages: "21 pp", version: "v2" },
  { id: "KB-209", title: "Provider contract lookup guide", type: "HTML", pages: "9 pp", version: "v3" },
  { id: "KB-044", title: "Rate exceptions reference", type: "XLSX", pages: "6 sheets", version: "v11" },
];
const PICK: Record<number, number> = { 0: 0, 2: 1, 3: 2 }; // before row -> after source (shared transition)
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function WorkflowCompression() {
  const [mode, setMode] = useState<"before" | "after">("before");
  const [step, setStep] = useState(0);
  const [outcome, setOutcome] = useState<OutcomeKey | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const auto = useRef(true);
  const started = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const steps = mode === "before" ? BEFORE : AFTER;
  const Q = QUESTIONS[0];

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const run = (to: "before" | "after") => {
    setMode(to); setOutcome(null);
    const n = (to === "before" ? BEFORE : AFTER).length;
    if (reduced()) { setStep(n - 1); return; }
    setStep(0);
    for (let i = 1; i < n; i++) timers.current.push(setTimeout(() => setStep(i), 520 * i));
  };
  const choose = (to: "before" | "after") => { auto.current = false; clear(); run(to); };
  const replay = () => {
    auto.current = false; clear(); run("before");
    if (!reduced()) timers.current.push(setTimeout(() => run("after"), 520 * BEFORE.length + 900));
    else run("after");
  };
  useEffect(() => {
    run("before");
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current && auto.current && !reduced()) {
        started.current = true;
        timers.current.push(setTimeout(() => { if (auto.current) run("after"); }, 520 * BEFORE.length + 700));
      }
    }, { threshold: 0.5 });
    io.observe(root.current!);
    return () => { io.disconnect(); clear(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 32 }}>
        <LayoutGroup id="wf">
          <figure className="wf-wrap">
            <div className="wf ca-canvas" ref={root} data-mode={mode} role="group" aria-label="Before and after: the same claim exception, worked manually and with the assistant">
              <header className="wf-top">
                <p className="ca-lab">One exception, two ways of working</p>
                <div className="wf-ctl">
                  <div className="wf-seg" role="group" aria-label="Workflow">
                    <button aria-pressed={mode === "before"} onClick={() => choose("before")}>{mode === "before" && <m.i layoutId="wfpill" className="wf-pill" />}<span>Before · manual</span></button>
                    <button aria-pressed={mode === "after"} onClick={() => choose("after")}>{mode === "after" && <m.i layoutId="wfpill" className="wf-pill" />}<span>After · assisted</span></button>
                  </div>
                  <button className="wf-replay" onClick={replay}>Replay</button>
                </div>
              </header>

              <ol className="wf-rail" aria-label={mode === "before" ? "Manual investigation steps" : "Assisted investigation steps"}>
                {steps.map((s, i) => <li key={s} className={i < step ? "is-done" : i === step ? "is-now" : ""}><i aria-hidden="true">{i + 1}</i><span>{s}</span></li>)}
              </ol>

              <div className="wf-body">
                <m.div layout="position" layoutId="wfcase" className="wf-case">
                  <span className="ca-lab">Claim exception</span>
                  <b>{CASE.reason}</b>
                  <dl><div><dt>Date of service</dt><dd>{CASE.dos}</dd></div><div><dt>Service</dt><dd>{CASE.service}</dd></div><div><dt>Provider then</dt><dd>{CASE.then}</dd></div><div><dt>Provider now</dt><dd>{CASE.now}</dd></div></dl>
                </m.div>

                <AnimatePresence mode="popLayout" initial={false}>
                  {mode === "before" ? (
                    <m.div key="b" className="wf-before" exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.28 } }}>
                      <div className="wf-search"><span aria-hidden="true">⌕</span>network status date of service<em>keyword search</em></div>
                      <ul className="wf-docs" aria-label="Search results: whole documents">
                        {MORE.map((d, i) => (
                          <m.li key={d.id + d.version} layoutId={i in PICK ? `src${PICK[i]}` : undefined} className={d.old ? "is-old" : ""}>
                            <span className="wf-type">{d.type}</span><b>{d.id}</b><span className="wf-t">{d.title}</span><em>{d.pages} · {d.version}</em>
                          </m.li>
                        ))}
                      </ul>
                      <ul className="wf-notes">
                        <li>Search returns whole documents, from 2 to 80 pages each</li>
                        <li>A complex claim can need 4 to 10 of them</li>
                        <li>Two versions of the same procedure disagree</li>
                        <li>The relevant passage has to be found by reading</li>
                      </ul>
                    </m.div>
                  ) : (
                    <m.div key="a" className="wf-after" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                      <div className="wf-answer">
                        <p className="wf-q"><span className="ca-lab">Analyst asks</span>{Q.q}</p>
                        <ol>{Q.steps.map((s, i) => <li key={s.text}><span>{s.text}</span><i aria-hidden="true">{i + 1}</i></li>)}</ol>
                        <p className="wf-flag"><i aria-hidden="true" />Draft for analyst validation. Not a decision.</p>
                      </div>
                      <div className="wf-verify">
                        <p className="ca-lab">Verify the source</p>
                        <div className="wf-srcs">
                          {[0, 1, 2].map((i) => <m.span key={i} layoutId={`src${i}`} className="wf-chip"><b>{SRC[i].id}</b><em>{SRC[i].version} · effective {SRC[i].effective}</em></m.span>)}
                        </div>
                        <blockquote><mark>{SRC[0].paras[1].text}</mark><cite>SOP-114 · section 4.2</cite></blockquote>
                        <div className="wf-dec" role="group" aria-label="Analyst decision">
                          {(Object.keys(OUTCOMES) as OutcomeKey[]).map((k) => <button key={k} aria-pressed={outcome === k} onClick={() => setOutcome(k)}>{OUTCOMES[k].label}</button>)}
                        </div>
                        <p className="wf-note" aria-live="polite">{outcome ? `${OUTCOMES[outcome].note} The analyst decides.` : "The analyst verifies the passage and makes the call."}</p>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
              <p className="wf-foot">{mode === "before" ? "Every step here is a person reading, comparing and deciding what applies." : "Fewer manual steps to locate and verify applicable guidance. Verification, senior review and the decision stay with people."}</p>
            </div>
            <figcaption>Illustrative. The claim, documents and rules are fictional. Select Before or After, or replay the transformation.</figcaption>
          </figure>
        </LayoutGroup>
      </MotionConfig>
    </LazyMotion>
  );
}
