import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

const components = {
  PullQuote: ({ children }: { children: React.ReactNode }) => <blockquote className="pullquote">{children}</blockquote>,
  Note: ({ children }: { children: React.ReactNode }) => <p className="note" role="note">{children}</p>,
  Figure: ({ caption, src, alt }: { caption?: string; src?: string; alt?: string }) => (
    <figure className="figure">
      {src ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={src} alt={alt ?? ""} loading="lazy" style={{ width: "100%", display: "block" }} />
        : <div className="ph-fig">Image placeholder</div>}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  ),
};

export default function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />;
}
