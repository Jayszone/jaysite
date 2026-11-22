"use client";
import { useState } from "react";
import { Figure, Node } from "./Fig";
import Wires from "./Wires";

type Cell = { on: boolean; text: string };
const ROWS: { what: string; personal: [Cell, Cell, Cell]; shared: [Cell, Cell, Cell] }[] = [
  { what: "Your searches",
    personal: [{ on: true, text: "Yes, privately" }, { on: false, text: "No" }, { on: false, text: "No" }],
    shared: [{ on: true, text: "Yes" }, { on: true, text: "As subjects only" }, { on: false, text: "No" }] },
  { what: "Videos you open",
    personal: [{ on: true, text: "Yes, privately" }, { on: false, text: "No" }, { on: false, text: "No" }],
    shared: [{ on: true, text: "Yes" }, { on: true, text: "As subjects only" }, { on: false, text: "No named record" }] },
  { what: "More like this, Not interested",
    personal: [{ on: true, text: "Yes, privately" }, { on: false, text: "No" }, { on: false, text: "No" }],
    shared: [{ on: true, text: "Yes" }, { on: true, text: "As a small nudge" }, { on: false, text: "No" }] },
  { what: "Earlier private browsing",
    personal: [{ on: true, text: "Yes, privately" }, { on: false, text: "No" }, { on: false, text: "No" }],
    shared: [{ on: true, text: "Yes, for you only" }, { on: false, text: "Never carried over" }, { on: false, text: "No" }] },
];
const COLS = ["Shapes your feed", "Shapes the circle's signal", "Visible to other members"];

export default function PrivacyDemo() {
  const [shared, setShared] = useState(false);
  return (
    <Figure caption="A design demonstration of intended behavior. This prototype does not read any real browsing data and is not a production privacy system.">
      <div className="sd-bar">
        <div className="sd-seg" role="group" aria-label="Browsing mode">
          <button aria-pressed={!shared} onClick={() => setShared(false)}>Personal Mode</button>
          <button aria-pressed={shared} onClick={() => setShared(true)}>Shared Discovery</button>
        </div>
      </div>
      <div className="sd-stage sd-priv-flow">
        <Wires wires={[
          { a: "act", b: "feed", live: true },
          { a: "act", b: "pool", live: shared, dim: !shared },
          { a: "pool", b: "others", live: shared, dim: !shared },
          { a: "act", b: "record", blocked: true },
        ]} />
        <Node id="feed" icon="feed" label="Your feed" note="your activity only" tone="live" />
        <Node id="act" icon="eye" label="Your activity" note="searches, opens, feedback" />
        <Node id="pool" icon="pool" label="Circle's pool" note={shared ? "subjects only" : "not connected"} tone={shared ? "soft" : "faded"} />
        <Node id="others" icon="people" label="Other members" note={shared ? "get subjects" : "get nothing"} tone={shared ? "soft" : "faded"} />
        <Node id="record" icon="eyeoff" label="A record of you" note="never created" tone="faded" />
      </div>
      <div className="sd-priv-grid">
        <div className="sd-priv-text" aria-live="polite">
          <h3>{shared ? "You chose to enter" : "Private by default"}</h3>
          <ul>
            {(shared
              ? ["Entering requires an explicit choice, explained before anything happens.", "Activity inside this mode can add subjects to the circle's signal.", "No one gets a record of your searches or watch history.", "Leaving returns you to private browsing."]
              : ["Browsing stays private.", "Searches are not shared.", "Recommendations come from your own activity only."]
            ).map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
        <div className="sd-table-wrap" role="region" aria-label="Activity table" tabIndex={0}>
          <table className="sd-table">
            <caption className="sr-only">What each kind of activity does in {shared ? "Shared Discovery" : "Personal Mode"}</caption>
            <thead><tr><th scope="col">Activity</th>{COLS.map((c) => <th scope="col" key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.what}>
                  <th scope="row">{r.what}</th>
                  {(shared ? r.shared : r.personal).map((c, i) => <td key={i} className={c.on ? "on" : "off"}><span aria-hidden="true">{c.on ? "●" : "○"}</span> {c.text}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Figure>
  );
}
