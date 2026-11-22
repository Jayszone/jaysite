"use client";
import { useLayoutEffect, useRef, useState } from "react";

export type Wire = { a: string; b: string; live?: boolean; dim?: boolean; blocked?: boolean; via?: "top"; weight?: number };
type Drawn = { d: string; w: Wire; s: [number, number]; e: [number, number] };

/**
 * Dotted wires between nodes. It measures the `[data-n="id"] .sd-tile` boxes inside its parent
 * (which must be position: relative), so it follows the layout at any width. Purely decorative:
 * the meaning is always in the text next to it.
 */
export default function Wires({ wires }: { wires: Wire[] }) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState<Drawn[]>([]);
  const key = JSON.stringify(wires);

  useLayoutEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const calc = () => {
      const hr = host.getBoundingClientRect();
      const box = (id: string) => {
        const el = host.querySelector(`[data-n="${id}"] .sd-tile`) ?? host.querySelector(`[data-n="${id}"]`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { l: r.left - hr.left, r: r.right - hr.left, t: r.top - hr.top, b: r.bottom - hr.top };
      };
      const out: Drawn[] = [];
      for (const w of wires) {
        const a = box(w.a), b = box(w.b);
        if (!a || !b) continue;
        const ax = (a.l + a.r) / 2, ay = (a.t + a.b) / 2, bx = (b.l + b.r) / 2, by = (b.t + b.b) / 2;
        const dx = bx - ax, dy = by - ay;
        let s: [number, number], e: [number, number], d: string;
        if (w.via === "top") {
          const top = Math.min(a.t, b.t) - (26 + Math.abs(dx) * 0.2);
          s = [ax, a.t]; e = [bx, b.t];
          d = `M${s[0]} ${s[1]} C${s[0]} ${top} ${e[0]} ${top} ${e[0]} ${e[1]}`;
        } else if (Math.abs(dx) >= Math.abs(dy)) {
          const sg = dx >= 0 ? 1 : -1;
          s = [sg > 0 ? a.r : a.l, ay]; e = [sg > 0 ? b.l : b.r, by];
          const k = Math.abs(e[0] - s[0]) / 2;
          d = `M${s[0]} ${s[1]} C${s[0] + sg * k} ${s[1]} ${e[0] - sg * k} ${e[1]} ${e[0]} ${e[1]}`;
        } else {
          const sg = dy >= 0 ? 1 : -1;
          s = [ax, sg > 0 ? a.b : a.t]; e = [bx, sg > 0 ? b.t : b.b];
          const k = Math.abs(e[1] - s[1]) / 2;
          d = `M${s[0]} ${s[1]} C${s[0]} ${s[1] + sg * k} ${e[0]} ${e[1] - sg * k} ${e[0]} ${e[1]}`;
        }
        out.push({ d, w, s, e });
      }
      setDrawn((prev) => (JSON.stringify(prev) === JSON.stringify(out) ? prev : out));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(host);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <svg ref={ref} className="sd-wires" aria-hidden="true" focusable="false">
      {drawn.map(({ d, w, s, e }, i) => (
        <g key={i} className={`sd-wire${w.live ? " is-live" : ""}${w.dim ? " is-dim" : ""}${w.blocked ? " is-blocked" : ""}`} style={w.weight ? ({ ["--ww" as string]: w.weight } as React.CSSProperties) : undefined}>
          <path d={d} />
          <circle cx={s[0]} cy={s[1]} r="3" /><circle cx={e[0]} cy={e[1]} r="3" />
        </g>
      ))}
    </svg>
  );
}
