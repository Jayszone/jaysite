"use client";
import { useMemo, useState } from "react";
import { Figure, Node } from "./Fig";
import Wires from "./Wires";
import Thumb from "./Thumb";
import { Dur, Tag } from "./AppUI";
import { topicLabel } from "@/lib/sd/data";
import { buildFeed, familiarity, sourceShare, type Source } from "@/lib/sd/engine";

const LABEL: Record<Source, string> = { personal: "Personal interests", circle: "Circle signals", explore: "Serendipity" };
const TAG: Record<Source, string> = { personal: "For you", circle: "From the circle", explore: "New territory" };
const ICON: Record<Source, string> = { personal: "user", circle: "people", explore: "spark" };
const ORDER: Source[] = ["personal", "circle", "explore"];
const HELP = {
  personal: ["Fewer of your usual topics", "More of your usual topics"],
  group: ["Less of what the circle explores", "More of what the circle explores"],
  explore: ["Mostly familiar subjects", "More unfamiliar subjects"],
} as const;

export default function MixViz() {
  const [m, setM] = useState({ personal: 0.5, group: 0.35, explore: 0.25 });
  const feed = useMemo(() => buildFeed({ userId: "alex", circleId: "rabbit-hole", mix: m, size: 8 }), [m]);
  const share = sourceShare(feed);
  const anchors = feed.filter((r) => familiarity("alex", r.video) >= 0.5).length;
  const slider = (k: keyof typeof m, label: string) => (
    <div className="sd-slider">
      <label htmlFor={`mix-${k}`}>{label}<output>{Math.round(m[k] * 100)}</output></label>
      <input id={`mix-${k}`} type="range" min={0} max={100} value={Math.round(m[k] * 100)} onChange={(e) => setM((x) => ({ ...x, [k]: Number(e.target.value) / 100 }))} />
      <small><span>{HELP[k][0]}</span><span>{HELP[k][1]}</span></small>
    </div>
  );
  return (
    <Figure caption="Conceptual tuning controls for this page. A real product would not hand these to users.">
      <div className="sd-mix">
        <div className="sd-mix-ctl">
          {slider("personal", "Personal relevance")}
          {slider("group", "Group influence")}
          {slider("explore", "Exploration")}
          <p className="sd-line">Previewing Alex's feed in The Rabbit Hole. Personal relevance never reaches zero: at least two videos always stay close to Alex's own interests (right now {anchors}).</p>
        </div>
        <div className="sd-mix-out">
          <div className="sd-stage sd-flow">
            <Wires wires={ORDER.map((s) => ({ a: s, b: "feed", live: share[s] > 0, dim: share[s] === 0, weight: share[s] }))} />
            <div className="sd-flow-src">
              {ORDER.map((s) => <Node key={s} id={s} icon={ICON[s]} label={LABEL[s]} note={`${Math.round(share[s] * 100)}%`} tone={share[s] > 0 ? "soft" : "faded"} />)}
            </div>
            <Node id="feed" icon="feed" label="Alex's feed" note={`${feed.length} videos`} tone="live" />
          </div>
          <ol className="sd-app sd-mini-list" data-mode="shared">
            {feed.map((r) => (
              <li key={r.video.id} className="ui-row">
                <div className="ui-thumb"><Thumb video={r.video} /><Dur v={r.video} /></div>
                <div className="ui-meta"><p className="ui-title">{r.video.title}</p><p className="ui-sub">{r.video.channel}</p><Tag source={r.source}>{TAG[r.source]}</Tag></div>
              </li>
            ))}
          </ol>
          <ul className="sd-legend sr-only">{ORDER.map((s) => <li key={s}>{LABEL[s]} {Math.round(share[s] * 100)}%</li>)}</ul>
        </div>
      </div>
    </Figure>
  );
}
