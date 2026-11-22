import { Figure, Group, Node } from "./Fig";
import Wires from "./Wires";
import { Avatar } from "./AppUI";
import { person } from "@/lib/sd/data";

// Five product decisions. Each is a short paragraph and a small node-and-wire figure.
const av = (id: string) => <Avatar name={person(id).name} hue={person(id).hue} className="in-tile" />;

function DifferentFeeds() {
  return (
    <div className="sd-stage sd-dec-row is-split">
      <Wires wires={[{ a: "pool", b: "alex", live: true }, { a: "pool", b: "sam", live: true }]} />
      <Node id="pool" icon="pool" label="Circle's pool" note="one shared pool" tone="soft" />
      <div className="sd-col2">
        <Node id="alex" label="Alex's feed" note="more AI, computing">{av("alex")}</Node>
        <Node id="sam" label="Sam's feed" note="more cities, history">{av("sam")}</Node>
      </div>
    </div>
  );
}
function OptIn() {
  return (
    <div className="sd-stage sd-dec-row">
      <Wires wires={[{ a: "p", b: "s", live: true }]} />
      <Node id="p" icon="lock" label="Personal" note="private" />
      <span className="sd-wl">you choose</span>
      <Node id="s" icon="people" label="Shared" note="in a circle" tone="live" />
    </div>
  );
}
function NotSocial() {
  return (
    <div className="sd-stage sd-dec-row is-groups">
      <Group label="Left out"><div className="sd-row3"><Node icon="heart" label="Likes" tone="faded" /><Node icon="follow" label="Followers" tone="faded" /><Node icon="chat" label="Chat" tone="faded" /></div></Group>
      <Group label="Kept" accent><div className="sd-row3"><Node icon="compass" label="Discovery" note="the point" tone="live" /></div></Group>
    </div>
  );
}
function NoveltyRelevance() {
  return (
    <div className="sd-stage sd-dec-row">
      <Wires wires={[{ a: "n1", b: "n2" }, { a: "n2", b: "n3", live: true }, { a: "n3", b: "n4" }]} />
      <Node id="n1" icon="user" label="Familiar" note="nothing new" tone="faded" />
      <Group label="Interesting, not random" accent>
        <div className="sd-row3"><Node id="n2" icon="link" label="Next door" note="near a liked subject" tone="soft" /><Node id="n3" icon="spark" label="A new one" note="still connected" tone="live" /></div>
      </Group>
      <Node id="n4" icon="shuffle" label="Random" note="no link" tone="faded" />
    </div>
  );
}
function FriendsFirst() {
  return (
    <div className="sd-stage sd-dec-row is-groups">
      <Group label="Now · a small circle" accent><div className="sd-row3 is-tight">{["alex", "sam", "jordan", "maya", "taylor"].map((id) => <Node key={id} label={person(id).name}>{av(id)}</Node>)}</div></Group>
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
