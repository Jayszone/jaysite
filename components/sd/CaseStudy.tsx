import Link from "next/link";
import "./sd.css";
import HeroPhones from "./HeroPhones";
import Prototype from "./Prototype";
import PersonaCompare from "./PersonaCompare";

// The case study in exactly three sections: The Idea, The Problem, The Experience.

const STAGES: [string, string, string[]][] = [
  ["01", "Understand the Ecosystem", ["I considered three key players: creators, viewers, and advertisers. I prioritized viewers because improving long-term viewer satisfaction was the central objective."]],
  ["02", "Segment the Audience", ["I segmented viewing experiences by motivation (informational versus entertainment) and duration (short versus long videos), then focused on long-form informational viewing as a segment worth investigating."]],
  ["03", "Identify the Friction", ["I mapped the viewer journey and identified three challenges: discovering relevant content, finding videos that fit the viewer's available time, and receiving worthwhile follow-up recommendations.", "I prioritized interest mismatch at the point of discovery, particularly when recommendations fail to reflect what someone wants to explore."]],
  ["04", "Explore Solutions", ["I considered three directions: conversational AI discovery, context-aware recommendations, and recommendations influenced by trusted friends."]],
];

// The YouTube play-button mark from Simple Icons (CC0), in YouTube red. Not a redrawn logo.
const YtMark = () => (
  <svg className="sd-yt" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
);

export default function SharedDiscoveryCaseStudy() {
  return (
    <div className="sd">
      {/* ------------------------------------------------ The Idea */}
      <section id="idea" aria-labelledby="idea-h">
        <div className="col">
          <Link href="/" className="back sd-rise" style={{ ["--i" as string]: 0 }}><span className="sd-arrow" aria-hidden="true">←</span> Work</Link>
          <p className="sd-label sd-idea-label sd-rise" style={{ ["--i" as string]: 1 }}><YtMark /><span>YouTube · Independent product experiment</span></p>
          <h1 id="idea-h" className="sd-title sd-rise" style={{ ["--i" as string]: 2 }}>What if your algorithm could learn from your friends' curiosity?</h1>
          <div className="sd-lede sd-rise" style={{ ["--i" as string]: 3 }}>
            <p>Your recommendations know what you love. But your friends are exploring entirely different worlds.</p>
            <p>Shared Discovery is a concept for YouTube that brings their curiosity into your feed, helping you discover things you might never have searched for on your own.</p>
          </div>
        </div>
        <HeroPhones />
        <div className="col"><p className="sd-cap sd-hero-cap">Independent product concept. Not affiliated with YouTube.</p></div>
      </section>

      {/* ------------------------------------------------ The Problem */}
      <section id="problem" className="sd-problem" aria-labelledby="problem-h">
        <div className="col">
          <p className="sd-label">The Problem</p>
          <h2 id="problem-h" className="sd-h2big">How much of YouTube are we missing?</h2>
          <p className="pr-lead">I began with a product sense challenge:</p>
          <p className="pr-challenge">How might we improve long-term viewer satisfaction on YouTube?</p>
          <p className="pr-lead pr-after">YouTube's recommendation system helps viewers navigate an enormous library of content. I wanted to explore how better discovery could make that experience more relevant, worthwhile, and satisfying over time.</p>

          <ol className="pr-stages">
            {STAGES.map(([n, h, t]) => (
              <li key={n} className="pr-stage">
                <span className="sd-label">{n}</span>
                <h3>{h}</h3>
                {t.map((x) => <p key={x}>{x}</p>)}
              </li>
            ))}
          </ol>
        </div>

        <div className="pr-final">
          <span className="sd-label">05</span>
          <h3>The Idea Worth Exploring</h3>
          <p>Context-aware recommendations offered a more direct approach to immediate intent mismatch. But the idea of social discovery opened another possibility:</p>
          <p className="pr-question">What if the things our friends discover could expand what our own algorithms recommend?</p>
          <p className="pr-became">That question became Shared Discovery, an independent product design experiment in collective curiosity.</p>
        </div>
      </section>

      {/* ------------------------------------------------ The Experience */}
      <section id="experience" className="sd-exp" aria-labelledby="experience-h">
        <div className="col">
          <h2 id="experience-h" className="sd-h2big">What it would feel like.</h2>
          <p className="sd-intro">Switch between your personal recommendations and a discovery feed influenced by the interests of your friends.</p>
        </div>
        <div className="sd-wide sd-figgap"><Prototype /></div>

        <div className="col sd-b-intro">
          <h3 className="sd-h3">One circle. Different discoveries.</h3>
          <p className="sd-intro">Everyone brings different interests to the circle. Shared Discovery lets those interests influence one another without making everyone's feed identical.</p>
        </div>
        <div className="sd-wide sd-figgap"><PersonaCompare /></div>
        <div className="col"><p className="sd-cap sd-b-cap">Switch between Alex, Sam, and Maya, or press Surprise me to explore something unexpected.</p></div>

        <div className="col sd-close">
          <h3 className="sd-h3">An experiment in collective curiosity.</h3>
          <p className="sd-intro">Shared Discovery explores whether recommendations influenced by trusted friends can introduce more unfamiliar, worthwhile content while keeping each person's experience their own.</p>
          <p className="sd-small">This independent concept uses fictional people and circles, real publicly available video content, and simulated recommendations. It is a design experiment, not a production recommendation system.</p>
        </div>
      </section>

      <div className="col">
        <footer className="sd-foot">
          <p><Link href="/" className="back"><span className="sd-arrow" aria-hidden="true">←</span> Back to work</Link></p>
        </footer>
      </div>
    </div>
  );
}
