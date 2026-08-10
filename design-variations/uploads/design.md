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

## Color System
- **Background:** `#F7F6F4` (warm off-white, not pure white — matches the Monogram reference's soft paper tone)
- **Surface / cards:** `#FFFFFF`
- **Primary text:** `#111111`
- **Secondary text:** `#8A8A8E`
- **Divider / hairline:** `#E8E7E4` at 1px, used sparingly — prefer spacing over borders
- **Dark elements (pills, active nav):** `#111111` fill, `#FFFFFF` text/icon
- **Color:** none in chrome. 100% delegated to cover art (posters, stills, food photography).

## Typography
- **Typeface:** a rounded, humanist sans (system default is fine — SF Pro Rounded on iOS, or Inter/Public Sans on web). Avoid geometric/mechanical sans — the reference's warmth comes from slightly rounded terminals.
- **Headline** (page title, greeting-style headers): 28–32px, `#111111`, tight leading (1.1), medium-bold weight. Conversational tone in copy ("Juliet's favorites," not "USER_PROFILE").
- **Section label:** 15px, medium weight, `#111111`
- **Body / description:** 14px, regular, `#8A8A8E`
- **Card title (film/show/restaurant name):** 15px, medium, `#111111`, one line, truncate with ellipsis
- **Metadata (year, rating, cuisine):** 13px, `#8A8A8E`

## Layout & Spacing
- Generous outer margin: 20px minimum on mobile
- Card corner radius: 16px for photo cards, 24px+ for pill-shaped controls
- Card imagery: fixed aspect ratio per category (2:3 for movie/show posters, 4:3 for restaurant photos) so grids stay rhythmic even with mixed source images
- Vertical rhythm between sections: 32px
- No heavy borders or drop shadows — separation comes from whitespace and the off-white/white contrast between background and card surface. Where a shadow is used, keep it barely visible: `0 1px 3px rgba(0,0,0,0.06)`

## Components

**Top bar**
Minimal: a menu/back affordance on the left, a single utility icon (share/save) on the right, no title text competing with the page's own headline below it.

**Favorite card (movies/TV)**
Poster-forward. Image fills the card, rounded corners, title + year in a thin caption below or as a gradient-scrim overlay at the bottom of the image itself (only place a scrim + white text is allowed — treat it as part of the "cover art carries color" rule, not new UI color).

**Favorite card (restaurants)**
Photo-forward, same treatment as posters but 4:3. Rating and price shown as small gray metadata beneath, matching the reference's map-card pattern (photo, name, star rating, $ signs, one-line description).

**Category sections**
Three quiet section labels — Movies, TV Shows, Restaurants — each introducing a horizontally scrollable or grid row of cards. No tabs, no color-coding per category; sections are distinguished by label and content only.

**Add/curate flow**
If an input is needed (e.g. searching to add a favorite), use the reference's pill-shaped search bar: full-width, black fill, rounded-full, white placeholder text, positioned at the bottom of the screen — not a boxed form field.

**Empty state**
Same quiet tone: short black headline, gray one-line supporting text, no illustration in brand color — if an illustration is used, keep it monochrome/line-art so it doesn't compete with the "cover art carries color" rule.

## Imagery Guidelines
- Always use official/high-res poster art, show key art, or real restaurant photography — never generic stock or color-filtered placeholders, since the whole palette strategy depends on authentic cover art.
- Do not apply color filters, duotones, or overlays to cover art except a subtle bottom gradient scrim for text legibility.
- Crop consistently per category (see aspect ratios above) so the page reads as curated rather than scraped.

## Icons
Thin-stroke, single-weight line icons (bookmark, share, mic/search, map pin) matching the reference — no filled/glyph icons, no color, 1.5px stroke.

## Motion (brief)
Keep transitions subtle and fast (150–200ms ease-out). Cards can lift slightly on press (scale 0.98) but should not introduce color or heavy shadow on interaction — the quiet-chrome rule applies to interaction states too.

## What This Is Not
- Not a chat/AI interface — no conversational bubbles or streaming text UI, despite the reference being an AI product. We're borrowing its visual quietness, not its interaction model.
- Not a social feed — no likes, comments, or activity indicators cluttering the neutral shell.
- Not color-coded by category — resist the urge to tint Movies/TV/Restaurants sections differently; cover art already provides all the visual distinction needed.
