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
  x: number; y: number; w: number; h: number; title: string; sub?: string | string[]; seed: number; tone?: 0 | 1 | 2; dashed?: boolean;
}) {
  const lines = Array.isArray(sub) ? sub : null;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className={`bx t${tone}`} />
      {paths(gen.rectangle(x, y, w, h, { seed, roughness: 1.25, bowing: 1.4, strokeLineDash: dashed ? [8, 6] : undefined }))}
      {lines ? (
        <>
          <text x={x + w / 2} y={y + 30} className="hd">{title}</text>
          {lines.map((l, i) => <text key={i} x={x + w / 2} y={y + 54 + i * 16} className="sb">{l}</text>)}
        </>
      ) : (
        <>
          <text x={x + w / 2} y={y + h / 2 - (sub ? 4 : -5)} className="hd">{title}</text>
          {sub && <text x={x + w / 2} y={y + h / 2 + 17} className="sb">{sub}</text>}
        </>
      )}
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

const STEPS: [string, string[]][] = [
  ["Eligibility", ["employee or", "dependent confirms", "access"]],
  ["Physician order", ["telehealth partner", "or referral", "writes it"]],
  ["Provider", ["vetted direct-pay", "provider accepts"]],
  ["Booking", ["appointment is", "scheduled and", "confirmed"]],
  ["Payment", ["voucher or direct", "payment, no claim"]],
  ["Support", ["follow-up, fixes", "and feedback"]],
];
const FIXES: [string, string[]][] = [
  ["Compared options", ["telehealth,", "referrals, in-house", "clinical support"]],
  ["Vetted partners", ["repeatable process", "for provider", "acceptance issues"]],
  ["Redesigned flow", ["process for failed", "bookings and", "participant support"]],
];

function HealtheeJourney() {
  const w = 142, sx = (i: number) => 14 + i * 158;
  return (
    <>
      <div className="viz-scroll">
        <svg className="viz sketch" viewBox="0 0 960 400" role="img"
          aria-label="Diagram of the participant journey: eligibility, physician order, provider, booking, payment, support. Participants got stuck most at physician orders, provider acceptance and booking. For each, the fix is listed: compared ways to get orders, vetted partners, and a redesigned booking flow.">
          <text x="14" y="30" className="lane">The participant journey</text>
          <Line a={[sx(1), 98]} b={[sx(3) + w, 98]} seed={5} dashed />
          <Line a={[sx(1), 98]} b={[sx(1), 108]} seed={6} />
          <Line a={[sx(3) + w, 98]} b={[sx(3) + w, 108]} seed={7} />
          <text x={(sx(1) + sx(3) + w) / 2} y="84" className="cap">where people got stuck most</text>
          {STEPS.map(([t, s2], i) => <Box key={t} x={sx(i)} y={112} w={w} h={104} title={t} sub={s2} seed={20 + i} tone={i >= 1 && i <= 3 ? 2 : 1} />)}
          {STEPS.slice(0, -1).map((_, i) => <Arrow key={i} a={[sx(i) + w + 3, 164]} b={[sx(i + 1) - 4, 164]} seed={50 + i * 4} />)}
          <text x="14" y="296" className="lane" style={{ textAnchor: "start" }}>What I did</text>
          <text x="14" y="320" className="lane" style={{ textAnchor: "start" }}>about it</text>
          {FIXES.map(([t, s2], i) => (
            <g key={t}>
              <Arrow a={[sx(i + 1) + w / 2, 220]} b={[sx(i + 1) + w / 2, 254]} seed={80 + i * 4} dashed />
              <Box x={sx(i + 1)} y={260} w={w} h={104} title={t} sub={s2} seed={100 + i} tone={0} dashed />
            </g>
          ))}
        </svg>
      </div>
      <ol className="sr-only">
        <li>Journey steps: eligibility, physician order, provider, booking, payment, support.</li>
        <li>Most friction: physician orders, provider acceptance and booking.</li>
        <li>Fixes: compared ways to get physician orders, vetted partners, and a redesigned booking flow.</li>
      </ol>
    </>
  );
}

function RouteCompare() {
  const w = 200, x = (i: number) => 20 + i * 240;
  return (
    <>
      <div className="viz-scroll">
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

export const VISUALS: Record<string, () => React.ReactElement> = { "appeals-architecture": AppealsArchitecture, "healthee-journey": HealtheeJourney, "route-compare": RouteCompare };
