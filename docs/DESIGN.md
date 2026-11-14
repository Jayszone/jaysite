# Design direction (v3)

## Where it came from
The first build (3D Renaissance concept) was rejected. The direction is now taken from **screenshots of harshux.com supplied by the owner**; `bencho.dev` and the original `recent.design` references were never viewable (blocked network), and a separate site (balogunoluwasogo.com) was seen only briefly and then set aside.

**Verified from screenshots:** off-white page; one narrow centred column; a book-like old-style serif throughout; header with a monogram, a four-link serif nav (active black, others grey), a theme toggle and a sound toggle; first-person welcome copy with inline underlined links; "Get in touch" links in a sans with dotted underlines (one copies the email); "Selected works" as large framed panels with a bold title and a grey one-liner; an About page with photo + prose + an Experience table (date | role); three colour themes seen (light, olive/cream, brown/amber); a scattered full-bleed photo collage with the text dimmed; a footer with a live local-time line; a floating "Leave a comment" pill.
**Not verifiable from stills (so not copied):** the sound toggle's behaviour, how the collage and text-dimming actually animate, the comment tool, hover states, writings index.

## What this site does with it (original execution)
- Own monogram (JN), own copy, own placeholder visuals. Nothing reused from the reference.
- EB Garamond (display/body) + Inter (utility/contact). Self-hosted via Fontsource.
- Themes: `light`, `olive`, `ember` — CSS variables on `<html data-theme>`, set before paint.
- Pages: `/` (intro + selected work), `/work/<slug>`, `/curiosities` (expanding list), `/thinking` (+ article), `/about` (photo, experience, collage).
- Details: JN mark turns on hover; framed work panel lifts its card on hover; footer line reads the visitor-independent timezone from `site.json`; collage items drift slowly with scroll (CSS only).

## Deliberately omitted
Sound toggle (needs audio assets and unknown behaviour), "Leave a comment" (needs a backend/third-party tool), WebGL/GSAP (removed with the old concept).

## Accessibility
Skip link, semantic landmarks, visible focus, `aria-current` nav, native `<details>` for curiosities, contrast-checked muted colours per theme, reduced-motion support, mobile layouts at 390px.
