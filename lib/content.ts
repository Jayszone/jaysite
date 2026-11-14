import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");

export type Project = {
  slug: string; title: string; summary: string; year: string; role: string;
  tags: string[]; layers: string[]; order: number; placeholder: boolean; image: string; body: string;
};
export type Article = {
  slug: string; title: string; summary: string; date: string; tags: string[];
  featured: boolean; glyph: string; placeholder: boolean; readingTime: number; body: string;
};
export type Curiosity = { id: string; title: string; kicker: string; blurb: string; detail: string; link?: string };
export type TimelineEntry = {
  org: string; role: string; period: string; summary: string; kind: string; placeholder?: boolean;
};

function mdxFiles(dir: string) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => matter(fs.readFileSync(path.join(full, f), "utf8")));
}
const json = <T,>(f: string) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8")) as T;

export const getSite = () =>
  json<{ name: string; role: string; statement: string; intro: string; now: string; previously: string[];
    openTo: string; email: string; emailIsPlaceholder: boolean; timezone: string; place: string; resume: string; portrait: string;
    links: { label: string; href: string }[] }>("site.json");
export const getTimeline = () => json<{ note: string; entries: TimelineEntry[] }>("timeline.json");
export const getCuriosities = () => json<Curiosity[]>("curiosities.json");

export function getProjects(): Project[] {
  return mdxFiles("projects").map(({ data, content }) => ({
    slug: data.slug, title: data.title, summary: data.summary, year: String(data.year),
    role: data.role, tags: data.tags ?? [], layers: data.layers ?? [], order: data.order ?? 99,
    placeholder: !!data.placeholder, image: data.image ?? "", body: content,
  })).sort((a, b) => a.order - b.order);
}
export const getProject = (slug: string) => getProjects().find((p) => p.slug === slug);

export function getArticles(): Article[] {
  return mdxFiles("articles").filter(({ data }) => !data.draft).map(({ data, content }) => ({
    slug: data.slug, title: data.title, summary: data.summary, date: String(data.date),
    tags: data.tags ?? [], featured: !!data.featured, glyph: data.glyph ?? "compass",
    placeholder: !!data.placeholder,
    readingTime: Math.max(1, Math.round(content.split(/\s+/).length / 210)), body: content,
  })).sort((a, b) => b.date.localeCompare(a.date));
}
export const getArticle = (slug: string) => getArticles().find((a) => a.slug === slug);

export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
    .format(new Date(iso));

export type Lens = { src?: string; alt: string; x: string; y: string; w: string; ar: string; s: number };
export const getLenses = () => json<Lens[]>("lenses.json");
