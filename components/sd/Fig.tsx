import type { ReactNode } from "react";

// Shared "node and wire" figure kit: a dot-grid canvas, uniform tiles with a stroke icon,
// framed groups with the label on the border. Wires are drawn by <Wires> (client side).

const P = (d: string) => <path d={d} />;
export const ICONS: Record<string, ReactNode> = {
  ai: <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" rx=".8" />{P("M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3")}</>,
  tech: <><rect x="3" y="4" width="18" height="12" rx="2" />{P("M8 20h8M12 16v4")}</>,
  design: <>{P("M4 20l1-4L16 5l3 3L8 19z")}{P("M14 7l3 3")}</>,
  arch: <>{P("M3 9l9-5 9 5M5.5 9.5v8M10 9.5v8M14 9.5v8M18.5 9.5v8M3 20h18")}</>,
  hist: <><circle cx="12" cy="12" r="8.5" />{P("M12 7v5l3 2")}</>,
  urban: <>{P("M3 20V10h5v10M8 20V5h6v15M14 20v-8h7v8M3 20h18")}</>,
  phil: <>{P("M9 21h6M10 18h4")}{P("M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z")}</>,
  bio: <>{P("M5 19c0-8 5-14 15-14 0 10-6 15-14 15")}{P("M5 19c3-5 6-8 10-10")}</>,
  psy: <>{P("M9 21v-4.2A7 7 0 1 1 18 11l1.5 2.5-1.7.8V17h-3.3v4")}{P("M11 10.5a2 2 0 1 1 2 2")}</>,
  user: <><circle cx="12" cy="8" r="4" />{P("M4 21c.8-4 4-6 8-6s7.2 2 8 6")}</>,
  people: <><circle cx="9" cy="8.5" r="3.5" /><circle cx="17" cy="9.5" r="2.5" />{P("M2.5 20c.6-3.5 3.2-5.5 6.5-5.5s5.9 2 6.5 5.5M16 14.7c2.7 0 4.7 1.6 5.5 4.8")}</>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2" />{P("M8 10.5V8a4 4 0 0 1 8 0v2.5")}</>,
  eye: <>{P("M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12z")}<circle cx="12" cy="12" r="2.8" /></>,
  eyeoff: <>{P("M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12z")}<circle cx="12" cy="12" r="2.8" />{P("M4 4l16 16")}</>,
  play: <><rect x="3" y="5" width="18" height="14" rx="3" />{P("M10.5 9.5v5l4-2.5z")}</>,
  spark: <>{P("M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 17v4M17 19h4")}</>,
  heart: <>{P("M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.5 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z")}</>,
  chat: <>{P("M4 5h16v11H9l-5 4z")}</>,
  follow: <><circle cx="10" cy="8" r="4" />{P("M3 21c.8-4 3.5-6 7-6M18 14v6M15 17h6")}</>,
  compass: <><circle cx="12" cy="12" r="9" />{P("M15.5 8.5l-2 5-5 2 2-5z")}</>,
  feed: <><rect x="4" y="4" width="16" height="7" rx="1.5" /><rect x="4" y="13" width="16" height="7" rx="1.5" /></>,
  pool: <><ellipse cx="12" cy="6" rx="7" ry="3" />{P("M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6")}</>,
  scale: <>{P("M12 4v16M5 20h14M5 8h14M5 8l-2.5 6a3 3 0 0 0 5 0zM19 8l-2.5 6a3 3 0 0 0 5 0z")}</>,
  flask: <>{P("M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7.5 15h9")}</>,
  door: <>{P("M6 21V4h9v17M3 21h18M12 12.5v.01")}</>,
  star: <>{P("M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z")}</>,
  more: <><circle cx="6" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="18" cy="12" r="1" /></>,
  search: <><circle cx="11" cy="11" r="6.5" />{P("M16 16l5 5")}</>,
  back: <>{P("M15 5l-7 7 7 7")}</>,
  plus: <>{P("M12 5v14M5 12h14")}</>,
  x: <>{P("M6 6l12 12M18 6L6 18")}</>,
  check: <>{P("M5 12.5l4.5 4.5L19 7.5")}</>,
  link: <>{P("M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1")}</>,
  shuffle: <>{P("M3 7h3.5c3 0 4.5 2 6 5s3 5 6 5H21M3 17h3.5c1.6 0 2.7-.6 3.6-1.6M21 7h-2.5c-1.6 0-2.7.6-3.6 1.6M18 4l3 3-3 3M18 14l3 3-3 3")}</>,
  scale2: <>{P("M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4")}</>,
};
export function Icon({ name, className = "sd-ico" }: { name: string; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">{ICONS[name] ?? null}</svg>;
}

/** The canvas: white-ish, dot grid, thin border. A quiet mono caption sits underneath. */
export function Figure({ children, caption, className = "", wide = true }: { children: ReactNode; caption?: ReactNode; className?: string; wide?: boolean }) {
  return (
    <figure className={`sd-fig${wide ? " sd-wide" : ""} ${className}`}>
      <div className="sd-canvas">{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

type Tone = "" | "live" | "faded" | "dash" | "soft";
/** A uniform rounded-square node. `live` is the solid accent tile; `faded` is the dashed, failing one. */
export function Node({ id, icon, label, note, tone = "", onClick, pressed, children, title }: {
  id?: string; icon?: string; label: string; note?: string; tone?: Tone; onClick?: () => void; pressed?: boolean; children?: ReactNode; title?: string;
}) {
  const inner = (
    <>
      <span className="sd-tile">{children ?? (icon ? <Icon name={icon} /> : null)}</span>
      <span className="sd-nl">{label}</span>
      {note && <span className="sd-nc">{note}</span>}
    </>
  );
  const cls = `sd-node${tone ? ` is-${tone}` : ""}`;
  return onClick
    ? <button type="button" className={cls} data-n={id} aria-pressed={pressed} onClick={onClick} title={title}>{inner}</button>
    : <div className={cls} data-n={id} title={title}>{inner}</div>;
}

/** A framed group. The label sits on the border. `accent` is solid; default is dashed grey. */
export function Group({ label, accent = false, children, className = "" }: { label: string; accent?: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={`sd-group${accent ? " is-accent" : ""} ${className}`} role="group" aria-label={label}>
      <span className="sd-group-l">{label}</span>
      {children}
    </div>
  );
}

export const Meta = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="sd-metaRow"><dt>{label}</dt><dd>{children}</dd></div>
);
