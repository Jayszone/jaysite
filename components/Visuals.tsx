import rough from "roughjs";
import ThumbPhones from "./sd/ThumbPhones";
import CaThumb from "./ca/Thumb";

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
  x: number; y: number; w: number; h: number; title: string; sub?: string | string[]; seed: number; tone?: 0 | 1 | 2; dashed?: boolean;
}) {
  const lines = Array.isArray(sub) ? sub : sub ? [sub] : [];
  const n = lines.length;
  // centre the text block (title + n lines) vertically in the box
  const total = n ? 40 + 16 * (n - 1) : 0;
  const titleY = n ? y + (h - total) / 2 + 14 : y + h / 2 + 5;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className={`bx t${tone}`} />
      {paths(gen.rectangle(x, y, w, h, { seed, roughness: 1.25, bowing: 1.4, strokeLineDash: dashed ? [8, 6] : undefined }))}
      <text x={x + w / 2} y={titleY} className="hd">{title}</text>
      {lines.map((l, i) => <text key={i} x={x + w / 2} y={titleY + 22 + i * 16} className="sb">{l}</text>)}
    </g>
  );
}

const OFFLINE: [string, string[]][] = [
  ["Knowledge base", ["PDF, HTML, Word,", "Excel, plain text"]],
  ["Normalize", ["everything to", "Markdown"]],
  ["Chunk", ["recursive, semantic,", "context-enriched"]],
  ["Embed", ["text to vectors"]],
  ["Vector database", ["vector index, with", "version and date data"]],
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
      <div className="viz-scroll" tabIndex={0} role="region" aria-label="Diagram, scrollable">
        <svg className="viz sketch" viewBox="0 0 940 560" role="img"
          aria-label="Architecture diagram. Offline, knowledge base files (PDF, HTML, Word, Excel and plain text) are normalized to Markdown, chunked with recursive, semantic and context-enriched methods, embedded, and stored in a vector database. Online, a question is embedded, matched by semantic and keyword retrieval, ranked with newer versions preferred, and answered by an LLM with citations to the exact source section. A human reviews the cited passage and makes the decision.">
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

function HealtheeStrategy() {
  const ev: [string, string[]][] = [
    ["Pilot data", ["100 people: what they used,", "where they stalled"]],
    ["Claims analysis", ["5,000+ data points: where", "the money goes"]],
    ["Cost comparison", ["providers and partners,", "priced side by side"]],
  ];
  const people = ["Product", "HR", "Finance", "Benefits Support", "Sales", "Customer Success"];
  return (
    <>
      <div className="viz-scroll" tabIndex={0} role="region" aria-label="Diagram, scrollable">
        <svg className="viz sketch" viewBox="0 0 960 540" role="img"
          aria-label="Diagram of how a pilot became a business decision. Three kinds of evidence, pilot data, claims analysis and cost comparison, feed one question: is it worth rolling out to an employer, and at what price. Trade-offs between cost, employee experience and how hard it is to run weigh on that question. I modelled adoption scenarios and break-even, wrote a pricing and rollout recommendation, and the client deal was secured. Six teams that did not report to me had to be brought along.">
          <text x="14" y="30" className="lane">From evidence to a decision</text>

          {ev.map(([t, l], i) => <Box key={t} x={14} y={58 + i * 110} w={196} h={84} title={t} sub={l} seed={10 + i} tone={1} />)}
          {[180, 210, 240].map((y, i) => <Arrow key={i} a={[214, 100 + i * 110]} b={[266, y]} seed={30 + i * 4} />)}

          <Box x={270} y={150} w={170} h={120} title="Roll it out?" sub={["Is it worth it for an", "employer, and at", "what price?"]} seed={50} tone={2} />
          <Box x={270} y={304} w={170} h={100} title="Trade-offs" sub={["cost vs employee", "experience vs how", "hard it is to run"]} seed={55} tone={0} dashed />
          <Arrow a={[355, 300]} b={[355, 275]} seed={60} dashed />

          <Box x={500} y={116} w={196} h={84} title="Adoption scenarios" sub={["10%, 20% and 30%", "of employees using it"]} seed={70} tone={1} />
          <Box x={500} y={232} w={196} h={84} title="Break-even" sub={["under 0.5% of the", "$7.79M modeled savings"]} seed={75} tone={1} />
          <Arrow a={[444, 190]} b={[496, 160]} seed={80} />
          <Arrow a={[444, 232]} b={[496, 274]} seed={84} />

          <Box x={750} y={116} w={196} h={84} title="Recommendation" sub={["pricing, rollout plan,", "priority procedures"]} seed={90} tone={1} />
          <Box x={750} y={232} w={196} h={84} title="Decision" sub="client deal secured" seed={95} tone={2} />
          <Arrow a={[700, 160]} b={[746, 156]} seed={100} />
          <Arrow a={[700, 274]} b={[746, 192]} seed={104} />
          <Arrow a={[848, 204]} b={[848, 228]} seed={108} />

          <text x="14" y="440" className="lane" style={{ textAnchor: "start" }}>People I had to bring along</text>
          {people.map((t, i) => <Box key={t} x={14 + i * 158} y={456} w={142} h={44} title={t} seed={120 + i} tone={0} />)}
          <text x="14" y="526" className="note" style={{ textAnchor: "start" }}>None of them reported to me, so progress depended on specific requests, made early.</text>
        </svg>
      </div>
      <ol className="sr-only">
        <li>Evidence: pilot data, claims analysis, cost comparison.</li>
        <li>Question: is it worth rolling out to an employer, and at what price, weighing cost, employee experience and operational difficulty.</li>
        <li>Modelled adoption at 10, 20 and 30 percent, and break-even at under 0.5 percent of the 7.79 million dollar modeled savings.</li>
        <li>Recommendation on pricing, rollout and priority procedures; the client deal was secured.</li>
        <li>Product, HR, Finance, Benefits Support, Sales and Customer Success had to be brought along without reporting to me.</li>
      </ol>
    </>
  );
}

function RouteCompare() {
  const w = 200, x = (i: number) => 20 + i * 240;
  return (
    <>
      <div className="viz-scroll" tabIndex={0} role="region" aria-label="Diagram, scrollable">
        <svg className="viz sketch" viewBox="0 0 960 440" role="img"
          aria-label="Two routes to the same service. Through insurance: employee, health plan with network and prior rules, in-network provider billing a negotiated rate, then a claim and cost sharing. Direct pay: employee, direct-pay provider who books the visit, then a posted price paid once with no claim.">
          <text x="20" y="32" className="lane">Through insurance</text>
          {[["Employee", "needs a service"], ["Health plan", "network and prior rules"], ["In-network provider", "bills a negotiated rate"], ["Claim and cost sharing", "deductible or coinsurance"]].map(([t, s2], i) => (
            <Box key={t} x={x(i)} y={48} w={w} h={84} title={t} sub={s2} seed={10 + i} tone={i === 3 ? 2 : i === 0 ? 0 : 1} />
          ))}
          {[0, 1, 2].map((i) => <Arrow key={i} a={[x(i) + w + 3, 90]} b={[x(i + 1) - 4, 90]} seed={30 + i * 4} />)}

          <text x="20" y="232" className="lane">Direct pay (Healthee Access)</text>
          {[["Employee", "needs a service"], ["Direct-pay provider", "books the visit"], ["Posted price, paid once", "no claim to adjudicate"]].map(([t, s2], i) => (
            <Box key={t} x={x(i)} y={248} w={w} h={84} title={t} sub={s2} seed={60 + i} tone={i === 2 ? 2 : i === 0 ? 0 : 1} />
          ))}
          {[0, 1].map((i) => <Arrow key={i} a={[x(i) + w + 3, 290]} b={[x(i + 1) - 4, 290]} seed={80 + i * 4} />)}

          <text x="20" y="392" className="note" style={{ textAnchor: "start" }}>Fewer handoffs can mean a lower price for some services.</text>
          <text x="20" y="414" className="note" style={{ textAnchor: "start" }}>The gap varies by service and market. Direct pay is not always cheaper.</text>
        </svg>
      </div>
      <ol className="sr-only">
        <li>Through insurance: employee, health plan, in-network provider, claim and cost sharing.</li>
        <li>Direct pay: employee, direct-pay provider, posted price paid once with no claim.</li>
        <li>Direct pay is not always cheaper; the gap varies by service and market.</li>
      </ol>
    </>
  );
}

export { Box, Arrow, Line, paths, gen };

export const VISUALS: Record<string, () => React.ReactElement> = { "appeals-architecture": AppealsArchitecture, "healthee-strategy": HealtheeStrategy, "route-compare": RouteCompare, "sd-phones": ThumbPhones, "ca-thumb": CaThumb };
