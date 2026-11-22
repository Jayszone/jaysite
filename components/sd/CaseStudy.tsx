import Link from "next/link";
import "./sd.css";
import HeroMock from "./HeroMock";
import IsolatedViz from "./IsolatedViz";
import Prototype from "./Prototype";
import SurpriseDemo from "./SurpriseDemo";
import CircleIntro from "./CircleIntro";
import PersonaCompare from "./PersonaCompare";
import MixViz from "./MixViz";
import PrivacyDemo from "./PrivacyDemo";
import Decisions from "./Decisions";
import ExperimentDesign from "./ExperimentDesign";
import { getProject } from "@/lib/content";

const SECTIONS = [
  ["separate-worlds", "Separate worlds"], ["the-idea", "The product idea"], ["the-circle", "The circle"], ["different-feeds", "Different feeds"],
  ["surprise", "Something unexpected"], ["the-logic", "How it works"], ["privacy", "Privacy by design"], ["decisions", "Decisions"], ["experiment", "The experiment"],
];

const Sec = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section className="sd-ch" id={id} aria-labelledby={`${id}-h`}>
    <h2 id={`${id}-h`} className="sd-h2">{title}</h2>
    {children}
  </section>
);

export default function SharedDiscoveryCaseStudy() {
  const p = getProject("shared-discovery");
  return (
    <div className="sd">
      <div className="col">
        <Link href="/" className="back sd-rise" style={{ ["--i" as string]: 0 }}><span className="sd-arrow" aria-hidden="true">←</span> Work</Link>
        <section id="opening" className="sd-intro" aria-labelledby="opening-h">
          <h1 id="opening-h" className="sd-h1 sd-rise" style={{ ["--i" as string]: 1 }}>What if your algorithm could learn from your friends' curiosity?</h1>
          <div className="sd-prose sd-rise" style={{ ["--i" as string]: 2 }}>
            <p>Our recommendation feeds know what we like. But the people around us are exploring entirely different worlds. Shared Discovery is an experiment in bringing those worlds closer together.</p>
          </div>
          <dl className="sd-meta sd-rise" style={{ ["--i" as string]: 3 }}>
            {p && <><div><dt>Role</dt><dd>{p.role}</dd></div><div><dt>Year</dt><dd>{p.year}</dd></div><div><dt>Focus</dt><dd>{p.tags.join(" · ")}</dd></div></>}
            <div><dt>Note</dt><dd>A speculative concept, not a YouTube feature and not affiliated with YouTube. The videos are real and public, shown with their own thumbnails and linked to YouTube; they belong to their creators. The people, circles and numbers are fictional, and the recommendations come from simple rules, not a real model.</dd></div>
            <div><dt>Contents</dt><dd><ul className="sd-toc">{SECTIONS.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ul></dd></div>
          </dl>
        </section>
      </div>

      <HeroMock />

      <div className="col">
        <Sec id="separate-worlds" title="Our algorithms live in separate worlds">
          <div className="sd-prose">
            <p>We all live in different recommendation environments. One person goes deep on architecture. Another follows physics. Someone else cannot stop reading about history.</p>
            <p>Most of these discoveries never reach each other's feeds. When they do, it is usually as a single link in a group chat, and it is buried an hour later.</p>
            <p>Personalization helps us find more of what we already know. Sometimes discovery starts with what someone else finds fascinating. This is the hypothesis behind the experiment, not a finding.</p>
          </div>
          <IsolatedViz />
        </Sec>

        <Sec id="the-idea" title="A browsing mode, not a new app">
          <div className="sd-prose">
            <p>Shared Discovery sits in the Home feed, next to the way you already browse. You start in Personal. Switching is a deliberate choice, and it is explained before anything happens.</p>
            <p>Try it. Switch to Shared Discovery and watch the same person get a different Home feed. Open a video, ask for more or less of it, filter by subject, and switch back whenever you like.</p>
          </div>
          <div className="sd-wide sd-figgap sd-hero-demo"><Prototype name="mode switch demo" tryThis={["Tap Shared Discovery.", "Read what it explains, pick a circle and enter.", "Open a video, or use ⋯ for More like this and Not interested.", "Switch back to Personal at any time."]} /></div>
        </Sec>

        <Sec id="the-circle" title="A circle, not a network">
          <div className="sd-prose">
            <p>A circle is a small, private group. It does not have a feed of its own, a place to post, or anything to compete over. It exists for one thing: shaping what each member might discover.</p>
          </div>
          <CircleIntro />
        </Sec>

        <Sec id="different-feeds" title="One circle, different feeds">
          <div className="sd-prose">
            <p>The defining idea: friends shape each other's recommendations without receiving the same feed. Pick a member and compare. The videos, the reasons and the mix are different for each person.</p>
          </div>
          <PersonaCompare />
        </Sec>

        <Sec id="surprise" title="Something unexpected">
          <div className="sd-prose">
            <p>Serendipity is a control here, not an accident. Press Surprise me and the feed reaches one step past what you usually watch, always next to something you already like.</p>
          </div>
          <SurpriseDemo />
        </Sec>

        <Sec id="the-logic" title="How collective recommendations work">
          <div className="sd-prose">
            <p>Three signals shape the feed: what you tend to explore, what the circle has been exploring, and a little serendipity. This is a simple, readable model made for this page. It is not how any real platform works.</p>
            <p>Move the sliders to see the balance change. Serendipity only suggests subjects close to something you already like, so surprises stay plausible.</p>
          </div>
          <MixViz />
        </Sec>

        <Sec id="privacy" title="Privacy by design">
          <div className="sd-prose">
            <p>Using activity as a signal is different from showing it to someone. In Shared Discovery, what you do can add subjects to the circle's pool. It is never turned into a record other people can read.</p>
          </div>
          <PrivacyDemo />
        </Sec>

        <Sec id="decisions" title="Decisions and trade-offs">
          <div className="sd-prose"><p>Five choices shaped the product. Each one trades something away on purpose.</p></div>
          <Decisions />
        </Sec>

        <Sec id="experiment" title="The product experiment">
          <div className="sd-prose">
            <p>Everything above is a design. Whether it works is an open question, and this page does not claim to know the answer. This is how I would find out: give people either their usual feed or one with group interests, then ask what they found.</p>
          </div>
          <ExperimentDesign />
          <blockquote className="sd-closing">What happens when recommendations stop being entirely personal, and start becoming collective?</blockquote>
        </Sec>

        <footer className="sd-foot">
          <p className="sd-cap">Shared Discovery is a personal product design experiment. The people, circles and numbers are fictional or illustrative. Videos, titles, channel names and thumbnails are real and belong to their creators; thumbnails load from YouTube's own image host and every video links back to YouTube.</p>
          <p><Link href="/" className="back"><span className="sd-arrow" aria-hidden="true">←</span> Back to work</Link></p>
        </footer>
      </div>
    </div>
  );
}
