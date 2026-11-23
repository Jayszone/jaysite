// A short sourced quotation with attribution and a link.
export default function Cite({ children, source, href, date }: { children: React.ReactNode; source: string; href: string; date: string }) {
  return (
    <figure className="ca-cite-q">
      <blockquote>{children}</blockquote>
      <figcaption>{source}, <a href={href} target="_blank" rel="noopener noreferrer">“AI for better care”<span className="sr-only"> (opens in a new tab)</span></a>, {date}</figcaption>
    </figure>
  );
}
