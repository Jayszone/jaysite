"use client";
import { useEffect, useState } from "react";
import { applyTheme, randomTheme } from "@/lib/theme-client";

// Click any empty part of the page to switch to a random new colour theme.
// Links, buttons, form fields, text and images are left alone, as is any click that ends a text selection.
const IGNORE = "a, button, input, textarea, select, summary, details, label, dialog, p, h1, h2, h3, h4, li, dd, dt, figure, pre, code, table, blockquote, time, img, svg";

export default function ClickTheme() {
  const [said, setSaid] = useState("");
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || e.defaultPrevented || e.button !== 0 || t.closest(IGNORE)) return;
      if (window.getSelection()?.toString()) return;
      const n = randomTheme();
      applyTheme(n);
      setSaid(`Colours changed to ${n}`);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return <p className="sr-only" role="status">{said}</p>;
}
