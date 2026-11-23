import Link from "next/link";
import "./hs.css";

// Healthee Access as two consulting-style slides. Every figure comes from the project record:
// pilot numbers are observed, the $7.79M is a modeled opportunity from historical claims.

export default function HealtheeCaseStudy() {
  return (
    <div className="hs">
      <div className="col">
        <Link href="/" className="back">← Work</Link>
        <h1 className="hs-h1">Healthee Access</h1>
        <p className="hs-sub">A 0→1 employer-sponsored direct-pay access program: from opportunity, to a 100-person pilot, to a business case for a client.</p>
        <ul className="hs-meta" aria-label="Project details">
          <li>Product Management Intern</li><li>2026</li><li>Healthcare</li><li>Strategy · Pilot to scale</li>
        </ul>
      </div>

      <div className="hs-wide">
        {/* ------------------------------------------------ Slide 1 */}
        <figure className="hs-fig">
          <section className="hs-slide" aria-labelledby="s1">
            <p className="hs-kick">1 · Opportunity and pilot strategy</p>
            <h2 id="s1" className="hs-title">A direct-pay access model could unlock lower-cost care, but required validation on demand, operations, and employee experience</h2>
            <div className="hs-grid g1">
              <div className="hs-col">
                <h3>Opportunity</h3>
                <ul>
                  <li>Some routine diagnostic and outpatient services cost less when paid for directly than when billed through insurance. The gap varies by service and market.</li>
                  <li>Employees take on steps insurance normally handles: a physician order where required, a provider that accepts direct payment, booking and payment.</li>
                  <li>Open question: would employees use a program that handled those steps for them?</li>
                </ul>
              </div>
              <div className="hs-col">
                <h3>Strategic choices</h3>
                <dl className="hs-choices">
                  <div><dt>Procedure scope</dt><dd>Started small, grew to 27 procedures: imaging and radiology, lab testing, OB-GYN, cardiac imaging, orthopedics, office visits.</dd></div>
                  <div><dt>Operating model</dt><dd>Guided journey from eligibility to payment, with no claim filed. Four routes to physician orders compared; orders coordinated for about half the services.</dd></div>
                  <div><dt>Assumptions to test</dt><dd>Employees will register and return. Orders, provider acceptance and booking can be run reliably. Price can be weighed against experience.</dd></div>
                </dl>
              </div>
              <div className="hs-col hs-pilot">
                <h3>Pilot snapshot</h3>
                <dl className="hs-metrics">
                  <div><dd>100</dd><dt>employees and dependents invited</dt></div>
                  <div><dd>90</dd><dt>registered</dt></div>
                  <div><dd>~85%</dd><dt>used the program</dt></div>
                  <div><dd>92%</dd><dt>of users returned to use it again</dt></div>
                </dl>
              </div>
            </div>
            <p className="hs-bar"><b>Takeaway</b>The pilot showed strong initial demand and repeat usage, validating employee interest in a guided direct-pay access model.</p>
            <p className="hs-src">Source: Healthee Access pilot. One employer group of 100 people; early validation, not market-wide proof. Usage and return rates are not long-term retention.</p>
          </section>
          <figcaption>Slide 1 of 2</figcaption>
        </figure>

        {/* ------------------------------------------------ Slide 2 */}
        <figure className="hs-fig">
          <section className="hs-slide" aria-labelledby="s2">
            <p className="hs-kick">2 · Business case and recommendation</p>
            <h2 id="s2" className="hs-title">Pilot results and claims analysis supported a scalable employer offering with meaningful modeled savings potential</h2>
            <div className="hs-grid g2">
              <div className="hs-col">
                <h3>Analysis</h3>
                <ul>
                  <li>Analyzed 5,000+ claims data points from a large employer client.</li>
                  <li>Identified the high-cost categories direct access could address.</li>
                  <li>Modeled adoption at 10%, 20% and 30%.</li>
                  <li>Combined the claims analysis, pilot data and procedure-level costs into pricing and rollout recommendations.</li>
                </ul>
              </div>
              <div className="hs-col">
                <h3>Impact</h3>
                <dl className="hs-big">
                  <div className="lead"><dd>Up to $7.79M</dd><dt>modeled savings opportunity</dt><dd className="note">Modeled from historical claims. Not realized savings. Realizing under 0.5% of it would cover the program&apos;s cost.</dd></div>
                  <div><dd>5,000+</dd><dt>claims data points analyzed</dt></div>
                  <div><dd>~$70K</dd><dt>pilot delivered against a $100K budget, about 30% under</dt></div>
                  <div><dd className="txt">Client deal secured</dd><dt>after the recommendation was presented to company stakeholders</dt></div>
                </dl>
              </div>
              <div className="hs-col hs-rec">
                <h3>Recommendation</h3>
                <p className="hs-lead">Scale the offering through:</p>
                <ol>
                  <li>Focus on procedures with the strongest savings opportunity</li>
                  <li>Preserve guided support for navigation and booking</li>
                  <li>Price based on demonstrated employer value</li>
                  <li>Expand through phased rollout</li>
                </ol>
              </div>
            </div>
            <p className="hs-bar"><b>Conclusion</b>The project progressed from pilot validation to a commercially credible business case for employer expansion.</p>
            <p className="hs-src">Source: Healthee Access pilot; claims analysis for a large employer client. Savings are a modeled opportunity based on historical claims, not realized results.</p>
          </section>
          <figcaption>Slide 2 of 2</figcaption>
        </figure>
      </div>

      <div className="col hs-end">
        <h3>What I took from it</h3>
        <p>Most of the pilot&apos;s problems were handoffs: physician orders, provider acceptance and payment. The idea held up. Most of the teams it depended on did not report to me, so I learned to ask for specific things early.</p>
        <p>It also changed how I judge analytical work. At UnitedHealth I measured a model by how well it performed. Here the claims analysis mattered because of the decision it supported.</p>
      </div>
    </div>
  );
}
