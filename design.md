# Curata — Design Direction

## Product
Curata is a single page where someone shares their favorite movies, TV shows, and restaurants. It's a personal taste profile, not a feed or a tracker — one URL that says "here's what I love."

## Visual Reference
Inspiration: Monogram's iOS interface (4 reference screens — home, recipe generation, recipe detail, restaurant map). What we're borrowing from it is not the AI-chat interaction pattern, but the *visual quietness*: a neutral shell that gets out of the way, with photography doing all the color work.

## Core Principle: Quiet Interface, Loud Cover Art
The chrome — background, nav, text, icons — stays in a tight neutral range (off-white, black, 3–4 shades of gray). The only color on any screen comes from the movie posters, show art, and restaurant photos themselves. This does two things:
1. Cover art reads immediately as the content, not as decoration competing with UI color.
2. The same page looks cohesive whether someone's favorites are a moody film poster, a bright sitcom still, or a warm restaurant interior — the neutral frame unifies wildly different source imagery.

Never introduce a brand accent color into UI chrome (buttons, links, active states). If an accent is needed for a rare state (e.g. an error), use black/gray at higher weight before reaching for color.

## Tokens & Components
Exact color/type/spacing values and the full component library — including the restaurant-only saved-for-later tile added after the wireframe review — live in [`spec.md`](spec.md) (Design section), kept in sync with this doc as the single reference for both. This file stays the rationale doc; that one holds the literal values.

## Imagery Guidelines
- Always use official/high-res poster art, show key art, or real restaurant photography — never generic stock or color-filtered placeholders, since the whole palette strategy depends on authentic cover art.
- Do not apply color filters, duotones, or overlays to cover art except a subtle bottom gradient scrim for text legibility.
- Crop consistently per category (2:3 movies/TV, 4:3 restaurants — including saved-for-later restaurant tiles) so the page reads as curated rather than scraped.

## Icons
Thin-stroke, single-weight line icons (bookmark, share, mic/search, map pin) matching the reference — no filled/glyph icons, no color, 1.5px stroke.

## Motion (brief)
Keep transitions subtle and fast (150–200ms ease-out). Cards can lift slightly on press (scale 0.98) but should not introduce color or heavy shadow on interaction — the quiet-chrome rule applies to interaction states too.

## What This Is Not
- Not a chat/AI interface — no conversational bubbles or streaming text UI, despite the reference being an AI product. We're borrowing its visual quietness, not its interaction model.
- Not color-coded by category — resist the urge to tint Movies/TV/Restaurants sections differently; cover art already provides all the visual distinction needed.

*(Product-level non-goals — no social feed, no follow, no star ratings — live in `spec.md`, not here; this file only covers visual/interaction constraints.)*
