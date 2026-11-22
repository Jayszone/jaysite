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
`/work/shared-discovery` is a custom page, not MDX. Code: `components/sd/` (sections, the fictional "Watch" app, demos, `sd.css`), data and rules: `lib/sd/data.ts` and `lib/sd/engine.ts`.
- **Videos are real.** `VIDEOS` in `data.ts` lists public YouTube videos (id, exact title and channel name from YouTube's oEmbed endpoint). Thumbnails load from YouTube's own image host (`i.ytimg.com`, see `thumbUrl`) and every video links back to YouTube. Nothing is copied into the repo. If a video is removed, its card falls back to a neutral tile. People, circles and numbers are fictional; the app is a speculative concept, not affiliated with YouTube.
- **Durations** need the official Data API (a key). Run `YOUTUBE_API_KEY=... node scripts/fetch-video-durations.mjs` to fill `lib/sd/durations.json`; until then no duration badge is shown and nothing is guessed. Channel avatars are monograms for the same reason.
- Recommendations come from a transparent, deterministic rule set (`engine.ts`): slots are split between *your interests*, *the circle's interests* and *serendipity* (always next to something you like, and never fewer than two familiar videos).
- Three demos use the real app UI and Motion (`motion` package) for layout animation: `Prototype.tsx` (Personal vs Shared), `PersonaCompare.tsx` (one circle, three members), `SurpriseDemo.tsx`. Reduced motion is respected.
- Diagrams share one kit (`Fig.tsx`, `Wires.tsx`) coloured from the site theme; the app uses a fixed light palette like a screenshot.
- To change the catalogue: add a video in `VIDEOS` (check the id with oEmbed first), a person in `PEOPLE`, or a circle in `CIRCLES`; every section picks it up.
- The hosted preview is a static export, so the interactions only run locally (`npm run dev`) or on a real deploy.
