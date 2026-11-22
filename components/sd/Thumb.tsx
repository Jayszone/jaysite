import { type TopicId, type Video } from "@/lib/sd/data";

// Fictional video tiles: a flat subject colour, a short title card on the left and a simple flat
// motif on the right, like a documentary thumbnail. Drawn in code, so there are no stock photos,
// real creators or image licences to track. Duration is shown by the surrounding UI.

type P = { c: [string, string, string]; v: number };
// Coordinates are rounded so server and browser print identical numbers (trig differs in the last digit).
const r2 = (n: number) => Math.round(n * 100) / 100;
const pts = (n: number, f: (i: number) => [number, number]) => Array.from({ length: n }, (_, i) => { const [x, y] = f(i); return [r2(x), r2(y)] as [number, number]; });

// One deep, flat colour per subject. White text on each is at least 5:1.
const FLAT: Record<TopicId, string> = {
  ancient: "#8a4b14", architecture: "#7a3b22", nuclear: "#0b6b64", ai: "#2f3a9e", philosophy: "#54407a",
  ocean: "#0a4c80", computing: "#6b5200", urban: "#2f5578", math: "#1d6b43", collective: "#8a4f1a",
  psychology: "#8a2d6d", energy: "#6b6a00", nature: "#2f6b26", craft: "#3a3a46", science: "#2a4278",
};
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (h: string, to: number[], t: number) => "#" + hex(h).map((c, i) => Math.round(c * (1 - t) + to[i] * t).toString(16).padStart(2, "0")).join("");
export const subjectColor = (t: TopicId) => FLAT[t];

// Short title-card text for each fictional video (two or three short lines).
const CARD: Record<string, string[]> = {
  "egypt-world": ["EGYPT'S", "COSMOS"], "renaissance-domes": ["BUILDING", "DOMES"], "microreactors-ai": ["MICRO-", "REACTORS"],
  "cities-develop": ["HOW", "CITIES", "GROW"], "math-patterns": ["NATURE'S", "MATH"], "early-computers": ["EARLY", "COMPUTERS"],
  "deep-ocean": ["DEEP", "MINDS"], ants: ["ANT", "SOCIETY"], "library-ideas": ["EVERY", "IDEA"], cathedrals: ["BUILT", "BY HAND"],
  "future-selves": ["FUTURE", "YOU"], "llm-tour": ["INSIDE", "AN LLM"], "grid-cities": ["THE", "GRID"], "small-reactors": ["SMALL", "REACTORS"],
  "grid-balance": ["POWER", "GRID"], "memory-rebuilt": ["MEMORY", "REBUILT"], "coral-cities": ["REEF", "CITIES"], "computing-stars": ["HUMAN", "COMPUTERS"],
  "tree-rings": ["TREE", "RINGS"], honeycombs: ["PATTERNS", "REPEAT"], inlay: ["INLAY"], "textile-data": ["WOVEN", "DATA"],
  "science-changed": ["SCIENCE", "CHANGED"], "thought-experiments": ["THOUGHT", "TESTS"], fungal: ["FUNGAL", "NETWORKS"], streets: ["STREETS"],
  "roman-concrete": ["ROMAN", "CONCRETE"], geothermal: ["HEAT", "FROM", "BELOW"], "curious-machines": ["CURIOUS", "MACHINES"],
  fission: ["FISSION", "BASICS"], swarms: ["SWARMS"], "deep-clocks": ["SLOW", "CLOCKS"],
};

const SCENES: Record<TopicId, (p: P) => React.ReactNode> = {
  ancient: ({ c }) => (<>
    <circle cx="238" cy="62" r="26" fill={c[2]} opacity=".92" />
    <polygon points="30,150 108,62 186,150" fill="#000" opacity=".38" /><polygon points="108,62 186,150 140,150" fill="#000" opacity=".25" />
    <polygon points="140,150 196,92 252,150" fill={c[1]} opacity=".9" /><polygon points="196,92 252,150 222,150" fill="#000" opacity=".25" />
    <polygon points="230,150 268,116 306,150" fill="#000" opacity=".4" />
    <path d="M0 180 V150 Q80 138 160 150 T320 146 V180Z" fill="#000" opacity=".5" />
  </>),
  architecture: ({ c }) => (<>
    <rect x="96" y="96" width="128" height="52" fill="#000" opacity=".35" />
    <path d="M96 96 A64 64 0 0 1 224 96Z" fill={c[1]} /><path d="M96 96 A64 64 0 0 1 160 32 V96Z" fill="#000" opacity=".22" />
    {[0.25, 0.5, 0.75].map((t) => <path key={t} d={`M160 32 Q${96 + 128 * t} 60 ${96 + 128 * t} 96`} stroke={c[2]} strokeWidth="1.2" fill="none" opacity=".7" />)}
    <rect x="156" y="14" width="8" height="20" fill={c[2]} /><polygon points="156,14 164,14 160,4" fill={c[2]} />
    {pts(7, (i) => [24 + i * 42, 148]).map(([x, y], i) => <g key={i}><rect x={x - 5} y={y - 14} width="10" height="14" fill="#000" opacity=".4" /><path d={`M${x - 14} ${y} V${y - 6} A14 14 0 0 1 ${x + 14} ${y - 6} V${y}`} fill="none" stroke={c[2]} strokeWidth="1" opacity=".45" /></g>)}
    <rect x="0" y="148" width="320" height="32" fill="#000" opacity=".5" />
  </>),
  nuclear: ({ c }) => (<>
    {pts(18, (i) => [60 + (i % 6) * 38 + (Math.floor(i / 6) % 2) * 19, 40 + Math.floor(i / 6) * 34]).map(([x, y], i) => (
      <polygon key={i} points={`${x},${y - 18} ${x + 16},${y - 9} ${x + 16},${y + 9} ${x},${y + 18} ${x - 16},${y + 9} ${x - 16},${y - 9}`} fill={i === 7 || i === 8 ? c[2] : "#000"} opacity={i === 7 || i === 8 ? 0.85 : 0.28} stroke={c[2]} strokeWidth=".8" />))}
    <circle cx="160" cy="90" r="50" fill={c[2]} opacity=".12" /><rect x="0" y="150" width="320" height="30" fill="#000" opacity=".45" />
  </>),
  ai: ({ c }) => {
    const L = [[40, 90, 140], [110, 50, 90, 130], [180, 40, 80, 120, 160], [250, 70, 120]];
    return (<>
      {L.slice(0, -1).flatMap((a, i) => a.slice(1).flatMap((y1, j) => L[i + 1].slice(1).map((y2, k) => <line key={`${i}${j}${k}`} x1={a[0]} y1={y1} x2={L[i + 1][0]} y2={y2} stroke={c[2]} strokeWidth=".6" opacity=".35" />)))}
      {L.flatMap((a, i) => a.slice(1).map((y, j) => <circle key={`${i}-${j}`} cx={a[0]} cy={y} r={(i + j) % 3 === 0 ? 5 : 3.4} fill={c[2]} opacity={0.5 + ((i * 3 + j) % 4) * 0.12} />))}
    </>);
  },
  philosophy: ({ c }) => (<>
    <path d="M230 36 A22 22 0 1 0 252 70 A17 17 0 1 1 230 36Z" fill={c[2]} opacity=".85" />
    {[70, 130, 190].map((x) => <g key={x}><rect x={x} y="56" width="30" height="8" fill={c[2]} opacity=".55" /><rect x={x + 4} y="64" width="22" height="78" fill="#000" opacity=".3" /><rect x={x + 4} y="64" width="8" height="78" fill={c[2]} opacity=".18" /><rect x={x - 2} y="142" width="34" height="8" fill={c[2]} opacity=".5" /></g>)}
    <rect x="0" y="150" width="320" height="30" fill="#000" opacity=".5" />
  </>),
  ocean: ({ c }) => (<>
    {pts(26, (i) => [(i * 83) % 310 + 6, (i * 47) % 150 + 8]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1 + (i % 3)} fill={c[2]} opacity={0.25 + (i % 4) * 0.12} />)}
    <path d="M110 92 A50 42 0 0 1 210 92 Q160 104 110 92Z" fill={c[2]} opacity=".7" /><path d="M110 92 A50 42 0 0 1 160 50 V98Q135 100 110 92Z" fill="#fff" opacity=".12" />
    {[124, 142, 160, 178, 196].map((x, i) => <path key={x} d={`M${x} 96 q${i % 2 ? -10 : 10} 24 0 44 t0 30`} stroke={c[2]} strokeWidth="1.6" fill="none" opacity=".6" />)}
    <path d="M0 150 Q60 136 120 150 T240 148 T320 146 V180H0Z" fill="#000" opacity=".5" />
  </>),
  computing: ({ c }) => (<>
    <path d="M60 30 H236 L260 54 V150 H60Z" fill="#000" opacity=".3" stroke={c[2]} strokeWidth="1.2" />
    {pts(40, (i) => [76 + (i % 10) * 17, 66 + Math.floor(i / 10) * 20]).map(([x, y], i) => <rect key={i} x={x} y={y} width="9" height="12" rx="1.5" fill={(i * 7) % 5 < 2 ? c[2] : "#000"} opacity={(i * 7) % 5 < 2 ? 0.85 : 0.5} />)}
    <circle cx="270" cy="140" r="22" fill="none" stroke={c[2]} strokeWidth="5" strokeDasharray="6 5" opacity=".6" /><circle cx="270" cy="140" r="7" fill={c[2]} opacity=".6" />
  </>),
  urban: ({ c }) => (<>
    {pts(40, (i) => [i % 8, Math.floor(i / 8)]).map(([gx, gy], i) => <rect key={i} x={14 + gx * 38} y={12 + gy * 32} width="30" height="24" fill={c[1]} opacity={0.35 + ((gx * 3 + gy * 5) % 5) * 0.12} />)}
    <path d="M0 150 C80 110 170 130 240 70 S320 20 330 10" stroke={c[2]} strokeWidth="9" fill="none" opacity=".8" />
    {pts(8, (i) => [30 + i * 38, 168]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill={c[2]} opacity=".4" />)}
  </>),
  math: ({ c }) => (<>
    {pts(170, (i) => { const a = i * 2.39996, r = Math.sqrt(i) * 7.4; return [160 + r * Math.cos(a), 90 + r * Math.sin(a) * 0.9]; }).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.3 + (i % 9) * 0.28} fill={c[2]} opacity={0.35 + (i % 7) * 0.09} />)}
  </>),
  collective: ({ c }) => (<>
    <path d="M0 40 H320 V180 H0Z" fill="#000" opacity=".25" />
    <path d="M30 40 V80 Q60 90 80 70 T140 100 Q170 120 160 150 M140 100 Q200 90 230 120 T290 110 M230 120 V164 M80 70 Q90 110 70 140" stroke={c[2]} strokeWidth="5" fill="none" strokeLinecap="round" opacity=".75" />
    {[[80, 70], [160, 150], [290, 110], [70, 140], [230, 164]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="14" ry="9" fill={c[2]} opacity=".9" />)}
    {pts(14, (i) => [30 + (i * 21) % 270, 50 + ((i * 37) % 110)]).map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="3.2" ry="1.8" fill="#000" opacity=".85" transform={`rotate(${(i * 40) % 180} ${x} ${y})`} />)}
  </>),
  psychology: ({ c }) => (<>
    {[0, 1, 2, 3].map((i) => <circle key={i} cx={130 + i * 22} cy="88" r={56 - i * 8} fill="none" stroke={c[2]} strokeWidth="1.6" opacity={0.7 - i * 0.12} />)}
    {pts(16, (i) => [90 + (i * 29) % 140, 52 + (i * 41) % 80]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" fill={c[2]} opacity=".7" />)}
    <path d="M100 128 Q160 40 230 90" stroke={c[2]} strokeWidth="1.2" fill="none" opacity=".6" />
  </>),
  energy: ({ c }) => (<>
    {[70, 220].map((x) => <g key={x} stroke={c[2]} strokeWidth="1.6" fill="none" opacity=".85"><path d={`M${x} 40 L${x - 22} 150 M${x} 40 L${x + 22} 150 M${x - 18} 100 H${x + 18} M${x - 11} 70 H${x + 11} M${x - 18} 100 L${x + 11} 70 M${x + 18} 100 L${x - 11} 70`} /><path d={`M${x - 26} 54 H${x + 26}`} /></g>)}
    <path d="M44 54 Q140 96 196 54 M96 54 Q160 100 246 54" stroke={c[2]} strokeWidth="1.1" fill="none" opacity=".6" />
    <circle cx="272" cy="38" r="18" fill={c[2]} opacity=".85" /><rect x="0" y="150" width="320" height="30" fill="#000" opacity=".5" />
  </>),
  nature: ({ c }) => {
    const seg: React.ReactNode[] = [];
    const grow = (x: number, y: number, a: number, len: number, d: number, k: string) => {
      if (d === 0) return;
      const nx = r2(x + Math.sin(a) * len), ny = r2(y - Math.cos(a) * len);
      seg.push(<line key={k} x1={x} y1={y} x2={nx} y2={ny} stroke={c[2]} strokeWidth={d * 0.9} strokeLinecap="round" opacity=".85" />);
      grow(nx, ny, a - 0.42, len * 0.76, d - 1, k + "l"); grow(nx, ny, a + 0.38, len * 0.76, d - 1, k + "r");
    };
    grow(160, 176, 0, 40, 6, "t");
    return <>{seg}</>;
  },
  craft: ({ c }) => (<>
    {[0, 45, 90, 135].map((a) => <ellipse key={a} cx="160" cy="90" rx="62" ry="17" fill="none" stroke={c[2]} strokeWidth="1.3" transform={`rotate(${a} 160 90)`} opacity=".9" />)}
    <circle cx="160" cy="90" r="72" fill="none" stroke={c[2]} strokeWidth="1" strokeDasharray="2 4" /><circle cx="160" cy="90" r="9" fill={c[2]} />
    {pts(16, (i) => [160 + 80 * Math.cos((i / 16) * 6.283), 90 + 80 * Math.sin((i / 16) * 6.283)]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill={c[2]} opacity=".7" />)}
  </>),
  science: ({ c }) => (<>
    {[26, 46, 68].map((r, i) => <ellipse key={r} cx="160" cy="92" rx={r * 2} ry={r * 0.8} fill="none" stroke={c[2]} strokeWidth="1" opacity={0.7 - i * 0.12} transform={`rotate(${-14 + i * 6} 160 92)`} />)}
    <circle cx="160" cy="92" r="13" fill={c[2]} /><circle cx="226" cy="64" r="5" fill="#fff" opacity=".85" /><circle cx="100" cy="116" r="4" fill={c[2]} opacity=".8" /><circle cx="262" cy="104" r="3" fill="#fff" opacity=".6" />
  </>),
};

export default function Thumb({ video, className = "" }: { video: Pick<Video, "id" | "topics">; className?: string }) {
  const topic = video.topics[0];
  const v = video.id.length;
  const bg = mix(FLAT[topic], [0, 0, 0], [0, 0.12, 0.22][v % 3]);
  const c: [string, string, string] = [mix(bg, [0, 0, 0], 0.35), mix(bg, [255, 255, 255], 0.22), mix(bg, [255, 255, 255], 0.62)];
  const lines = CARD[video.id] ?? ["WATCH"];
  return (
    <svg className={className} viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true" focusable="false">
      <rect width="320" height="180" fill={bg} />
      <g transform="translate(152 26) scale(.56)">{SCENES[topic]({ c, v })}</g>
      <rect y="150" width="320" height="30" fill="#000" opacity=".16" />
      <text x="16" y={Math.max(54, 100 - lines.length * 13)} fill="#fff" fontFamily="Inter Variable, Inter, system-ui, sans-serif" fontWeight="800" fontSize="23" letterSpacing="-.5">
        {lines.map((l, i) => <tspan key={i} x="16" dy={i === 0 ? 0 : 26}>{l}</tspan>)}
      </text>
    </svg>
  );
}
