"use client";
import { useState } from "react";
import { thumbUrl, type Video } from "@/lib/sd/data";

/** Official YouTube thumbnail for a real video, loaded from YouTube's image host. Decorative: the title sits next to it. */
export default function Thumb({ video, size = "hq", className = "" }: { video: Pick<Video, "id">; size?: "hq" | "max"; className?: string }) {
  const [bad, setBad] = useState(false);
  if (bad) return <span className="ui-thumb-off" aria-hidden="true" />;
  return <img className={className} src={thumbUrl(video as Video, size)} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setBad(true)} />;
}
