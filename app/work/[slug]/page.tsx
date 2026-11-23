import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Frame from "@/components/Frame";
import Mdx from "@/components/Mdx";
import SharedDiscoveryCaseStudy from "@/components/sd/CaseStudy";
import ClaimsCaseStudy from "@/components/ca/ClaimsCaseStudy";
import { getProject, getProjects } from "@/lib/content";

// Projects with a fully custom, interactive page.
const CUSTOM: Record<string, () => React.ReactElement> = { "shared-discovery": SharedDiscoveryCaseStudy, "claims-appeals": ClaimsCaseStudy };

export const dynamicParams = false;
export function generateStaticParams() { return getProjects().map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: p.title, description: p.summary, openGraph: { title: p.title, description: p.summary } } : {};
}

export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const Custom = CUSTOM[p.slug];
  if (Custom) return <Custom />;
  const all = getProjects(); const next = all[(all.findIndex((x) => x.slug === p.slug) + 1) % all.length];
  return (
    <div className="col" style={p.accent ? ({ ["--ac" as string]: p.accent } as React.CSSProperties) : undefined}>
      <Link href="/" className="back">← Work</Link>
      <h1 className="h1">{p.title}{p.placeholder && <span className="ph">Placeholder</span>}</h1>
      <p className="lede">{p.summary.replace(/^PLACEHOLDER\.\s*/, "")}</p>
      <dl className="facts"><dt>Role</dt><dd>{p.role}</dd><dt>Year</dt><dd>{p.year}</dd><dt>Focus</dt><dd>{p.tags.join(" · ")}</dd></dl>
      <div className="stack" style={{ marginTop: "3rem" }}>
        <Frame src={p.image} alt={p.imageAlt || p.title} visual={p.visual} />
        <div className="prose"><Mdx source={p.body} /></div>
      </div>
      <Link href={`/work/${next.slug}`} className="next"><span>Next</span><b>{next.title} →</b></Link>
    </div>
  );
}
