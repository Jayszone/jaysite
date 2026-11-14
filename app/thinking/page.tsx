import type { Metadata } from "next";
import ArticleBrowser from "@/components/ArticleBrowser";
import { fmtDate, getArticles } from "@/lib/content";
export const metadata: Metadata = { title: "Thinking", description: "Essays, notes and open questions." };

export default function Thinking() {
  const articles = getArticles().map(({ body: _b, ...a }) => ({ ...a, dateLabel: fmtDate(a.date) }));
  return (
    <div className="col">
      <h1 className="sh">Thinking</h1>
      <p className="mute" style={{ marginTop: "2rem", maxWidth: "36rem" }}>Essays and notes on building, business and ideas.</p>
      <div style={{ marginTop: "3rem" }}><ArticleBrowser articles={articles} /></div>
    </div>
  );
}
