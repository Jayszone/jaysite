# Jay Naik — personal site

Next.js (App Router) · TypeScript · plain-CSS design tokens · MDX content. No client-side animation libraries.

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run lint                 # type-check
```
Set `NEXT_PUBLIC_SITE_URL` for correct sitemap / social-preview URLs.

## Edit content (no layout changes needed)

| What | Where |
| --- | --- |
| Name, intro, email, links, timezone, city, portrait, resume | `content/site.json` |
| Experience rows (About) | `content/timeline.json` |
| Projects (`/work/<slug>`) | `content/projects/*.mdx` — frontmatter: title, slug, year, role, summary, tags, order, `image` (e.g. `/projects/x.jpg`, put files in `public/`) |
| Articles (`/thinking/<slug>`) | `content/articles/*.mdx` — title, slug, date, summary, tags, `draft: true` to hide |
| Curiosities | `content/curiosities.json` |
| Photo collage on About | `content/lenses.json` (add `src`, position/size in %) |

MDX extras: `<PullQuote>`, `<Note>`, `<Figure src caption />`, GFM tables, code blocks.
Anything marked **Placeholder** shows a visible badge. Remove `placeholder: true` when real.
`/work` redirects to `/` (the home page *is* the work index).

## Structure
`app/` routes + `globals.css` (the design system) · `components/` Header, Footer, ThemeToggle, Frame, CopyEmail, ArticleBrowser, Mdx · `content/` · `lib/content.ts` · `docs/`.

## Behaviour
Server-rendered, readable without JS. Theme toggle cycles light → olive → ember and is stored in `localStorage`. Reduced-motion disables transitions, the collage drift and the progress bar. Collage parallax and reading-progress use CSS scroll-driven animations (progressive: static where unsupported).

## Shared Discovery (interactive case study)
`/work/shared-discovery` is a custom page, not MDX. Code: `components/sd/` (chapters, prototype, thumbnails, `sd.css`), data and rules: `lib/sd/data.ts` and `lib/sd/engine.ts`.
- All people, circles, videos and numbers are fictional. Thumbnails are flat title cards drawn in code (`Thumb.tsx`), so there are no image assets or licences to track.
- Visual system: diagrams share one kit (`Fig.tsx` tiles, frames, dot-grid canvas; `Wires.tsx` measured dotted wires) coloured from the site theme (`--pop-2` accent). The fictional "Watch" app (`AppUI.tsx`, `Prototype.tsx`, `HeroMock.tsx`) uses a fixed light palette like a screenshot.
- Recommendations come from a transparent, deterministic rule set (`engine.ts`): slots are split between *your interests*, *the circle's interests* and *serendipity* (always next to something you like, and never fewer than two familiar videos).
- Add a video in `VIDEOS`, a person in `PEOPLE`, or a circle in `CIRCLES`; every chapter picks it up.
- The hosted preview is a static export, so the interactions only run locally (`npm run dev`).
