import { Arrow, Box } from "@/components/Visuals";
import MetricCalc from "./MetricCalc";

export default function ExperimentDesign() {
  const x = (i: number) => 14 + i * 250;
  return (
    <div className="sd-exp">
      <div className="viz-scroll">
        <svg className="viz sketch" viewBox="0 0 940 300" role="img" aria-label="Experiment design. Group A: personal feed, then exploration, then feedback. Group B: shared feed, then exploration, then feedback. Both feedback results are compared on the Worthwhile Novel Discovery Rate.">
          <text x="14" y="26" className="lane" style={{ textAnchor: "start" }}>A. Personal recommendations</text>
          {["Personal feed", "Exploration", "Feedback"].map((t, i) => <Box key={t} x={x(i)} y={40} w={200} h={64} title={t} sub={["Alex's usual topics", "watch, skip, open", "unfamiliar? worthwhile?"][i]} seed={10 + i} tone={i === 2 ? 2 : 1} />)}
          {[0, 1].map((i) => <Arrow key={i} a={[x(i) + 203, 72]} b={[x(i + 1) - 4, 72]} seed={20 + i * 4} />)}
          <text x="14" y="166" className="lane" style={{ textAnchor: "start" }}>B. Recommendations with group interests</text>
          {["Shared feed", "Exploration", "Feedback"].map((t, i) => <Box key={t} x={x(i)} y={180} w={200} h={64} title={t} sub={["same person, plus the circle", "watch, skip, open", "unfamiliar? worthwhile?"][i]} seed={40 + i} tone={i === 2 ? 2 : 1} />)}
          {[0, 1].map((i) => <Arrow key={i} a={[x(i) + 203, 212]} b={[x(i + 1) - 4, 212]} seed={50 + i * 4} />)}
          <Box x={x(3) - 20} y={104} w={192} h={84} title="Compare" sub={["Worthwhile Novel", "Discovery Rate"]} seed={70} tone={0} dashed />
          <Arrow a={[x(2) + 203, 80]} b={[x(3) - 22, 134]} seed={72} />
          <Arrow a={[x(2) + 203, 206]} b={[x(3) - 22, 160]} seed={76} />
        </svg>
      </div>
      <div className="sd-exp-grid">
        <div>
          <p className="sd-kicker">Hypothesis</p>
          <p className="sd-quote">Users will find more worthwhile and unfamiliar videos when recommendations include interests from their trusted circle.</p>
          <p className="sd-kicker" style={{ marginTop: "1.6rem" }}>What I would ask</p>
          <ul className="sd-qs">
            <li>Do people discover unfamiliar topics they find worthwhile?</li>
            <li>Do they understand how collective personalization works?</li>
            <li>Do they prefer the shared experience?</li>
            <li>Are they comfortable with its privacy boundaries?</li>
            <li>Would they come back to it?</li>
          </ul>
        </div>
        <div>
          <p className="sd-kicker">The metric</p>
          <p className="sd-metric"><b>Worthwhile Novel Discovery Rate</b>The share of explored recommendations that a person calls both unfamiliar and worthwhile.</p>
          <MetricCalc />
        </div>
      </div>
    </div>
  );
}
