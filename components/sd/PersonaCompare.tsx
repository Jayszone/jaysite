"use client";
import { useMemo, useState } from "react";
import Thumb from "./Thumb";
import { circle, person, topicLabel } from "@/lib/sd/data";
import { SHARED_MIX, buildFeed, sourceShare, type Source } from "@/lib/sd/engine";

const WHO = ["alex", "sam", "maya"];
const LABEL: Record<Source, string> = { personal: "For you", circle: "From the circle", explore: "New territory" };

export default function PersonaCompare() {
  const [who, setWho] = useState("alex");
  const feeds = useMemo(() => Object.fromEntries(WHO.map((id) => [id, buildFeed({ userId: id, circleId: "rabbit-hole", mix: SHARED_MIX, size: 8 })])), []);
  const mine = feeds[who];
  const share = sourceShare(mine);
  const others = WHO.filter((x) => x !== who);
  return (
    <div className="sd-compare">
      <div className="sd-tabs" role="radiogroup" aria-label="View the circle as">
        {WHO.map((id) => (
          <button key={id} role="radio" aria-checked={who === id} onClick={() => setWho(id)} style={{ ["--h" as string]: person(id).hue }}>
            <span className="sd-me">{person(id).name[0]}</span><b>{person(id).name}</b><small>{person(id).tagline}</small>
          </button>
        ))}
      </div>
      <div className="sd-compare-grid">
        <div className="sd-list" key={who}>
          <p className="sd-list-h">{person(who).name}'s feed · {circle("rabbit-hole").name}</p>
          {mine.slice(0, 6).map((r, i) => (
            <div className={`sd-row-card s-${r.source}`} key={r.video.id} style={{ ["--i" as string]: i }}>
              <div className="sd-thumb"><Thumb topic={r.video.topics[0]} variant={r.video.id.length} /></div>
              <div><p className="t">{r.video.title}</p><p className="m"><i className={`dot s-${r.source}`} />{LABEL[r.source]} · {r.reason.replace(/^(Your circle has been exploring|Because you watch|New territory, close to your interest in) /, "")}</p></div>
            </div>
          ))}
        </div>
        <div className="sd-side">
          <h3>Same circle, different feed</h3>
          <ul className="sd-overlap">
            {others.map((o) => {
              const n = mine.filter((r) => feeds[o].some((x) => x.video.id === r.video.id)).length;
              return <li key={o}><span>With {person(o).name}</span><b>{n} of {mine.length} videos in common</b></li>;
            })}
          </ul>
          <h3>Where {person(who).name}'s feed comes from</h3>
          <div className="sd-mixbar" role="img" aria-label={`${Math.round(share.personal * 100)}% for you, ${Math.round(share.circle * 100)}% from the circle, ${Math.round(share.explore * 100)}% new territory`}>
            {(["personal", "circle", "explore"] as Source[]).filter((s) => share[s] > 0).map((s) => <i key={s} className={`s-${s}`} style={{ flexGrow: share[s] }} />)}
          </div>
          <ul className="sd-legend">{(["personal", "circle", "explore"] as Source[]).map((s) => <li key={s}><i className={`s-${s}`} />{LABEL[s]} <b>{Math.round(share[s] * 100)}%</b></li>)}</ul>
          <p className="sd-line">Everyone in the circle shapes the pool. Each person gets a different slice of it, weighted by their own interests.</p>
        </div>
      </div>
    </div>
  );
}
