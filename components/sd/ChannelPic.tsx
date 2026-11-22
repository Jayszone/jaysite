"use client";
import { useState } from "react";

/** Real channel picture with a monogram fallback if it is missing or fails to load. */
export default function ChannelPic({ url, ini, hue }: { url?: string; ini: string; hue: number }) {
  const [bad, setBad] = useState(false);
  if (url && !bad) return <span className="ui-chav has-pic" aria-hidden="true"><img src={url} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setBad(true)} /></span>;
  return <span className="ui-chav" style={{ ["--h" as string]: hue }} aria-hidden="true">{ini}</span>;
}
