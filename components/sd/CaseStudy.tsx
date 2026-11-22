import Link from "next/link";
import "./sd.css";
import HeroFeeds from "./HeroFeeds";
import IsolatedViz from "./IsolatedViz";
import Prototype from "./Prototype";
import CircleIntro from "./CircleIntro";
import PersonaCompare from "./PersonaCompare";
import MixViz from "./MixViz";
import PrivacyDemo from "./PrivacyDemo";
import Decisions from "./Decisions";
import ExperimentDesign from "./ExperimentDesign";
import { person } from "@/lib/sd/data";
import { SHARED_MIX, buildFeed } from "@/lib/sd/engine";

const CHAPTERS = [
  ["opening", "The opening"], ["separate-worlds", "Separate worlds"], ["the-idea", "The product idea"], ["the-circle", "The circle"],
  ["the-feed", "The shared feed"], ["different-feeds", "Different feeds"], ["the-logic", "How it works"], ["privacy", "Privacy by design"],
  ["decisions", "Decisions"], ["experiment", "The experiment"],
];

const Ch = ({ id, n, title, children }: { id: string; n: number; title: string; children: React.ReactNode }) => (
  <section className="sd-ch" id={id} aria-labelledby={`${id}-h`}>
    <header><p className="sd-kicker">Chapter {String(n).padStart(2, "0")}</p><h2 id={`${id}-h`} className="sd-h2">{title}</h2></header>
    {children}
  </section>
);

export default function SharedDiscoveryCaseStudy() {
  const feeds = ["alex", "sam", "maya"].map((id) => ({
    name: person(id).name, hue: person(id).hue,
    items: (() => { const f = buildFeed({ userId: id, circleId: "rabbit-hole", mix: SHARED_MIX, size: 8 }); return (["personal", "circle", "explore"] as const).map((s) => f.find((r) => r.source === s)!).filter(Boolean).map((r) => ({ id: r.video.id, title: r.video.title, topic: r.video.topics[0], circle: r.source === "circle" })); })(),
  }));
  return (
    <div className="sd">
      <noscript><style>{".sd-hero{--p:1 !important}"}</style></noscript>
      <div className="col">
        <Link href="/" className="back">← Work</Link>
        <section id="opening" className="sd-intro" aria-labelledby="opening-h">
          <p className="sd-eyebrow">Product experiment · Social discovery · Recommendation systems</p>
          <h1 id="opening-h" className="sd-h1">What if your algorithm could learn from your friends' curiosity?</h1>
          <p className="sd-lede">Our recommendation feeds know what we like. But the people around us are exploring entirely different worlds. Shared Discovery is an experiment in bringing those worlds closer together.</p>
          <p className="sd-disclaim"><b>A product design experiment.</b> Not an official YouTube feature and not affiliated with YouTube. The people, circles, videos and numbers on this page are fictional, and the recommendations are produced by simple rules, not a real model.</p>
        </section>
      </div>

      <div className="sd-wide"><HeroFeeds feeds={feeds} /></div>

      <div className="col">
        <nav className="sd-toc" aria-label="Chapters">
          <p className="sd-kicker">In this case study</p>
          <ol>{CHAPTERS.map(([id, label]) => <li key={id}><a href={`#${id === "opening" ? "opening" : id}`}>{label}</a></li>)}</ol>
        </nav>

        <Ch id="separate-worlds" n={2} title="Our algorithms live in separate worlds">
          <div className="sd-prose">
            <p>We all live in different recommendation environments. One person goes deep on architecture. Another follows physics. Someone else cannot stop reading about history.</p>
            <p>Most of these discoveries never reach each other's feeds. When they do, it is usually as a single link in a group chat, and it is buried an hour later.</p>
            <p>Personalization helps us find more of what we already know. Sometimes discovery starts with what someone else finds fascinating. This is the hypothesis behind the experiment, not a finding.</p>
          </div>
          <div className="sd-wide"><IsolatedViz /></div>
        </Ch>

        <Ch id="the-idea" n={3} title="A browsing mode, not a new app">
          <div className="sd-prose">
            <p>Shared Discovery sits in the Home feed, next to the way you already browse. You start in Personal. Switching is a deliberate choice, and it is explained before anything happens.</p>
            <p>Try it. The moment you enter Shared Discovery is the whole idea in one step: the same person, a different set of recommendations.</p>
          </div>
          <div className="sd-wide"><Prototype name="mode switch demo" tryThis={["Tap Shared Discovery.", "Read what it explains, pick a circle and enter.", "Notice the mode label, accent colour and feed change."]} /></div>
        </Ch>

        <Ch id="the-circle" n={4} title="A circle, not a network">
          <div className="sd-prose">
            <p>A circle is a small, private group. It does not have a feed of its own, a place to post, or anything to compete over. It exists for one thing: shaping what each member might discover.</p>
          </div>
          <div className="sd-wide"><CircleIntro /></div>
        </Ch>

        <Ch id="the-feed" n={5} title="Explore the shared feed">
          <div className="sd-prose">
            <p>This is a working simulation, running entirely in your browser. Your choices change what appears next. Open a video, say you want more of it or none of it, ask to be surprised, and switch back whenever you like.</p>
          </div>
          <div className="sd-wide"><Prototype name="shared feed demo" tryThis={["Enter Shared Discovery, then scroll.", "Open a video and read why it appeared.", "Use ⋯ for More like this or Not interested.", "Press Surprise me for an unfamiliar direction.", "Switch back to Personal at any time."]} /></div>
        </Ch>

        <Ch id="different-feeds" n={6} title="One circle, different feeds">
          <div className="sd-prose">
            <p>The defining idea: friends shape each other's recommendations without receiving the same feed. Pick a member and compare. The videos, the reasons and the mix are different for each person.</p>
          </div>
          <div className="sd-wide"><PersonaCompare /></div>
        </Ch>

        <Ch id="the-logic" n={7} title="How collective recommendations work">
          <div className="sd-prose">
            <p>Three signals shape the feed: what you tend to explore, what the circle has been exploring, and a little serendipity. This is a simple, readable model made for this page. It is not how any real platform works.</p>
            <p>Move the sliders to see the balance change. Serendipity only suggests subjects close to something you already like, so surprises stay plausible.</p>
          </div>
          <div className="sd-wide"><MixViz /></div>
        </Ch>

        <Ch id="privacy" n={8} title="Privacy by design">
          <div className="sd-prose">
            <p>Using activity as a signal is different from showing it to someone. In Shared Discovery, what you do can add subjects to the circle's pool. It is never turned into a record other people can read.</p>
          </div>
          <div className="sd-wide"><PrivacyDemo /></div>
        </Ch>

        <Ch id="decisions" n={9} title="Decisions and trade-offs">
          <div className="sd-prose"><p>Five choices shaped the product. Each one trades something away on purpose.</p></div>
          <div className="sd-wide"><Decisions /></div>
        </Ch>

        <Ch id="experiment" n={10} title="The product experiment">
          <div className="sd-prose">
            <p>Everything above is a design. Whether it works is an open question, and this page does not claim to know the answer. This is how I would find out: give people either their usual feed or one with group interests, then ask what they found.</p>
          </div>
          <div className="sd-wide"><ExperimentDesign /></div>
          <p className="sd-closing">What happens when recommendations stop being entirely personal, and start becoming collective?</p>
        </Ch>

        <footer className="sd-foot">
          <p className="sd-cap">Shared Discovery is a personal product design experiment. All people, videos, thumbnails and numbers are fictional or illustrative. The thumbnails are drawn in code.</p>
          <p><Link href="/" className="back">← Back to work</Link></p>
        </footer>
      </div>
    </div>
  );
}
