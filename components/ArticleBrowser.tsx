"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

type A = { slug: string; title: string; summary: string; date: string; dateLabel: string; tags: string[]; readingTime: number; placeholder: boolean };

export default function ArticleBrowser({ articles }: { articles: A[] }) {
  const tags = useMemo(() => Array.from(new Set(articles.flatMap((a) => a.tags))).sort(), [articles]);
  const [tag, setTag] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const list = articles.filter((a) =>
    (!tag || a.tags.includes(tag)) &&
    (!q || (a.title + " " + a.summary + " " + a.tags.join(" ")).toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <div className="filters" role="group" aria-label="Filter by topic">
        <button aria-pressed={!tag} onClick={() => setTag(null)}>All</button>
        {tags.map((t) => <button key={t} aria-pressed={tag === t} onClick={() => setTag(tag === t ? null : t)}>{t}</button>)}
        <label><span className="sr-only">Search writing</span><input className="search" type="search" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} /></label>
      </div>
      <ul className="alist" aria-live="polite">
        {list.map((a) => (
          <li key={a.slug}>
            <Link href={`/thinking/${a.slug}`}>
              <h2>{a.title}{a.placeholder && <span className="ph">Placeholder</span>}</h2>
              <p>{a.summary}</p>
              <p className="meta"><time dateTime={a.date}>{a.dateLabel}</time> · {a.readingTime} min read</p>
            </Link>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="mute">Nothing matches that yet.</p>}
    </div>
  );
}
