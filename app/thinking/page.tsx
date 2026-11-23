import type { Metadata } from "next";
import ArticleBrowser from "@/components/ArticleBrowser";
import { fmtDate, getArticles } from "@/lib/content";
export const metadata: Metadata = { title: "Tabula rasa", description: "A blank slate: space for new thinking." };

export default function Thinking() {
  const articles = getArticles().map(({ body: _b, ...a }) => ({ ...a, dateLabel: fmtDate(a.date) }));
  return (
    <div className="col">
      <h1 className="sh">Tabula rasa</h1>
      <p className="mute" style={{ marginTop: "2rem", maxWidth: "36rem" }}>Latin for “blank slate”: a wax tablet scraped clean so it can be written on again. I keep this space open on purpose. It is where I start from nothing and write down what I work out. The pieces below are placeholders until then.</p>
      <div style={{ marginTop: "3rem" }}><ArticleBrowser articles={articles} /></div>
    </div>
  );
}
