"use client";
import { useState } from "react";
import { Figure, Group, Node } from "./Fig";
import { Avatar } from "./AppUI";
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
    <Figure caption="Illustrative profiles for this design experiment. No real accounts.">
      <div className="sd-stack-fig">
        <Group label={`${c.name} · ${c.members.length} people · private`} accent>
          <ul className="sd-members" aria-label="Members of the circle">
            {c.members.map((id) => {
              const p = person(id);
              return (
                <li key={id}>
                  <Node onClick={() => setSel(sel === id ? null : id)} pressed={sel === id} label={p.name} note={p.tagline} tone={sel === id ? "live" : ""}>
                    <Avatar name={p.name} hue={p.hue} className="in-tile" />
                  </Node>
                </li>
              );
            })}
          </ul>
        </Group>
        <Group label="What the circle is exploring">
          <ul className="sd-pool">
            {pool.map((t) => {
              const on = mine && (mine[t.id as TopicId] ?? 0) >= 0.25;
              return <li key={t.id} className={on ? "lit" : mine ? "dim" : ""} style={{ ["--w" as string]: t.w }}>{t.label}</li>;
            })}
          </ul>
          <p className="sd-line" aria-live="polite">{sel ? `${person(sel).name} contributes ${Object.keys(person(sel).interests).filter((k) => (person(sel).interests[k as TopicId] ?? 0) >= 0.25).map((k) => topicLabel(k as TopicId).toLowerCase()).join(", ")}. Nobody sees a list of what ${person(sel).name} watched.` : "Select a member to see which subjects they add. The pool only shows subjects, never people's histories."}</p>
        </Group>
      </div>
    </Figure>
  );
}
