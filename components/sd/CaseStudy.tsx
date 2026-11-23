import Link from "next/link";
import "./sd.css";
import HeroPhones from "./HeroPhones";
import Prototype from "./Prototype";
import PersonaCompare from "./PersonaCompare";

// The case study in exactly three sections: The Idea, The Problem, The Experience.

const STAGES: [string, string, string][] = [
  ["01", "Understand the ecosystem", "I considered creators, viewers, and advertisers, then focused on viewers because long-term viewer satisfaction was the objective."],
  ["02", "Segment the audience", "I compared informational and entertainment viewing across short and long videos, focusing on long-form informational content."],
  ["03", "Identify the friction", "I explored relevance, available viewing time, and follow-up discovery. I prioritized moments when recommendations fail to reflect what someone wants to explore."],
  ["04", "Explore solutions", "I considered conversational AI discovery, context-aware recommendations, and discovery influenced by trusted friends."],
];

const NEXT: [string, string, string][] = [
  ["01", "Test with real circles", "Run prototype studies with small groups of friends to understand whether collective discovery introduces more worthwhile content."],
  ["02", "Refine the experience", "Experiment with personal relevance, group influence, and user controls."],
  ["03", "Expand the possibilities", "Explore optional discovery spaces shaped by the interests of researchers, creators, and communities people admire."],
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
            <p>Your recommendations know what you love. Your friends are exploring entirely different worlds.</p>
            <p>Shared Discovery brings their curiosity into your feed, helping you encounter ideas you might never have searched for yourself.</p>
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


        </div>

        <ol className="pr-stages">
          {STAGES.map(([n, h, t]) => (
            <li key={n} className="pr-stage">
              <span className="sd-label">{n}</span>
              <h3>{h}</h3>
              <p>{t}</p>
            </li>
          ))}
        </ol>

        <div className="pr-final">
          <span className="sd-label">05</span>
          <h3>The solution I explored: Shared Discovery</h3>
          <p>Context-aware recommendations were a more direct solution to immediate intent mismatch. But friend-influenced discovery raised another question:</p>
          <p className="pr-question">What if our friends&apos; interests could introduce us to things our algorithms would never think to recommend?</p>
          <p className="pr-became">That question became Shared Discovery.</p>
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
          <p className="sd-intro">Everyone brings different interests to the circle. Shared Discovery lets those interests influence each other while keeping every feed personal.</p>
        </div>
        <div className="sd-wide sd-figgap"><PersonaCompare /></div>
        <div className="col"><p className="sd-cap sd-b-cap">Switch between Alex, Sam, and Maya, or press Surprise me to explore something unexpected.</p></div>

        <div className="sd-end">
          <h3 className="sd-h3 end-h">Taking it forward.</h3>

          <div className="end-cols">
            <div className="end-left">
              <h4 className="end-sub">What would success look like?</h4>
              <p className="sd-label end-tag">North Star metric · proposed</p>
              <p className="end-north">Worthwhile Novel Discovery Rate</p>
              <p className="end-def">The share of sampled explored recommendations viewers consider both unfamiliar and worthwhile.</p>
              <ul className="end-metrics">
                <li><b>Long-term viewer satisfaction</b><span>Are viewers more satisfied with discovery over time?</span></li>
                <li><b>Voluntary return</b><span>Do people choose to return to Shared Discovery?</span></li>
              </ul>
              <p className="end-guard">Relevance and privacy understanding remain essential.</p>
            </div>
            <div className="end-right">
              <h4 className="end-sub">Where could this go?</h4>
              <ol className="end-steps">
                {NEXT.map(([n, h, t]) => (
                  <li key={n}><span className="sd-label">{n}</span><h5>{h}</h5><p>{t}</p></li>
                ))}
              </ol>
            </div>
          </div>

          <p className="end-vision">The next great thing you discover might begin with someone else&apos;s curiosity.</p>
          <p className="sd-small end-note">This independent concept uses fictional people and circles, real publicly available video content, and simulated recommendations. The metrics are proposed, not measured, and public discovery spaces are a possible later direction, not part of the first product. It is a design experiment, not a production recommendation system.</p>
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
