import { type ReactNode } from "react";

// Illustrated portraits for the five fictional people. Drawn in code, so no real person's photo
// is used for a made-up character. Each has its own skin tone, hair, clothing and background.
type Look = { skin: string; hair: string; shirt: string; bg: string; style: "short" | "curly" | "long" | "bun" | "crop"; glasses?: boolean };
const LOOKS: Record<string, Look> = {
  alex: { skin: "#e3b48c", hair: "#2a1f18", shirt: "#2f4a7d", bg: "#cfe0f5", style: "short" },
  sam: { skin: "#8d5a3b", hair: "#15100c", shirt: "#c8892b", bg: "#f7e1bd", style: "curly" },
  jordan: { skin: "#f2cfae", hair: "#8a3f1d", shirt: "#6b3f8f", bg: "#eadcf5", style: "long", glasses: true },
  maya: { skin: "#b97a50", hair: "#14100d", shirt: "#1f7a6e", bg: "#cdeee8", style: "bun" },
  taylor: { skin: "#f6d7be", hair: "#d6aa55", shirt: "#4d8a3a", bg: "#e1f0cc", style: "crop", glasses: true },
};

function hair(l: Look): { back: ReactNode; front: ReactNode } {
  const h = l.hair;
  switch (l.style) {
    case "curly": return { back: <g fill={h}>{[[22, 20], [28, 14], [36, 14], [42, 20], [20, 28], [44, 28]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" />)}</g>, front: <path d="M21 24c2-8 8-11 11-11s9 3 11 11c-4-3-8-4-11-4s-7 1-11 4z" fill={h} /> };
    case "long": return { back: <path d="M19 30c-1-13 6-19 13-19s14 6 13 19l1 20H18z" fill={h} />, front: <path d="M20 27c1-9 6-13 12-13s11 4 12 13c-4-4-8-6-12-6s-8 2-12 6z" fill={h} /> };
    case "bun": return { back: <circle cx="32" cy="10" r="6" fill={h} />, front: <path d="M20 29c0-10 5-15 12-15s12 5 12 15c-3-5-7-7-12-7s-9 2-12 7z" fill={h} /> };
    case "crop": return { back: null, front: <path d="M20 27c1-9 6-13 12-13s11 4 12 13c-2-3-4-5-7-5-3 2-7 3-10 1-3 0-5 2-7 4z" fill={h} /> };
    default: return { back: null, front: <path d="M20.5 26c0-9 5-13 11.5-13s11.5 4 11.5 13c-3-3-6-5-11-5-3 0-7 1-12 5z" fill={h} /> };
  }
}

export default function Portrait({ id }: { id: string }) {
  const l = LOOKS[id];
  if (!l) return null;
  const { back, front } = hair(l);
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className="ui-portrait">
      <rect width="64" height="64" fill={l.bg} />
      {back}
      <path d="M8 66c1-12 10-17 24-17s23 5 24 17z" fill={l.shirt} />
      <rect x="28" y="38" width="8" height="12" rx="3" fill={l.skin} />
      <ellipse cx="32" cy="29" rx="12" ry="13.5" fill={l.skin} />
      {front}
      <circle cx="27.3" cy="30" r="1.3" fill="#2a1d16" /><circle cx="36.7" cy="30" r="1.3" fill="#2a1d16" />
      <path d="M28.5 36c2 1.8 5 1.8 7 0" stroke="#7a3b2a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {l.glasses && <g fill="none" stroke="#2a2a2e" strokeWidth="1"><circle cx="27.3" cy="30" r="3.6" /><circle cx="36.7" cy="30" r="3.6" /><path d="M30.9 30h2.2" /></g>}
    </svg>
  );
}
