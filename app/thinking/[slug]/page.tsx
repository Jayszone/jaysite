import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Mdx from "@/components/Mdx";
import { fmtDate, getArticle, getArticles } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() { return getArticles().map((a) => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getArticle((await params).slug);
  return a ? { title: a.title, description: a.summary, keywords: a.tags,
    openGraph: { type: "article", title: a.title, description: a.summary, publishedTime: a.date, tags: a.tags } } : {};
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  return (
    <article className="col">
      <div className="progress" aria-hidden="true" />
      <Link href="/thinking" className="back">← All writing</Link>
      <h1 className="h1">{a.title}</h1>
      <p className="lede sans"><time dateTime={a.date}>{fmtDate(a.date)}</time> · {a.readingTime} min read{a.placeholder && <span className="ph">Placeholder</span>}</p>
      <div className="prose" style={{ marginTop: "3rem" }}><Mdx source={a.body} /></div>
    </article>
  );
}
