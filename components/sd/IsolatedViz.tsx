import { Figure } from "./Fig";

// Three people, three separate sets of interests. The circles barely touch: one marker where each
// pair overlaps. Illustrative, not data.
const PEOPLE = [
  { name: "Alex", items: ["AI", "Technology", "Design"] },
  { name: "Sam", items: ["Architecture", "History", "Urbanism"] },
  { name: "Jordan", items: ["Philosophy", "Biology", "Psychology"] },
];
const BRIDGES = [
  { who: "Alex and Sam", text: "Design and architecture both ask how a space should feel to the person inside it." },
  { who: "Alex and Jordan", text: "Every question about machine intelligence runs into a question about what understanding is." },
  { who: "Sam and Jordan", text: "Some of the best structures borrow from things that grew, not things that were built." },
];

export default function IsolatedViz() {
  return (
    <Figure caption="Illustrative interests for three people. Each lives in a separate recommendation environment.">
      <svg className="sd-venn" viewBox="0 0 560 340" role="img" aria-label="Three mostly separate circles for Alex, Sam and Jordan, overlapping only in three small places.">
        <g className="v-c">
          <circle cx="190" cy="125" r="108" /><circle cx="370" cy="125" r="108" /><circle cx="280" cy="222" r="108" />
        </g>
        <g className="v-n">
          <text x="140" y="92">Alex</text><text x="420" y="92">Sam</text><text x="280" y="290">Jordan</text>
        </g>
        <g className="v-m">
          {[[280, 92], [222, 186], [338, 186]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="14" /><text x={x} y={y + 5}>{i + 1}</text></g>)}
        </g>
      </svg>
      <div className="sd-venn-list">
        <ul className="sd-venn-who">
          {PEOPLE.map((p) => <li key={p.name}><b>{p.name}</b>{p.items.join(", ")}</li>)}
        </ul>
        <ol className="sd-venn-bridges">
          {BRIDGES.map((b) => <li key={b.who}><b>{b.who}</b>{b.text}</li>)}
        </ol>
      </div>
    </Figure>
  );
}
