import type { ReactNode } from "react";
import ChannelPic from "./ChannelPic";
import channels from "@/lib/sd/channels.json";
import Thumb from "./Thumb";
import Portrait from "./Portrait";
import { Icon } from "./Fig";
import durations from "@/lib/sd/durations.json";
import { PEOPLE, type Video } from "@/lib/sd/data";
import type { Source } from "@/lib/sd/engine";

// Presentational pieces of the fictional "Watch" app, shared by the hero, the demos and the
// figures. The app is drawn in a fixed light palette, like a screenshot, so it reads the same in
// every site theme. The videos in it are real; the app, people and circles are not.

export const SOURCE_LABEL: Record<Source, string> = { personal: "For you", circle: "From your circle", explore: "New territory" };

/** Real running time, only when lib/sd/durations.json has it (see scripts/fetch-video-durations.mjs). */
export function dur(v: Pick<Video, "id">): string | null {
  const s = (durations as Record<string, number>)[v.id];
  if (!s) return null;
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}
export const Dur = ({ v }: { v: Pick<Video, "id"> }) => { const d = dur(v); return d ? <em>{d}</em> : null; };

/** A fictional person's illustrated portrait (falls back to the initial for anyone unknown). */
export function Avatar({ name, hue, className = "" }: { name: string; hue: number; className?: string }) {
  const p = PEOPLE.find((x) => x.name === name);
  return <span className={`ui-av ${p ? "has-pic" : ""} ${className}`} style={{ ["--h" as string]: hue }} aria-hidden="true">{p ? <Portrait id={p.id} /> : name[0]}</span>;
}

/** Channel avatar: the channel's real profile picture when lib/sd/channels.json has it, else a monogram. */
export function ChannelAv({ name }: { name: string }) {
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  const ini = name.replace(/[^\p{L}\p{N} ]/gu, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const url = (channels as Record<string, string>)[name];
  return <ChannelPic url={url} ini={ini} hue={h} />;
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

/** A static video card in the app's feed style. */
export function VCard({ video, source, tag }: { video: Video; source?: Source; tag?: ReactNode }) {
  return (
    <article className="ui-card">
      <div className="ui-thumb"><Thumb video={video} /><Dur v={video} /></div>
      <div className="ui-body">
        <ChannelAv name={video.channel} />
        <div className="ui-meta">
          <p className="ui-title">{video.title}</p>
          <p className="ui-sub">{video.channel}</p>
          {source && <Tag source={source}>{tag}</Tag>}
        </div>
      </div>
    </article>
  );
}
