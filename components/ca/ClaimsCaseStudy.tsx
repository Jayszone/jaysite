import Link from "next/link";
import "./ca.css";
import Frame from "@/components/Frame";
import WorkflowCompression from "./WorkflowCompression";
import ReviewLoop from "./ReviewLoop";

// Claims & Appeals Intelligence in three sections: The Challenge, The Product, The Impact.

export default function ClaimsCaseStudy() {
  return (
    <div className="ca">
      <section id="challenge" aria-labelledby="ch-h">
        <div className="col">
          <Link href="/" className="back">← Work</Link>
          <p className="ca-lab ca-sec">The Challenge</p>
          <h1 id="ch-h" className="ca-title">Claims &amp; Appeals Intelligence</h1>
          <p className="ca-head">Helping claims and appeals teams find the right guidance, faster.</p>
          <p className="ca-lede">An AI-powered decision-support assistant that turns complex internal policies and procedures into cited, reviewable answers, while keeping critical decisions in human hands.</p>
          <ul className="ca-meta" aria-label="Project details">
            <li>UnitedHealth Group</li><li>Product Manager, AI/ML</li><li>2024–2025</li><li>Enterprise AI</li><li>Healthcare Operations</li>
          </ul>
          <hr className="ca-rule" />
          <div className="ca-two">
            <p>Claims analysts regularly handled exceptions that automated systems couldn&apos;t resolve. Finding the applicable guidance meant searching across lengthy SOPs, comparing multiple documents, and checking whether the instructions were still relevant.</p>
            <p>Appeals representatives faced similar challenges while answering questions during live conversations.</p>
          </div>
        </div>
        <div className="ca-wide"><WorkflowCompression /></div>
      </section>

      <section id="product" aria-labelledby="pr-h">
        <div className="col">
          <p className="ca-lab ca-sec">The Product</p>
          <h2 id="pr-h" className="ca-h2">From answers to evidence-backed decisions.</h2>
          <p className="ca-lede">The first version could answer questions, but analysts still needed to independently verify the output. We introduced source citations so they could inspect the exact guidance behind each response.</p>
        </div>
        <div className="ca-wide"><ReviewLoop /></div>
        <div className="col ca-how">
          <h3 className="ca-h3">How the system works</h3>
          <p>Documents in PDF, Word, HTML, Excel and plain text are normalized, split into passages, embedded and indexed ahead of time. When an analyst asks a question, the assistant retrieves candidates with hybrid search, ranks them, writes an answer grounded in the top passages with citations, and hands it to a person to review.</p>
          <p>One limit: a document&apos;s last-updated timestamp is not the date its guidance takes effect. Effective-date and supersession metadata would make retrieval more accurate when versions overlap.</p>
          <div className="ca-arch"><Frame visual="appeals-architecture" alt="Architecture: an offline indexing pipeline and an online question-answering pipeline" /></div>
        </div>
      </section>

      <section id="impact" aria-labelledby="im-h">
        <div className="ca-wide">
          <div className="ca-impact ca-canvas">
            <p className="ca-lab">The Impact</p>
            <h2 id="im-h" className="ca-h2">Less time finding the guidance. The review stays human.</h2>
            <div className="im-grid">
              <div className="im-main">
                <p className="im-n">~80%</p>
                <p className="im-t">Reduction in time on the primary guidance investigation step.</p>
                <p className="im-q">This is one step, not total handling time. Secondary verification and senior review were unchanged.</p>
              </div>
              <div className="im-side">
                <div>
                  <p className="im-n im-n2">~20%</p>
                  <p className="im-t">Increase in adoption after citations were added.</p>
                  <p className="im-q">An observed change, not a randomized experiment.</p>
                </div>
                <div>
                  <p className="im-n im-n2">~$4M</p>
                  <p className="im-t">Estimated annual savings across claims and appeals.</p>
                  <p className="im-q">A business-case estimate based on time returned, not verified realized savings.</p>
                </div>
              </div>
            </div>
            <p className="im-qual">Appeals representatives could also retrieve cited guidance during live interactions, rather than searching while the person waited.</p>
          </div>
        </div>
        <div className="col ca-reflect">
          <h3 className="ca-h3">What changed my thinking.</h3>
          <p>An answer is only useful when people can trust and verify it. Introducing citations changed how analysts engaged with the assistant, while the challenges around policy versions reinforced the importance of contextual accuracy.</p>
          <p>If I were building this again, I would design evidence traceability and effective-date awareness into the first version, and measure improvement across the entire workflow from the beginning.</p>
        </div>
      </section>
    </div>
  );
}
