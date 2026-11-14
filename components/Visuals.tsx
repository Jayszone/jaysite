// Original, theme-aware line graphics for projects. Pure SVG: they take their colours
// from the active theme, scale crisply and need no image files. Add one, then set
// `visual: <key>` in the project's frontmatter.

function AppealsFlow() {
  return (
    <svg className="viz" viewBox="0 36 640 252" role="img"
      aria-label="Diagram: appeal documents are matched to policy, a draft is written with numbered citations pointing back to the policy, a reviewer checks it, and a decision goes out.">
      <defs>
        <marker id="arw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M1 1 L9 5 L1 9" className="st" />
        </marker>
      </defs>

      {/* 1 · incoming documents */}
      <g>
        <rect x="14" y="110" width="62" height="78" rx="5" className="st mu fl" />
        <rect x="22" y="118" width="62" height="78" rx="5" className="st mu fl" />
        <rect x="30" y="126" width="62" height="78" rx="5" className="st fl" />
        <path d="M42 146 H80 M42 158 H80 M42 170 H66" className="st mu" />
      </g>

      {/* 2 · policy retrieval, two passages highlighted */}
      <g>
        <rect x="150" y="104" width="84" height="112" rx="5" className="st fl" />
        <path d="M162 122 H222 M162 150 H222 M162 164 H222 M162 178 H222 M162 204 H206" className="st mu" />
        <path d="M162 136 H222 M162 190 H222" className="st hi" />
      </g>

      {/* 3 · draft with numbered citations */}
      <g>
        <rect x="280" y="96" width="84" height="128" rx="5" className="st fl" />
        <path d="M292 118 H352 M292 134 H340 M292 150 H352 M292 166 H328 M292 182 H352 M292 198 H320" className="st mu" />
        <circle cx="280" cy="136" r="10" className="fg" /><text x="280" y="140" className="num">1</text>
        <circle cx="280" cy="190" r="10" className="fg" /><text x="280" y="194" className="num">2</text>
      </g>
      {/* citation links back to the policy */}
      <path d="M270 136 H230 M270 190 H230" className="st mu dash" />

      {/* 4 · human review */}
      <g>
        <circle cx="454" cy="160" r="38" className="st mu dash" />
        <circle cx="454" cy="160" r="28" className="st fl" />
        <path d="M441 160 L451 170 L469 149" className="st ck" />
      </g>

      {/* 5 · decision */}
      <g>
        <rect x="548" y="124" width="64" height="76" rx="5" className="st fl" />
        <path d="M560 146 H600 M560 160 H600 M560 174 H584" className="st mu" />
        <circle cx="608" cy="196" r="13" className="fg" />
        <path d="M601 196 L606 201 L615 191" className="st ink" />
      </g>

      {/* flow */}
      <path d="M98 160 H142 M238 160 H272 M368 160 H412 M494 160 H540" className="st" markerEnd="url(#arw)" />
      <circle r="4" className="fg dot"><animateMotion dur="7s" repeatCount="indefinite" path="M98 160 H540" /></circle>
    </svg>
  );
}

export const VISUALS: Record<string, () => React.ReactElement> = { "appeals-flow": AppealsFlow };
