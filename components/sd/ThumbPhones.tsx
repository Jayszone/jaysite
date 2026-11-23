"use client";
import "./sd.css";
import { useEffect, useRef, useState } from "react";
import { PhoneFrame, PhoneScreen } from "./Phone";
import { video } from "@/lib/sd/data";

// Work-index thumbnail for Shared Discovery: the same app on two phones, Personal and Shared.
// Scaled to fit whatever width the card has.
const PERSONAL = ["aircAruvnKk", "0OyhASRR0To"].map(video);
const SHARED = ["gFP-7Z9HLww", "_IOPlGPQPuM"].map(video);
const W = 520, H = 462;

export default function ThumbPhones() {
  const box = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(1);
  useEffect(() => {
    const el = box.current!;
    const ro = new ResizeObserver(() => setS(Math.min(1.02, el.clientWidth / W)));
    ro.observe(el); setS(Math.min(1.02, el.clientWidth / W));
    return () => ro.disconnect();
  }, []);
  return (
    <div className="sd sd-mini" ref={box} style={{ height: H * s }} role="img" aria-label="Shared Discovery on two phones: a Personal feed of AI and computing videos, and a Shared Discovery feed with ancient Egypt and Renaissance architecture.">
      <div className="sd-mini-stage" style={{ width: W, height: H, transform: `scale(${s})`, left: `calc(50% - ${(W * s) / 2}px)` }}>
        <div className="sd-mini-a"><PhoneFrame><PhoneScreen shared={false} chips={["Artificial intelligence", "Computer science", "Mathematics"]} videos={PERSONAL} /></PhoneFrame></div>
        <div className="sd-mini-b"><PhoneFrame><PhoneScreen shared circle="The Rabbit Hole" chips={["Ancient civilizations", "Architecture", "Nuclear energy"]} videos={SHARED} /></PhoneFrame></div>
      </div>
    </div>
  );
}
