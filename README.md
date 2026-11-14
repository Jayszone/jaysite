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
