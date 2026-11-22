"use client";
import { useMemo, useState } from "react";
import Thumb from "./Thumb";
import { topicLabel } from "@/lib/sd/data";
import { buildFeed, familiarity, sourceShare, type Source } from "@/lib/sd/engine";

const LABEL: Record<Source, string> = { personal: "Personal interests", circle: "Circle signals", explore: "Serendipity" };
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
  const Slider = ({ k, label }: { k: keyof typeof m; label: string }) => (
    <div className="sd-slider">
      <label htmlFor={`mix-${k}`}>{label}<output>{Math.round(m[k] * 100)}</output></label>
      <input id={`mix-${k}`} type="range" min={0} max={100} value={Math.round(m[k] * 100)} onChange={(e) => setM((x) => ({ ...x, [k]: Number(e.target.value) / 100 }))} />
      <small><span>{HELP[k][0]}</span><span>{HELP[k][1]}</span></small>
    </div>
  );
  return (
    <div className="sd-mix">
      <div className="sd-mix-ctl">
        <p className="sd-cap">Conceptual tuning controls for this page. A real product would not hand these to users.</p>
        <Slider k="personal" label="Personal relevance" />
        <Slider k="group" label="Group influence" />
        <Slider k="explore" label="Exploration" />
        <p className="sd-line">Previewing Alex's feed in The Rabbit Hole. Personal relevance never reaches zero: at least two videos always stay close to Alex's own interests (right now {anchors}).</p>
      </div>
      <div className="sd-mix-out">
        <div className="sd-mixbar big" role="img" aria-label={(["personal", "circle", "explore"] as Source[]).map((s) => `${Math.round(share[s] * 100)}% ${LABEL[s]}`).join(", ")}>
          {(["personal", "circle", "explore"] as Source[]).filter((s) => share[s] > 0).map((s) => <i key={s} className={`s-${s}`} style={{ flexGrow: share[s] }}><span>{`${Math.round(share[s] * 100)}%`}</span></i>)}
        </div>
        <ul className="sd-legend">{(["personal", "circle", "explore"] as Source[]).map((s) => <li key={s}><i className={`s-${s}`} />{LABEL[s]}</li>)}</ul>
        <ol className="sd-mini-list">
          {feed.map((r) => (
            <li key={r.video.id} className={`s-${r.source}`}>
              <div className="sd-thumb"><Thumb topic={r.video.topics[0]} variant={r.video.id.length} /></div>
              <div><p className="t">{r.video.title}</p><p className="m"><i className={`dot s-${r.source}`} />{LABEL[r.source]} · {topicLabel(r.video.topics[0])}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
