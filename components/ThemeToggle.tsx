"use client";
import { useEffect, useState } from "react";

const THEMES = ["light", "olive", "ember"] as const;
const LABEL = { light: "light", olive: "olive", ember: "ember" };

// Cycles light → olive → ember. Persisted; applied before paint by the inline script in layout.
export default function ThemeToggle() {
  const [t, setT] = useState<(typeof THEMES)[number]>("light");
  useEffect(() => {
    const cur = document.documentElement.dataset.theme as (typeof THEMES)[number] | undefined;
    if (cur && THEMES.includes(cur)) setT(cur);
  }, []);
  const next = () => {
    const n = THEMES[(THEMES.indexOf(t) + 1) % THEMES.length];
    setT(n);
    document.documentElement.dataset.theme = n;
    try { localStorage.setItem("theme", n); } catch { /* storage unavailable */ }
  };
  return (
    <button className="theme" onClick={next} aria-label={`Change colour theme (now ${LABEL[t]})`}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" /><path d="M10 2a8 8 0 0 1 0 16z" /></svg>
    </button>
  );
}
