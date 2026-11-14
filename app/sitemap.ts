import type { MetadataRoute } from "next";
import { getArticles, getProjects } from "@/lib/content";
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/curiosities", "/thinking"].map((p) => ({ url: base + p }));
  return [...pages,
    ...getProjects().map((p) => ({ url: `${base}/work/${p.slug}` })),
    ...getArticles().map((a) => ({ url: `${base}/thinking/${a.slug}`, lastModified: a.date }))];
}
