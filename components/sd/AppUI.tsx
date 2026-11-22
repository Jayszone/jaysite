import type { ReactNode } from "react";
import Thumb from "./Thumb";
import { Icon } from "./Fig";
import { topicLabel, type Video } from "@/lib/sd/data";
import type { Source } from "@/lib/sd/engine";

// Presentational pieces of the fictional "Watch" app, shared by the hero, the prototype and the
// comparison views. The app is drawn in a fixed light palette (like a screenshot), so it stays
// believable in every site theme.

export const SOURCE_LABEL: Record<Source, string> = { personal: "For you", circle: "From your circle", explore: "New territory" };

/** Fictional running time, e.g. 18:42, stable per video. */
export const dur = (v: Video) => `${v.minutes}:${String((v.id.length * 7 + v.minutes * 13) % 60).padStart(2, "0")}`;

export function Avatar({ name, hue, className = "" }: { name: string; hue: number; className?: string }) {
  return <span className={`ui-av ${className}`} style={{ ["--h" as string]: hue }} aria-hidden="true">{name[0]}</span>;
}

export function Chrome({ url }: { url: string }) {
  return (
    <div className="ui-chrome" aria-hidden="true">
      <span className="ui-dots"><i /><i /><i /></span>
      <span className="ui-url"><Icon name="lock" className="ui-url-ico" />{url}</span>
    </div>
  );
}

export function Brand() {
  return <span className="ui-brand"><i aria-hidden="true"><Icon name="play" /></i>Watch</span>;
}

export function Tag({ source, children }: { source: Source; children?: ReactNode }) {
  return <p className={`ui-tag s-${source}`}>{children ?? SOURCE_LABEL[source]}</p>;
}

/** A static video card: title card thumbnail, running time, title, subject line, optional source tag. */
export function VCard({ video, source, tag, extra }: { video: Video; source?: Source; tag?: ReactNode; extra?: ReactNode }) {
  return (
    <article className="ui-card">
      <div className="ui-thumb"><Thumb video={video} /><em>{dur(video)}</em></div>
      <div className="ui-meta">
        <p className="ui-title">{video.title}</p>
        <p className="ui-sub">{video.kind} · {topicLabel(video.topics[0])}</p>
        {source && <Tag source={source}>{tag}</Tag>}
        {extra}
      </div>
    </article>
  );
}
