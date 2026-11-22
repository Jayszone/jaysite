"use client";
import { useState } from "react";

type S = { explored: number; unfamiliar: number; both: number };
const clampS = (s: S): S => { const explored = Math.max(1, Math.min(60, s.explored)); const unfamiliar = Math.max(0, Math.min(explored, s.unfamiliar)); return { explored, unfamiliar, both: Math.max(0, Math.min(unfamiliar, s.both)) }; };

function Column({ title, s, set }: { title: string; s: S; set: (s: S) => void }) {
  const rate = Math.round((s.both / s.explored) * 100);
  const f = (key: keyof S, label: string) => (
    <label className="sd-num"><span>{label}</span>
      <input type="number" inputMode="numeric" min={0} max={60} value={s[key]} onChange={(e) => set(clampS({ ...s, [key]: Number(e.target.value) || 0 }))} />
    </label>
  );
  return (
    <div className="sd-calc-col">
      <h3>{title}</h3>
      {f("explored", "Recommendations explored")}
      {f("unfamiliar", "Marked unfamiliar")}
      {f("both", "Unfamiliar and worthwhile")}
      <p className="sd-rate" aria-live="polite"><b>{rate}%</b><span>Worthwhile Novel Discovery Rate</span></p>
    </div>
  );
}

export default function MetricCalc() {
  const [a, setA] = useState<S>({ explored: 20, unfamiliar: 6, both: 3 });
  const [b, setB] = useState<S>({ explored: 20, unfamiliar: 10, both: 6 });
  return (
    <div className="sd-calc">
      <p className="sd-cap">Illustrative inputs only. These are not results from any study. Change the numbers to see how the metric works.</p>
      <div className="sd-calc-grid"><Column title="A. Personal recommendations" s={a} set={(s) => setA(s)} /><Column title="B. With group interests" s={b} set={(s) => setB(s)} /></div>
      <p className="sd-formula"><b>Rate</b> = unfamiliar and worthwhile ÷ recommendations explored</p>
    </div>
  );
}
