"use client";
import { useEffect, useState } from "react";
import { applyTheme, currentTheme, nextTheme } from "@/lib/theme-client";

// The visible, keyboard-friendly way to change colour (clicking empty space also does it).
export default function ThemeToggle() {
  const [name, setName] = useState("");
  useEffect(() => {
    setName(currentTheme());
    const obs = new MutationObserver(() => setName(currentTheme()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return (
    <button className="theme" onClick={() => applyTheme(nextTheme())} aria-label={`Change colours${name ? ` (now ${name})` : ""}`}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" /><path d="M10 2a8 8 0 0 1 0 16z" /></svg>
    </button>
  );
}
