import { Figure, Group, Icon, Node } from "./Fig";
import { Avatar, VCard } from "./AppUI";
import { person } from "@/lib/sd/data";
import { VIDEOS } from "@/lib/sd/data";
import { SHARED_MIX, bridge, buildFeed, surprise } from "@/lib/sd/engine";

// Five product decisions. Each is a short paragraph and a real prototype state, not a diagram.
const feedOf = (id: string, size = 4) => buildFeed({ userId: id, circleId: "rabbit-hole", mix: SHARED_MIX, size });

function DifferentFeeds() {
  return (
    <div className="dec-two">
      {["alex", "sam"].map((id) => (
        <div className="sd-app dec-feed" data-mode="shared" key={id}>
          <p className="dec-who"><Avatar name={person(id).name} hue={person(id).hue} />{person(id).name}'s Home · The Rabbit Hole</p>
          <div className="dec-cards">{feedOf(id).slice(0, 2).map((r) => <VCard key={r.video.id} video={r.video} source={r.source} />)}</div>
        </div>
      ))}
    </div>
  );
}
function OptIn() {
  return (
    <div className="sd-app dec-sheet" role="img" aria-label="The consent sheet shown before entering Shared Discovery: your activity shapes the circle, friends never see your history, you can leave any time.">
      <p className="dec-h">Enter Shared Discovery</p>
      <ul>
        <li><Icon name="people" />What you explore here helps shape your circle's recommendations.</li>
        <li><Icon name="lock" />Friends never see your searches or watch history.</li>
        <li><Icon name="door" />Leave any time. Personal browsing stays private.</li>
      </ul>
      <span className="dec-go">Enter Shared Discovery</span>
    </div>
  );
}
function NotSocial() {
  const r = feedOf("alex")[0];
  return (
    <div className="dec-one">
      <div className="sd-app dec-feed"><div className="dec-cards is-one"><VCard video={r.video} /></div></div>
      <div className="dec-acts">
        <div><p className="sd-label">Left out</p><ul>{[["heart", "Like"], ["follow", "Follow"], ["chat", "Comment"]].map(([i, l]) => <li key={l} className="off"><Icon name={i} />{l}</li>)}</ul></div>
        <div><p className="sd-label">Kept</p><ul><li className="on"><Icon name="plus" />More like this</li><li className="on"><Icon name="x" />Not interested</li></ul></div>
      </div>
    </div>
  );
}
function NoveltyRelevance() {
  const fam = buildFeed({ userId: "alex", circleId: null, mix: { personal: 1, group: 0, explore: 0 }, size: 1 })[0];
  const near = surprise("alex", 0, [fam.video.id])!;
  // The least connected video to Alex's interests, to show what a random pick would look like.
  const far = VIDEOS.filter((v) => v.id !== fam.video.id && v.id !== near.video.id).sort((a, b) => bridge("alex", a).score - bridge("alex", b).score)[0];
  const cols: [string, { video: typeof far }, boolean][] = [["Too familiar", fam, false], ["Next door", near, true], ["Unconnected", { video: far }, false]];
  return (
    <div className="dec-three">
      {cols.map(([label, r, hot]) => (
        <div key={label} className={`dec-col${hot ? " is-hot" : ""}`}>
          <p className="sd-label">{label}</p>
          <div className="sd-app"><div className="dec-cards is-one"><VCard video={r.video} /></div></div>
        </div>
      ))}
    </div>
  );
}
function FriendsFirst() {
  return (
    <div className="sd-stage sd-dec-row is-groups">
      <Group label="Now · a small circle" accent><div className="sd-row3 is-tight">{["alex", "sam", "jordan", "maya", "taylor"].map((id) => <Node key={id} label={person(id).name}><Avatar name={person(id).name} hue={person(id).hue} className="in-tile" /></Node>)}</div></Group>
      <Group label="Later · public creators"><div className="sd-row3"><Node icon="people" label="Public circles" tone="faded" /><Node icon="play" label="Creators" tone="faded" /></div></Group>
    </div>
  );
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
          <div className="sd-dec-text"><p className="sd-label">Decision {i + 1}</p><div><h3>{n}</h3><p>{why}</p></div></div>
          <Figure><Art /></Figure>
        </li>
      ))}
    </ol>
  );
}
