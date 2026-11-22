"use client";
import { useMemo, useState } from "react";
import { Figure, Node } from "./Fig";
import { Avatar, SOURCE_LABEL, Tag, dur } from "./AppUI";
import Thumb from "./Thumb";
import { circle, person, topicLabel } from "@/lib/sd/data";
import { SHARED_MIX, buildFeed, sourceShare, type Source } from "@/lib/sd/engine";

const WHO = ["alex", "sam", "maya"];
const ORDER: Source[] = ["personal", "circle", "explore"];

export default function PersonaCompare() {
  const [who, setWho] = useState("alex");
  const feeds = useMemo(() => Object.fromEntries(WHO.map((id) => [id, buildFeed({ userId: id, circleId: "rabbit-hole", mix: SHARED_MIX, size: 8 })])), []);
  const mine = feeds[who];
  const share = sourceShare(mine);
  const others = WHO.filter((x) => x !== who);
  return (
    <Figure caption="Three members of one circle, three different feeds. Fictional people and videos.">
      <div className="sd-who" role="radiogroup" aria-label="View the circle as">
        {WHO.map((id) => (
          <Node key={id} onClick={() => setWho(id)} pressed={who === id} tone={who === id ? "live" : ""} label={person(id).name} note={person(id).tagline}>
            <Avatar name={person(id).name} hue={person(id).hue} className="in-tile" />
          </Node>
        ))}
      </div>
      <div className="sd-compare-grid">
        <div className="sd-app sd-listcard" data-mode="shared" key={who}>
          <p className="ui-listh">{person(who).name}'s feed · {circle("rabbit-hole").name}</p>
          {mine.slice(0, 6).map((r, i) => (
            <div className="ui-row app-card" key={r.video.id} style={{ ["--i" as string]: i }}>
              <div className="ui-thumb"><Thumb video={r.video} /><em>{dur(r.video)}</em></div>
              <div className="ui-meta">
                <p className="ui-title">{r.video.title}</p>
                <p className="ui-sub">{topicLabel(r.video.topics[0])}</p>
                <Tag source={r.source}>{SOURCE_LABEL[r.source]} · {r.reason.replace(/^(Your circle has been exploring|Because you watch|New territory, close to your interest in) /, "")}</Tag>
              </div>
            </div>
          ))}
        </div>
        <div className="sd-side">
          <h3>Same circle, different feed</h3>
          <ul className="sd-overlap">
            {others.map((o) => {
              const n = mine.filter((r) => feeds[o].some((x) => x.video.id === r.video.id)).length;
              return <li key={o}><span>With {person(o).name}</span><b>{n} of {mine.length} in common</b></li>;
            })}
          </ul>
          <h3>Where {person(who).name}'s feed comes from</h3>
          <div className="sd-mixbar" role="img" aria-label={`${Math.round(share.personal * 100)}% for you, ${Math.round(share.circle * 100)}% from the circle, ${Math.round(share.explore * 100)}% new territory`}>
            {ORDER.filter((s) => share[s] > 0).map((s) => <i key={s} className={`s-${s}`} style={{ flexGrow: share[s] }} />)}
          </div>
          <ul className="sd-legend">{ORDER.map((s) => <li key={s}><i className={`s-${s}`} />{SOURCE_LABEL[s]} <b>{Math.round(share[s] * 100)}%</b></li>)}</ul>
          <p className="sd-line">Everyone in the circle shapes the pool. Each person gets a different slice of it, weighted by their own interests.</p>
        </div>
      </div>
    </Figure>
  );
}
