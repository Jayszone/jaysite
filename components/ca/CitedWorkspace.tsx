"use client";
import "./ca.css";
import { useEffect, useRef, useState } from "react";

// An illustrative analyst workspace: a claim exception, a question, a cited answer, and the source
// document with the exact passage highlighted. All SOPs, claim numbers and rules are fictional.
type Doc = { id: string; title: string; section: string; version: string; effective: string; updated: string; before: string[]; passage: string; after: string[] };
const DOCS: Doc[] = [
  { id: "SOP-114", title: "Network status on the date of service", section: "§4.2 Date of service", version: "Version 7", effective: "Jan 15, 2024", updated: "Feb 2, 2024",
    before: ["4.1 Scope. This procedure applies to professional and facility claims that fail the automated network check.", "Network status is recorded in the provider file with a start date and an end date for each participation agreement."],
    passage: "Network status is determined as of the date of service. A provider who was participating on that date is processed at the participating rate, even if the participation agreement has since ended.",
    after: ["4.3 Retroactive changes. If the provider file was corrected after the claim was received, reprocess the claim and note the correction in the case record.", "4.4 Documentation. Record the date of service, the network status found, and the agreement used."] },
  { id: "SOP-118", title: "Timely filing limits", section: "§2.1 Applicable limit", version: "Version 4", effective: "Jul 1, 2023", updated: "Jul 12, 2023",
    before: ["2.0 Purpose. This procedure explains how to find and apply the filing limit for a claim.", "Filing limits differ by contract, line of business and claim type."],
    passage: "The filing limit that applies is the one in the provider's contract on the date of service. Claims received after the limit are denied unless an exception in §2.4 applies.",
    after: ["2.2 Counting days. Count from the date of service to the date the claim was first received, not the date it was resubmitted.", "2.4 Exceptions. Coordination of benefits and retroactive eligibility changes may extend the limit."] },
  { id: "SOP-131", title: "Continuity of care", section: "§3.3 Ended agreements", version: "Version 2", effective: "Sep 1, 2023", updated: "Sep 20, 2023",
    before: ["3.1 Definition. An episode of care is a series of related services for one condition.", "3.2 Eligibility. Members receiving active treatment may qualify for continued access at in-network rates."],
    passage: "When a participation agreement ends during an episode of care, route the claim to senior review before final processing.",
    after: ["3.4 What senior review checks. Treatment dates, the member's condition, and whether a transition period was offered.", "3.5 Turnaround. Record the referral in the case notes so the analyst can follow its status."] },
];
const STEPS = [
  ["Use the provider's network status on the date of service, not today's status.", 0],
  ["Check the claim against the filing limit in the contract that applied on that date.", 1],
  ["If the agreement ended during treatment, send the claim to senior review before it is finalized.", 2],
] as const;

export default function CitedWorkspace() {
  const [active, setActive] = useState(0);
  const [decision, setDecision] = useState<null | "decided" | "escalated">(null);
  const docRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLElement>(null);
  const d = DOCS[active];

  useEffect(() => {
    const box = docRef.current, mark = markRef.current;
    if (!box || !mark) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({ top: Math.max(0, mark.offsetTop - 70), behavior: reduce ? "auto" : "smooth" });
  }, [active]);

  return (
    <figure className="ca-wrap">
      <div className="ca-app" role="group" aria-label="Illustrative claims workspace with a cited answer">
        <header className="ca-top">
          <span className="ca-brand"><i aria-hidden="true" />Claims workspace</span>
          <span className="ca-crumb">Exceptions <b aria-hidden="true">›</b> CLM-20417783</span>
          <span className={`ca-pill${decision ? " is-set" : ""}`} aria-live="polite">{decision === "decided" ? "Decision recorded by analyst" : decision === "escalated" ? "Sent to senior review" : "Needs analyst review"}</span>
        </header>
        <div className="ca-body">
          <aside className="ca-case" aria-label="Claim details">
            <h3>Exception</h3>
            <p className="ca-reason">Network status conflict</p>
            <dl>
              <div><dt>Date of service</dt><dd>Mar 12, 2024</dd></div>
              <div><dt>Service</dt><dd>Outpatient imaging</dd></div>
              <div><dt>Provider on that date</dt><dd>In network</dd></div>
              <div><dt>Provider today</dt><dd>Out of network</dd></div>
              <div><dt>Received</dt><dd>Apr 29, 2024</dd></div>
            </dl>
          </aside>

          <section className="ca-answer" aria-label="Question and answer">
            <p className="ca-q"><span>You asked</span>The provider was in network on the date of service but is out of network now. Which rate applies, and what do I check first?</p>
            <ol className="ca-steps">
              {STEPS.map(([t, n], i) => (
                <li key={i}>
                  <span>{t}</span>
                  <button className="ca-cite" aria-pressed={active === n} aria-label={`Source ${n + 1}: ${DOCS[n].id}, ${DOCS[n].section}`} onClick={() => setActive(n)}>{n + 1}</button>
                </li>
              ))}
            </ol>
            <div className="ca-srcs">
              <p className="ca-lab">Sources</p>
              {DOCS.map((s, i) => (
                <button key={s.id} className="ca-src" aria-pressed={active === i} onClick={() => setActive(i)}>
                  <b>{s.id}</b><span>{s.section}</span><em>{s.version} · effective {s.effective}</em>
                </button>
              ))}
            </div>
            <div className="ca-decide">
              <p>The assistant explains. You decide.</p>
              <div>
                <button onClick={() => setDecision("decided")} aria-pressed={decision === "decided"}>Process at participating rate</button>
                <button onClick={() => setDecision("escalated")} aria-pressed={decision === "escalated"}>Send to senior review</button>
              </div>
            </div>
          </section>

          <section className="ca-doc" aria-label={`Source document ${d.id}`}>
            <header>
              <b>{d.id}</b><span>{d.title}</span>
              <small>{d.version} · effective {d.effective} · updated {d.updated}</small>
            </header>
            <div className="ca-paper" ref={docRef} tabIndex={0} role="region" aria-label="Document text, scrollable">
              {d.before.map((p) => <p key={p}>{p}</p>)}
              <p className="ca-hit"><b>{d.section.replace("§", "")}. </b><mark ref={markRef}>{d.passage}</mark></p>
              {d.after.map((p) => <p key={p}>{p}</p>)}
              <p className="ca-fill">Section references in this document link to related procedures. Always confirm the member's plan type before applying a rate.</p>
            </div>
          </section>
        </div>
      </div>
      <figcaption>Illustrative. The claim, procedures and rules are fictional; the layout shows how a cited answer lets the analyst check the exact passage before deciding. Select a number or a source to open it.</figcaption>
    </figure>
  );
}
