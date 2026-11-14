"use client";
import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setDone(true); setTimeout(() => setDone(false), 1600); } catch { window.location.href = `mailto:${email}`; }
  };
  return (
    <button className="sans dotted copy" onClick={copy} aria-label={`Copy email address ${email}`}>
      {done ? "Copied" : email}
      <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="8" height="8" rx="1.5" /><path d="M3 10.5V4a1 1 0 0 1 1-1h6.5" /></svg>
    </button>
  );
}
