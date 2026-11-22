// Transparent, deterministic mock recommender for the design experiment.
// This is a teaching model, not a claim about how any real platform works.
import { CIRCLES, PEOPLE, VIDEOS, adjacency, topicLabel, type Circle, type TopicId, type Video } from "./data";

export type Source = "personal" | "circle" | "explore";
export type Mix = { personal: number; group: number; explore: number };
export type Feedback = { boost: Partial<Record<TopicId, number>>; hidden: string[] };
export type Rec = {
  video: Video; score: number; source: Source; reason: string;
  parts: { personal: number; circle: number; explore: number }; surprise?: boolean;
};

export const PERSONAL_MIX: Mix = { personal: 1, group: 0, explore: 0.05 };
export const SHARED_MIX: Mix = { personal: 0.5, group: 0.35, explore: 0.25 };
export const NO_FEEDBACK: Feedback = { boost: {}, hidden: [] };

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const w = (m: Partial<Record<TopicId, number>>, t?: TopicId) => (t ? m[t] ?? 0 : 0);
const userWeights = (userId: string) => PEOPLE.find((p) => p.id === userId)!.interests;

/** Interest in a video from a topic-weight map: primary topic counts fully, secondary partly. */
const rel = (m: Partial<Record<TopicId, number>>, v: Video) => clamp(w(m, v.topics[0]) + 0.4 * w(m, v.topics[1]));

/** What the circle is exploring, as topic weights, built from the OTHER members plus recent shared exploration. */
export function circleSignal(userId: string, c: Circle): Partial<Record<TopicId, number>> {
  const others = c.members.filter((id) => id !== userId);
  const out: Partial<Record<TopicId, number>> = {};
  for (const t of new Set<TopicId>([...others.flatMap((id) => Object.keys(userWeights(id)) as TopicId[]), ...(Object.keys(c.recent) as TopicId[])])) {
    const mean = others.reduce((s, id) => s + w(userWeights(id), t), 0) / Math.max(1, others.length);
    out[t] = clamp(0.65 * mean + 0.35 * w(c.recent, t));
  }
  return out;
}

/** How close a video's subjects sit to something this person already likes. */
export function bridge(userId: string, v: Video): { score: number; via?: TopicId } {
  const mine = userWeights(userId);
  let best = 0, via: TopicId | undefined;
  for (const [t, wt] of Object.entries(mine) as [TopicId, number][]) {
    if (wt < 0.25) continue;
    for (const [i, vt] of v.topics.entries()) {
      if (!vt) continue;
      const s = adjacency(t, vt) * wt * (i === 0 ? 1 : 0.6);
      if (s > best) { best = s; via = t; }
    }
  }
  return { score: best, via };
}

const seren = (userId: string, v: Video) => {
  const novelty = 1 - rel(userWeights(userId), v);
  return novelty * (0.3 + 0.7 * bridge(userId, v).score);
};

type Opts = { userId: string; circleId?: string | null; mix: Mix; feedback?: Feedback; size?: number; exclude?: string[] };

export function buildFeed({ userId, circleId, mix, feedback = NO_FEEDBACK, size = 10, exclude = [] }: Opts): Rec[] {
  const me = userWeights(userId);
  const c = circleId ? CIRCLES.find((x) => x.id === circleId) : undefined;
  const cs = c ? circleSignal(userId, c) : {};
  const total = mix.personal + mix.group + mix.explore || 1;
  const P = mix.personal / total, G = c ? mix.group / total : 0, E = mix.explore / total;
  // Small, repeatable per-person variation: each member samples the circle's interests differently.
  const jit = (v: Video) => { let h = 0; for (const ch of userId + v.id) h = (h * 31 + ch.charCodeAt(0)) % 997; return (h / 997) * 0.28; };
  const boostOf = (v: Video) => (feedback.boost[v.topics[0]] ?? 0) + 0.4 * (v.topics[1] ? feedback.boost[v.topics[1]] ?? 0 : 0);

  // The mix sets how many slots each source gets. At least two slots always stay personal,
  // so the feed never drifts into unrelated videos.
  let qG = Math.round(G * size), qE = Math.round(E * size);
  const minP = Math.min(2, size);
  while (size - qG - qE < minP) { if (qE >= qG && qE > 0) qE--; else if (qG > 0) qG--; else break; }
  const qP = size - qG - qE;

  const pool = VIDEOS.filter((v) => !feedback.hidden.includes(v.id) && !exclude.includes(v.id));
  const part = (v: Video) => ({ personal: rel(me, v), circle: rel(cs, v), explore: seren(userId, v) });
  const lists: Record<Source, Video[]> = {
    personal: [...pool].sort((a, b) => rel(me, b) + boostOf(b) - rel(me, a) - boostOf(a) || a.id.localeCompare(b.id)),
    circle: pool.filter((v) => rel(cs, v) >= 0.25 && rel(me, v) < 0.6).sort((a, b) => rel(cs, b) + 0.2 * rel(me, b) + jit(b) + boostOf(b) - rel(cs, a) - 0.2 * rel(me, a) - jit(a) - boostOf(a) || a.id.localeCompare(b.id)),
    explore: pool.filter((v) => bridge(userId, v).score >= 0.25 && rel(me, v) <= 0.5).sort((a, b) => seren(userId, b) + jit(b) + boostOf(b) - seren(userId, a) - jit(a) - boostOf(a) || a.id.localeCompare(b.id)),
  };

  const picked: Rec[] = [], perTopic: Record<string, number> = {}, used = new Set<string>();
  const take = (source: Source, n: number) => {
    for (const v of lists[source]) {
      if (n <= 0) break;
      const t = v.topics[0];
      if (used.has(v.id) || (perTopic[t] ?? 0) >= 2) continue;
      const pt = part(v);
      picked.push({ video: v, source, parts: { personal: P * pt.personal, circle: G * pt.circle, explore: E * pt.explore },
        score: P * pt.personal + G * pt.circle + E * pt.explore + boostOf(v), reason: reasonFor(source, userId, v, cs) });
      used.add(v.id); perTopic[t] = (perTopic[t] ?? 0) + 1; n--;
    }
    return n;
  };
  take("personal", qP);
  const shortC = take("circle", qG), shortE = take("explore", qE);
  take("personal", shortC + shortE); // fill any gap from the person's own interests
  return weave(picked.sort((a, b) => b.score - a.score || a.video.id.localeCompare(b.video.id)));
}

/** Mix the sources through the feed so each shows up early. The first card is always one of the person's own interests. */
function weave(recs: Rec[]): Rec[] {
  const by: Record<Source, Rec[]> = { personal: [], circle: [], explore: [] };
  recs.forEach((r) => by[r.source].push(r));
  const start = { personal: by.personal.length, circle: by.circle.length, explore: by.explore.length };
  const out: Rec[] = [];
  for (let i = 0; i < recs.length; i++) {
    let best: Source = "personal", bestVal = -1;
    for (const s of ["circle", "explore", "personal"] as Source[]) {
      if (!by[s].length) continue;
      const val = i === 0 ? (s === "personal" ? 2 : -1) : by[s].length / start[s];
      if (val > bestVal) { best = s; bestVal = val; }
    }
    out.push(by[best].shift()!);
  }
  return out;
}

function reasonFor(source: Source, userId: string, v: Video, cs: Partial<Record<TopicId, number>>): string {
  if (source === "circle") {
    const t = v.topics[0] && w(cs, v.topics[0]) >= w(cs, v.topics[1]) ? v.topics[0] : v.topics[1] ?? v.topics[0];
    return `Your circle has been exploring ${topicLabel(t).toLowerCase()}`;
  }
  if (source === "explore") {
    const b = bridge(userId, v);
    return b.via ? `New territory, close to your interest in ${topicLabel(b.via).toLowerCase()}` : "New territory";
  }
  const mine = userWeights(userId);
  const t = w(mine, v.topics[0]) >= w(mine, v.topics[1]) ? v.topics[0] : v.topics[1] ?? v.topics[0];
  return `Because you watch ${topicLabel(t).toLowerCase()}`;
}

/** "Surprise me": an unfamiliar subject that still sits next to something the person likes. */
export function surprise(userId: string, count: number, exclude: string[], feedback: Feedback = NO_FEEDBACK): Rec | null {
  const me = userWeights(userId);
  const pool = VIDEOS.filter((v) => !exclude.includes(v.id) && !feedback.hidden.includes(v.id) && rel(me, v) <= 0.35 && bridge(userId, v).score >= 0.35)
    .sort((a, b) => seren(userId, b) - seren(userId, a) || a.id.localeCompare(b.id));
  if (!pool.length) return null;
  const v = pool[count % pool.length];
  const b = bridge(userId, v);
  return { video: v, score: seren(userId, v), source: "explore", surprise: true,
    parts: { personal: 0, circle: 0, explore: 1 },
    reason: b.via ? `A new direction, next to your interest in ${topicLabel(b.via).toLowerCase()}` : "A new direction" };
}

export const sourceShare = (recs: Rec[]) => {
  const n = Math.max(1, recs.length);
  return { personal: recs.filter((r) => r.source === "personal").length / n, circle: recs.filter((r) => r.source === "circle").length / n, explore: recs.filter((r) => r.source === "explore").length / n };
};
export const familiarity = (userId: string, v: Video) => rel(userWeights(userId), v);
