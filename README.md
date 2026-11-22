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
`/work/shared-discovery` is a custom page, not MDX, in exactly three sections: **The Idea** (headline and `HeroLoop.tsx`, a quiet looping preview of a feed going from familiar topics to a circle's discoveries), **The Problem** (short product-sense reasoning and three typographic statements, in `CaseStudy.tsx`), **The Experience** (`Prototype.tsx`, then `PersonaCompare.tsx`). Code: `components/sd/`; data and rules: `lib/sd/data.ts` and `lib/sd/engine.ts`.
- **Experience A** demonstrates Personal -> Shared by itself while on screen (about 3.2 s, a spring transition, 4.2 s, rest, repeat), with Pause/Play and Replay; any touch hands control to the visitor, and the real consent sheet applies from then on. Reduced motion disables the automatic cycle.
- **Experience B** switches between Alex, Sam and Maya in one circle; its **Surprise me** slips in one unfamiliar-but-close video.
- **Videos are real.** `VIDEOS` in `data.ts` lists public YouTube videos (id, exact title and channel from YouTube's oEmbed). Thumbnails load from YouTube's image host (`i.ytimg.com`, see `thumbUrl`) and every video links back to YouTube. Nothing is copied into the repo. A removed video falls back to a neutral tile. People, circles and numbers are fictional; the app is a speculative concept, not affiliated with YouTube.
- **Durations and channel pictures** need the official Data API (a key): `YOUTUBE_API_KEY=... node scripts/fetch-video-durations.mjs` fills `lib/sd/durations.json` and `lib/sd/channels.json`. Until then cards show no duration badge and channel monograms; nothing is guessed.
- Recommendations come from a transparent, deterministic rule set (`engine.ts`): slots split between *your interests*, *the circle's interests* and *serendipity* (always next to something you like; never fewer than two familiar videos).
- Layout animation uses the `motion` package; reduced motion is respected. The fictional app uses a fixed light palette like a screenshot; the page follows the site theme.
- The hosted preview is a static export, so the demos only run locally or on a real deploy.
