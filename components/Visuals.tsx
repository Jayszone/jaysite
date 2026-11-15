import rough from "roughjs";

// Original, theme-aware project graphics. Drawn in the hand-sketched style of a whiteboard
// (rough.js, the same engine Excalidraw uses). Seeded, so the drawing is identical on every render.
// Add one here, then set `visual: <key>` in the project's frontmatter.

const gen = rough.generator();
type Pt = [number, number];

const paths = (d: ReturnType<typeof gen.line>) => gen.toPaths(d).map((p, i) => <path key={i} d={p.d} className="st" />);

function Line({ a, b, seed, dashed }: { a: Pt; b: Pt; seed: number; dashed?: boolean }) {
  return <>{paths(gen.line(a[0], a[1], b[0], b[1], { seed, roughness: 1.1, strokeLineDash: dashed ? [7, 7] : undefined }))}</>;
}
function Arrow({ a, b, seed, dashed }: { a: Pt; b: Pt; seed: number; dashed?: boolean }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), L = 11, s = 0.45;
  const h1: Pt = [b[0] - L * Math.cos(ang - s), b[1] - L * Math.sin(ang - s)];
  const h2: Pt = [b[0] - L * Math.cos(ang + s), b[1] - L * Math.sin(ang + s)];
  return (<><Line a={a} b={b} seed={seed} dashed={dashed} /><Line a={b} b={h1} seed={seed + 1} /><Line a={b} b={h2} seed={seed + 2} /></>);
}
function Elbow({ pts, seed }: { pts: Pt[]; seed: number }) {
  const last = pts[pts.length - 1], prev = pts[pts.length - 2];
  return (<>{paths(gen.linearPath(pts, { seed, roughness: 1.1, strokeLineDash: [7, 7] }))}<Arrow a={[prev[0], prev[1] - 0.01]} b={last} seed={seed + 3} /></>);
}
function Box({ x, y, w, h, title, sub, seed, tone = 1, dashed }: {
  x: number; y: number; w: number; h: number; title: string; sub?: string; seed: number; tone?: 0 | 1 | 2; dashed?: boolean;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className={`bx t${tone}`} />
      {paths(gen.rectangle(x, y, w, h, { seed, roughness: 1.25, bowing: 1.4, strokeLineDash: dashed ? [8, 6] : undefined }))}
      <text x={x + w / 2} y={y + h / 2 - (sub ? 4 : -5)} className="hd">{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 17} className="sb">{sub}</text>}
    </g>
  );
}

const OFFLINE = [
  ["Source documents", "PDF, HTML, Markdown"],
  ["Normalize", "PDF to Markdown"],
  ["Chunk", "fixed-size vs by section"],
  ["Embed", "text to vectors"],
  ["Vector index", "+ version and date data"],
];
const ONLINE = [
  ["Analyst or rep", "asks in plain language"],
  ["Embed query", "same model as the index"],
  ["Hybrid retrieval", "semantic + keyword"],
  ["Score and rank", "prefer newer versions"],
  ["LLM answer", "from the top passages"],
  ["Answer + citations", "link to exact section"],
];

function AppealsArchitecture() {
  const ow = 150, og = 30, nw = 136, ng = 20;
  const ox = (i: number) => 20 + i * (ow + og), nx = (i: number) => 20 + i * (nw + ng);
  return (
    <>
      <div className="viz-scroll">
        <svg className="viz sketch" viewBox="0 0 940 560" role="img"
          aria-label="Architecture diagram. Offline, source documents are normalized, chunked, embedded and stored in a vector index. Online, a question is embedded, matched by semantic and keyword retrieval, ranked with newer versions preferred, and answered by an LLM with citations to the exact source section. A human reviews the cited passage and makes the decision.">
          <text x="20" y="32" className="lane">1. Build the index (offline)</text>
          {OFFLINE.map(([t, s], i) => <Box key={t} x={ox(i)} y={48} w={ow} h={84} title={t} sub={s} seed={10 + i} tone={i === 4 ? 2 : 1} />)}
          {OFFLINE.slice(0, -1).map((_, i) => <Arrow key={i} a={[ox(i) + ow + 3, 90]} b={[ox(i + 1) - 4, 90]} seed={40 + i * 4} />)}

          <text x="20" y="300" className="lane">2. Answer a question (online)</text>
          {ONLINE.map(([t, s], i) => <Box key={t} x={nx(i)} y={318} w={nw} h={84} title={t} sub={s} seed={60 + i} tone={i === 5 ? 2 : i === 0 ? 0 : 1} />)}
          {ONLINE.slice(0, -1).map((_, i) => <Arrow key={i} a={[nx(i) + nw + 3, 360]} b={[nx(i + 1) - 4, 360]} seed={90 + i * 4} />)}

          {/* retrieval reads the index built above */}
          <Elbow pts={[[ox(4) + ow / 2, 136], [ox(4) + ow / 2, 220], [nx(2) + nw / 2, 220], [nx(2) + nw / 2, 314]]} seed={120} />
          <text x={(ox(4) + nx(2) + ow / 2 + nw / 2) / 2 + 40} y="212" className="note">search the index</text>

          <Arrow a={[nx(5) + nw / 2, 406]} b={[nx(5) + nw / 2 - 30, 458]} seed={140} />
          <Box x={600} y={462} w={320} h={84} title="Human reviews the cited passage" sub="and makes the decision. Complex cases go to senior review." seed={150} tone={0} />
          <Box x={20} y={462} w={330} h={84} title="Evaluation and monitoring" sub="answer-quality criteria, failure escalation" seed={160} tone={1} dashed />
        </svg>
      </div>
      <ol className="sr-only">
        <li>Offline: source documents, normalize, chunk, embed, vector index.</li>
        <li>Online: question, embed query, hybrid retrieval, score and rank, LLM answer, answer with citations.</li>
        <li>A human reviews the cited passage and makes the decision; complex cases go to senior review.</li>
      </ol>
    </>
  );
}

export const VISUALS: Record<string, () => React.ReactElement> = { "appeals-architecture": AppealsArchitecture };
