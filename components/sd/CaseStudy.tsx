import Link from "next/link";
import "./sd.css";
import HeroLoop from "./HeroLoop";
import Prototype from "./Prototype";
import PersonaCompare from "./PersonaCompare";
import { getProject } from "@/lib/content";

// The case study in exactly three sections: The Idea, The Problem, The Experience.
const STEPS: [string, string][] = [
  ["Objective", "Improve long-term viewer satisfaction, not just engagement or watch time."],
  ["Audience", "People who come to explore and learn."],
  ["Need", "Content that feels relevant, worthwhile and interesting."],
  ["Problem", "Feeds reinforce settled interests, but can miss what someone wants to explore right now, or worthwhile subjects they have not met yet."],
  ["Hypothesis", "Trusted friends' discoveries could bring in interests that an individually personalized feed might miss."],
];

export default function SharedDiscoveryCaseStudy() {
  const p = getProject("shared-discovery");
  return (
    <div className="sd">
      {/* ------------------------------------------------ The Idea */}
      <section id="idea" aria-labelledby="idea-h">
        <div className="col">
          <Link href="/" className="back sd-rise" style={{ ["--i" as string]: 0 }}><span className="sd-arrow" aria-hidden="true">←</span> Work</Link>
          <p className="sd-label sd-idea-label sd-rise" style={{ ["--i" as string]: 1 }}>The Idea{p ? ` · ${p.role}, ${p.year}` : ""}</p>
          <h1 id="idea-h" className="sd-title sd-rise" style={{ ["--i" as string]: 2 }}>What if your algorithm could learn from your friends' curiosity?</h1>
          <div className="sd-lede sd-rise" style={{ ["--i" as string]: 3 }}>
            <p>Your recommendations know what you love. But your friends are exploring entirely different worlds.</p>
            <p>Shared Discovery brings their curiosity into your feed, helping you discover things you might never have searched for.</p>
          </div>
        </div>
        <HeroLoop />
        <div className="col"><p className="sd-cap sd-hero-cap">An independent product design experiment, not a YouTube feature and not affiliated with YouTube.</p></div>
      </section>

      {/* ------------------------------------------------ The Problem */}
      <section id="problem" className="sd-problem" aria-labelledby="problem-h">
        <div className="col">
          <p className="sd-label">The Problem</p>
          <h2 id="problem-h" className="sd-h2big">The problem isn't a lack of content. It's what we discover.</h2>
          <p className="sd-intro">YouTube has an extraordinary range of content, yet our recommendations are largely shaped by what we have already watched. Are we only discovering more of what we already like?</p>
          <ol className="pr-steps">
            {STEPS.map(([k, v]) => <li key={k}><span className="sd-label">{k}</span><p>{v}</p></li>)}
          </ol>
          <p className="pr-note">This began as a product sense exercise on long-term viewer satisfaction. It prioritized interest mismatch and what someone wants in the current session, which a context-aware recommendation improvement would address more directly. Shared Discovery is one creative direction I chose to explore. It is an independent experiment, not something research showed to be the best answer.</p>
          <div className="pr-lines" aria-label="Three principles behind the experiment">
            <p>Satisfaction over engagement.</p>
            <p>Discovery over repetition.</p>
            <p>Curiosity beyond the individual.</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ The Experience */}
      <section id="experience" className="sd-exp" aria-labelledby="experience-h">
        <div className="col">
          <p className="sd-label">The Experience</p>
          <h2 id="experience-h" className="sd-h2big">What it would feel like.</h2>
        </div>
        <div className="sd-wide sd-figgap"><Prototype /></div>

        <div className="col sd-b-intro">
          <h3 className="sd-h3">One circle. Different discoveries.</h3>
          <p className="sd-intro">Everyone brings different interests to the circle. Shared Discovery lets those interests influence each other without making everyone's feed identical.</p>
        </div>
        <div className="sd-wide sd-figgap"><PersonaCompare /></div>
        <div className="col"><p className="sd-cap sd-b-cap">Switch between Alex, Sam and Maya, or press Surprise me for one step beyond what they usually watch.</p></div>

        <div className="col sd-close">
          <h3 className="sd-h3">An experiment in collective curiosity.</h3>
          <p className="sd-intro">Shared Discovery explores whether recommendations influenced by trusted friends can introduce more unfamiliar, worthwhile content while keeping each person's experience their own. This concept would be evaluated through a controlled prototype study measuring perceived relevance, worthwhile novelty and willingness to return.</p>
        </div>
      </section>

      <div className="col">
        <footer className="sd-foot">
          <p className="sd-cap">Shared Discovery is a personal product design experiment. The people, circles and numbers are fictional. Videos, titles, channel names and thumbnails are real and belong to their creators; thumbnails load from YouTube's own image host and every video links back to YouTube. Recommendations come from simple rules, not a real model.</p>
          <p><Link href="/" className="back"><span className="sd-arrow" aria-hidden="true">←</span> Back to work</Link></p>
        </footer>
      </div>
    </div>
  );
}
