"use client";
import { useState } from "react";
import { CIRCLES, TOPICS, person, topicLabel, type TopicId } from "@/lib/sd/data";

export default function CircleIntro() {
  const c = CIRCLES[0];
  const [sel, setSel] = useState<string | null>(null);
  // Circle pool = what the circle is exploring overall (members' interests plus recent shared exploration).
  const pool = TOPICS.map((t) => {
    const mean = c.members.reduce((s, id) => s + (person(id).interests[t.id] ?? 0), 0) / c.members.length;
    return { id: t.id, label: t.label, w: 0.65 * mean + 0.35 * (c.recent[t.id] ?? 0) };
  }).filter((t) => t.w > 0.06).sort((a, b) => b.w - a.w).slice(0, 11);
  const mine = sel ? person(sel).interests : null;
  return (
    <div className="sd-circle">
      <div className="sd-circle-head">
        <div><h3>{c.name}</h3><p>{c.members.length} people · Private · Invite only</p></div>
        <p className="sd-cap">Illustrative profiles for this design experiment. No real accounts.</p>
      </div>
      <ul className="sd-members" aria-label="Members of the circle">
        {c.members.map((id) => {
          const p = person(id);
          return (
            <li key={id}>
              <button aria-pressed={sel === id} onClick={() => setSel(sel === id ? null : id)} style={{ ["--h" as string]: p.hue }}>
                <span className="sd-me">{p.name[0]}</span><b>{p.name}</b><small>{p.tagline}</small>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="sd-pool">
        <h4>What the circle is exploring</h4>
        <ul>
          {pool.map((t) => {
            const lit = mine && (mine[t.id as TopicId] ?? 0) >= 0.25;
            return <li key={t.id} className={lit ? "lit" : mine ? "dim" : ""} style={{ ["--w" as string]: t.w }}>{t.label}</li>;
          })}
        </ul>
        <p className="sd-line" aria-live="polite">{sel ? `${person(sel).name} contributes ${Object.keys(person(sel).interests).filter((k) => (person(sel).interests[k as TopicId] ?? 0) >= 0.25).map((k) => topicLabel(k as TopicId).toLowerCase()).join(", ")}. Nobody sees a list of what ${person(sel).name} watched.` : "Select a member to see which subjects they add. The pool only shows subjects, never people's histories."}</p>
      </div>
      <div className="sd-isnt">
        <div><h4>A circle has</h4><ul><li>A name and a small, fixed set of people</li><li>A shared pool of subjects</li><li>A way to leave at any time</li></ul></div>
        <div><h4>A circle does not have</h4><ul><li>Follower or like counts</li><li>A timeline of what friends watched</li><li>Messages, posts or rankings</li></ul></div>
      </div>
    </div>
  );
}
