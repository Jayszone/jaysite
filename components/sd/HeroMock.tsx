import { Avatar, Brand, Chrome, VCard } from "./AppUI";
import { Icon } from "./Fig";
import { circle, person } from "@/lib/sd/data";
import { SHARED_MIX, buildFeed } from "@/lib/sd/engine";

// The opening figure: one believable screen of the fictional "Watch" app in Shared Discovery,
// with a "why you're seeing this" popover on a video that came from the circle. Static and light.
export default function HeroMock() {
  const c = circle("rabbit-hole");
  const feed = buildFeed({ userId: "alex", circleId: c.id, mix: SHARED_MIX, size: 8 });
  const pick = feed.find((r) => r.source === "circle")!;
  const rest = feed.filter((r) => r !== pick).slice(0, 5);
  const cards = [rest[0], pick, ...rest.slice(1)];
  const members = c.members.filter((m) => m !== "alex").slice(0, 3);
  return (
    <div className="sd-wide sd-rise" style={{ ["--i" as string]: 3 }}>
      <div className="sd-app sd-hero-app" data-mode="shared" role="img" aria-label={`A mock-up of the Watch app in Shared Discovery. A grid of six fictional videos, and a popover on one of them reading: ${pick.reason}.`}>
        <Chrome url="watch.example/home" />
        <div className="app-top">
          <Brand />
          <span className="app-search"><Icon name="search" />Search</span>
          <Avatar name="Alex" hue={person("alex").hue} />
        </div>
        <div className="hero-chips">
          <span>All</span>
          <span className="on"><Icon name="people" />Shared · {c.name}</span>
          <span>Architecture</span><span>Computing</span><span>Energy</span><span className="hide-sm">Documentaries</span>
        </div>
        <div className="hero-grid">
          {cards.map((r, i) => <VCard key={r.video.id} video={r.video} source={r.source} />)}
        </div>
        <div className="hero-pop" aria-hidden="true">
          <div className="hero-pop-head">
            <span className="ui-stack">{members.map((m) => <Avatar key={m} name={person(m).name} hue={person(m).hue} />)}</span>
            <div><b>{c.name}</b><small>{c.members.length} people · Private</small></div>
          </div>
          <p>{pick.reason}.</p>
          <div className="hero-pop-acts"><span><Icon name="plus" />More like this</span><span><Icon name="x" />Not interested</span></div>
          <div className="hero-pop-reply"><Icon name="chat" />Nobody sees what you watched</div>
        </div>
      </div>
    </div>
  );
}
