import { Arrow, Box, Line, gen, paths } from "@/components/Visuals";

// Five product decisions, each with a small hand-drawn sketch and a one-line reason.
const W = 320, H = 150;
const Svg = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <svg className="viz sketch viz-s" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>{children}</svg>
);

function DifferentFeeds() {
  return (<Svg label="Two people in one circle, each with a different feed.">
    <text x="160" y="22" className="note" style={{ textAnchor: "middle" }}>one circle</text>
    <Box x={12} y={36} w={124} h={96} title="Alex" sub={["AI systems", "Renaissance", "engineering"]} seed={1} tone={1} />
    <Box x={184} y={36} w={124} h={96} title="Sam" sub={["urban planning", "ancient cities", "geometry"]} seed={2} tone={1} />
    <Line a={[140, 84]} b={[180, 84]} seed={3} dashed />
  </Svg>);
}
function OptIn() {
  return (<Svg label="A deliberate step from Personal to Shared Discovery.">
    <Box x={10} y={44} w={104} h={62} title="Personal" sub="private" seed={4} tone={0} />
    <Arrow a={[120, 75]} b={[196, 75]} seed={5} />
    <text x="158" y="62" className="note" style={{ textAnchor: "middle" }}>you choose</text>
    <Box x={202} y={44} w={108} h={62} title="Shared" sub="in a circle" seed={6} tone={2} />
  </Svg>);
}
function NotSocial() {
  return (<Svg label="Likes, followers and chat are left out; discovery stays.">
    {["Likes", "Followers", "Chat"].map((t, i) => (<g key={t}>
      <Box x={10} y={14 + i * 42} w={96} h={34} title={t} seed={7 + i} tone={0} dashed />
      <Line a={[16, 44 + i * 42]} b={[100, 18 + i * 42]} seed={20 + i} />
    </g>))}
    <Arrow a={[118, 75]} b={[190, 75]} seed={30} />
    <Box x={196} y={44} w={114} h={62} title="Discovery" sub="the point" seed={31} tone={2} />
  </Svg>);
}
function NoveltyRelevance() {
  return (<Svg label="A scale from familiar to unfamiliar, with the useful middle highlighted.">
    <rect x="96" y="52" width="104" height="38" rx="6" className="bx t2" />
    {paths(gen.rectangle(96, 52, 104, 38, { seed: 40, roughness: 1.2 }))}
    <Line a={[16, 71]} b={[304, 71]} seed={41} />
    <Arrow a={[290, 71]} b={[306, 71]} seed={42} />
    <text x="16" y="110" className="sb" style={{ textAnchor: "start" }}>familiar</text>
    <text x="304" y="110" className="sb" style={{ textAnchor: "end" }}>unfamiliar</text>
    <text x="148" y="44" className="note" style={{ textAnchor: "middle" }}>interesting, not random</text>
  </Svg>);
}
function FriendsFirst() {
  const small = Array.from({ length: 5 }, (_, i) => [74 + 34 * Math.cos((i / 5) * 6.283 - 1.2), 76 + 34 * Math.sin((i / 5) * 6.283 - 1.2)]);
  const cloud = Array.from({ length: 26 }, (_, i) => [196 + ((i * 53) % 108), 34 + ((i * 37) % 86)]);
  return (<Svg label="A small circle of five friends now, a large public crowd later.">
    {paths(gen.circle(74, 76, 98, { seed: 50, roughness: 1.2 }))}
    {small.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" className="bx t2" />)}
    {paths(gen.ellipse(250, 76, 128, 104, { seed: 51, roughness: 1.3, strokeLineDash: [6, 6] }))}
    {cloud.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" className="bx" style={{ fillOpacity: 0.7 }} />)}
    <text x="74" y="140" className="note" style={{ textAnchor: "middle" }}>start here</text>
    <text x="250" y="140" className="note" style={{ textAnchor: "middle" }}>maybe later</text>
  </Svg>);
}

const ITEMS = [
  { n: "Different feeds, not one identical group feed", why: "People keep their own interests even when they explore with friends. A single shared feed would flatten that, so everyone gets their own slice of the same pool.", Art: DifferentFeeds },
  { n: "Shared mode is opt-in", why: "Private browsing and collective discovery need a clear line between them. Entering is explicit and explained, and leaving is immediate.", Art: OptIn },
  { n: "Discovery over social interaction", why: "The aim is to widen what people explore, not to increase time spent with each other. So there are no likes, followers, messages or rankings.", Art: NotSocial },
  { n: "Balance novelty with relevance", why: "A surprise should feel like a door you might want to open. Every unfamiliar suggestion sits next to something the person already cares about.", Art: NoveltyRelevance },
  { n: "Friends before public creators", why: "A small circle of people you trust is an easier place to test whether collective curiosity helps. Public circles can wait.", Art: FriendsFirst },
];

export default function Decisions() {
  return (
    <ol className="sd-decisions">
      {ITEMS.map(({ n, why, Art }, i) => (
        <li key={n}>
          <div className="sd-dec-art"><Art /></div>
          <div className="sd-dec-text"><p className="sd-kicker">Decision {i + 1}</p><h3>{n}</h3><p>{why}</p></div>
        </li>
      ))}
    </ol>
  );
}
