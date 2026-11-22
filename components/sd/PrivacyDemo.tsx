"use client";
import { useState } from "react";
import { Figure, Node } from "./Fig";
import Wires from "./Wires";

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
      <div className="sd-priv-simple">
        <div className="sd-priv-text" aria-live="polite">
          <h3>{shared ? "You chose to enter" : "Private by default"}</h3>
          <ul>
            {(shared
              ? ["Entering requires an explicit choice, explained before anything happens.", "Activity inside this mode can add subjects to the circle's signal.", "No one gets a record of your searches or watch history.", "Leaving returns you to private browsing."]
              : ["Browsing stays private.", "Searches are not shared.", "Recommendations come from your own activity only."]
            ).map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </div>
    </Figure>
  );
}
