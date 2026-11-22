import { Figure, Group, Node } from "./Fig";
import Wires from "./Wires";
import MetricCalc from "./MetricCalc";

export default function ExperimentDesign() {
  return (
    <>
      <Figure caption="Two groups, one question. The same person sees either their usual feed or one that includes the circle's interests.">
        <div className="sd-stage sd-exp-flow">
          <Wires wires={[
            { a: "a1", b: "a2" }, { a: "a2", b: "a3" }, { a: "b1", b: "b2", live: true }, { a: "b2", b: "b3", live: true },
            { a: "a3", b: "cmp", live: true }, { a: "b3", b: "cmp", live: true },
          ]} />
          <Group label="A · Personal recommendations" className="g-a">
            <div className="sd-row3">
              <Node id="a1" icon="feed" label="Personal feed" note="usual topics" />
              <Node id="a2" icon="compass" label="Exploration" note="watch, skip, open" />
              <Node id="a3" icon="chat" label="Feedback" note="unfamiliar? worthwhile?" />
            </div>
          </Group>
          <Group label="B · With the circle's interests" accent className="g-b">
            <div className="sd-row3">
              <Node id="b1" icon="people" label="Shared feed" note="plus the circle" />
              <Node id="b2" icon="compass" label="Exploration" note="watch, skip, open" />
              <Node id="b3" icon="chat" label="Feedback" note="unfamiliar? worthwhile?" />
            </div>
          </Group>
          <Node id="cmp" icon="scale" label="Compare" note="Worthwhile Novel Discovery Rate" tone="live" />
        </div>
      </Figure>
      <div className="sd-exp-grid">
        <div>
          <p className="sd-label">Hypothesis</p>
          <p className="sd-quote">Users will find more worthwhile and unfamiliar videos when recommendations include interests from their trusted circle.</p>
          <p className="sd-label" style={{ marginTop: "2rem" }}>What I would ask</p>
          <ul className="sd-qs">
            <li>Do people discover unfamiliar topics they find worthwhile?</li>
            <li>Do they understand how collective personalization works?</li>
            <li>Do they prefer the shared experience?</li>
            <li>Are they comfortable with its privacy boundaries?</li>
            <li>Would they come back to it?</li>
          </ul>
        </div>
        <div>
          <p className="sd-label">The metric</p>
          <p className="sd-metric"><b>Worthwhile Novel Discovery Rate</b>The share of explored recommendations that a person calls both unfamiliar and worthwhile.</p>
          <MetricCalc />
        </div>
      </div>
    </>
  );
}
