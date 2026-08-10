# Curata — Spec v0.1

Source: problem statement (movies/TV/restaurants favorites), `design.md`, and wireframes `1a`–`1d` in `design-variations/`.

---

## Product

**Problem.** Taste in film, TV, and food is fragmented across single-category apps (Letterboxd, Trakt, Yelp) with no single place to express "what I love" across all three, and no quick way to hand that to a friend.

**Who it's for.** People who already track or think about their taste in these categories and want one page to point people to — not a new social network to build a following on.

**Goals**
1. A new user can publish a page with favorites in all three categories in under ~10 minutes.
2. A visitor with no account can land on a page and walk away with one usable recommendation.
3. Owners come back to add/update favorites at least monthly (page stays alive, not a one-time snapshot).

**Non-goals**
- Not a social feed — no likes, comments, follows, or activity stream.
- Not a star-rating system — one-sentence reviews only, no numeric scoring.
- Not collaborative — single-owner pages in v1, no shared/multi-editor lists.
- Not a recommendation engine — no algorithmic "you might also like."

### Decisions locked

- **Profile layout: `1a`** (full-width grid, stacked sections) — simplest build, collapses to mobile without a separate layout.
- **Landing layout: `1d`** (poster-wall hero) — leads with visuals. *Dependency: needs a fully curated seed profile (18 real posters) before it looks finished — this gates when Landing can ship, see Build plan.*
- **Follow — cut.** No follow/notification feature; matches the not-a-social-feed non-goal.
- **One login = one profile** for v1 (no multi-profile accounts).
- **Usernames are immutable** once claimed — no rename.
- **Zero favorites is a valid published state** — no minimum content gate at claim.

### Surfaces

Requirements and stories are scoped per surface so new surfaces (mobile, embed widget, API) can be added later without rewriting the rest.

**1. Landing** *(public, unauthenticated — converts visitors into claimed pages, ships as `1d`)*
- P0: poster-wall hero (18 curated posters), headline + one-line pitch, claim CTA (username + email)
- P1: 3-step explainer, reviews/lists strip below the fold
- Story: as a visitor, I understand what Curata is and can claim a username in one step.

**2. Claim & Onboarding** *(gets a new owner from claim to published page)*
- P0: username availability check (immutable once set), magic-link email verification, guided add-first-favorites step (optional — see Decisions locked)
- P1: progress indicator ("12 is enough")
- Story: as a new owner, I claim my username and can publish immediately, even with zero favorites.

**3. Public Profile** — `curata.co/{username}` *(the shareable artifact itself, ships as `1a`)*
- P0: identity block, three category sections (Movies/TV/Restaurants), copy-link share
- P1: lists, saved-for-later (restaurants only — see Decisions locked), recent reviews
- Story: as a visitor, I view a page with no login and get one usable recommendation.

**4. Editor** *(authenticated, owner-only — add/edit favorites, reviews, lists)*
- P0: search-and-add flow (TMDB / Places), one-sentence review field (280 char cap), edit/delete
- P1: create/manage lists, toggle saved-for-later (restaurants only)
- P2: manual cover-image override
- Story: as an owner, I search a title once and get poster art + metadata auto-filled.

**Success metrics**
- Leading: % of claimed pages with ≥1 favorite per category within 24h; median time-to-publish (target <10 min)
- Lagging: 30-day return-and-edit rate; shared-link click-through

---

## Design

Core rule: **quiet interface, loud cover art** — chrome stays neutral; all color comes from posters, key art, and restaurant photography. No brand accent anywhere in the UI. Rationale lives in [`design.md`](design.md); this section is the token/component source of truth (exact values, full component list) and should be kept in sync with it.

**Wireframe variations reviewed**

| ID | Screen | Layout | Status |
|---|---|---|---|
| `1a` | Public profile | Full-width, sections stacked top to bottom | **Shipping v1** — grid density set by `posterColumns` prop |
| `1b` | Public profile | Sticky identity rail (name/bio/nav) + scrolling content | Explored, not building — also drop its "Follow" pill (cut, see Product) |
| `1c` | Landing | Pitch copy left, live example profile right | Explored, not building |
| `1d` | Landing | Full-width poster wall hero, pitch below | **Shipping v1** — blocked on a fully curated seed profile |

### Style guide

**Color**
| Token | Value | Use |
|---|---|---|
| `bg` | `#F7F6F4` | Page background |
| `surface` | `#FFFFFF` | Cards |
| `text` | `#111111` | Primary text |
| `text-2` | `#8A8A8E` | Secondary text, metadata |
| `border` | `#E8E7E4` | Hairline dividers |
| `pill` | `#111111` fill / `#FFFFFF` text | CTA pills, active states |

**Type** — system rounded sans (SF Pro Rounded / Inter / Public Sans); monospace for the URL slug.
| Role | Size / weight |
|---|---|
| Headline | 28–32px / 600, tight leading |
| Section label | 15px / 500 |
| Body | 14px / 400, `text-2` |
| Card title | 15px / 500 |
| Metadata | 13px / 400, `text-2` |

**Spacing** — 8 / 12 / 16 / 20 / 24 / 32 / 40px scale. Outer margin 20px min. Section rhythm 32px.

**Radius** — 12px (small cards), 16px (poster/photo cards), 20–24px (containers, pills).

**Elevation** — one shadow only, barely visible: `0 1px 3px rgba(0,0,0,.06)`. No heavier shadows, no borders as a substitute for spacing.

### Component library

| Component | Spec |
|---|---|
| Top bar | Wordmark left, one action right (Share on profile, Claim CTA on landing). No page title — the headline below carries it. |
| Identity block | Photo (44–56px radius circle), name (28–32px/600), one-line bio (14px gray), counts row (13px gray, `·`-separated) |
| Category section | Section label (15px/500) + count (13px gray) on one baseline, then a card grid |
| Movie/TV card | 2:3 poster, 16px radius, title (15px/500) + meta (13px gray) below or as bottom gradient-scrim overlay |
| Restaurant card | 4:3 photo, 16px radius, title + rating/price/cuisine (structured fields, not one string) + one-line note |
| Saved item *(restaurants only)* | 4:3 photo, 12px radius, title (13px) + cuisine/city meta (12px gray) — no rating shown, since it hasn't been visited yet |
| Review row | 2:3 thumbnail (56px wide) + title/meta baseline + quote (14px gray), hairline divider below |
| List row | Name (15px) + meta (13px gray) left, count (13px gray) right, hairline divider |
| Claim / search pill | Full-width black pill, mono `curata.co/` prefix, white input text, white CTA chip inset right |

---

## Tech

**Architecture.** Public profile pages are read-mostly and meant to be shared as links — favor server-rendered or statically generated pages per profile for load speed and link previews (OG image/title). A separate authenticated editor surface handles adding/editing favorites, reviews, and lists.

### Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js (React, App Router) — one codebase for landing, public profile, and editor |
| Styling | Tailwind CSS, tokens mapped to the Design style guide above |
| Database | Postgres (via Supabase) |
| Auth | Supabase Auth, magic-link email (passwordless) |
| Storage/CDN | Supabase Storage, caching fetched poster/photo assets |
| Hosting | Vercel — path-based routing (`curata.co/username`) |
| External APIs | TMDB (movies/TV), Google Places API (restaurants) |

### Tradeoffs

| Decision | Choice | Alternative considered | Why |
|---|---|---|---|
| Rendering | Next.js SSR/SSG | Client-only SPA | Public profiles need fast load + OG link previews for sharing — a bare SPA can't do that |
| Backend | Supabase (Postgres + Auth + Storage managed together) | Custom Node API + separate auth provider | One person building with AI-assisted tooling benefits from fewer moving parts to wire up and operate |
| Restaurant data | Google Places API | Yelp Fusion | Broader global coverage (matches Lisbon/Oakland-style cross-city use in the wireframes); revisit if photo-usage cost becomes prohibitive |
| Profile ownership | One login = one profile (`profiles.user_id` unique) | Multi-profile per account | Simpler auth and schema for v1; revisit if people want multiple curated pages under one login |
| Restaurant metadata | Structured `restaurant_details` table (rating, price_level, cuisine, city) | Single opaque `meta` string | Enables sorting/filtering by rating, price, or cuisine later without a migration |
| Saved-for-later | Boolean flag on `favorite_items`, **restaurants only** | Applies to all categories | Movies/TV already have Lists as a "to-watch" bucket; restaurants need a lightweight want-to-try queue that Lists don't cover |
| Hosting | Vercel | Self-hosted (Docker/Fly.io) | Zero-ops deploys pair naturally with Next.js; revisit only if cost or platform limits become a problem |

### Data schema

```sql
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  username text unique not null,       -- immutable once claimed, no rename
  display_name text not null,
  avatar_url text,
  location text,
  bio text,
  created_at timestamptz not null default now()
);

create type favorite_category as enum ('movie', 'tv', 'restaurant');
create type favorite_source as enum ('tmdb', 'places');

create table favorite_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  category favorite_category not null,
  external_source favorite_source not null,
  external_ref text not null,          -- TMDB id / Google Place id
  title text not null,
  meta text,                           -- movie/tv only: "2023 · Celine Song"
  image_url text,
  is_saved boolean not null default false,   -- saved-for-later; restaurants only
  created_at timestamptz not null default now(),
  unique (profile_id, external_source, external_ref),
  check (is_saved = false or category = 'restaurant')
);

create table restaurant_details (
  favorite_item_id uuid primary key references favorite_items(id) on delete cascade,
  rating numeric(2,1),
  price_level smallint check (price_level between 1 and 4),
  cuisine text,
  city text
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  favorite_item_id uuid not null references favorite_items(id) on delete cascade,
  body varchar(280) not null,
  created_at timestamptz not null default now()
);

create table lists (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  updated_at timestamptz not null default now()
);

create table list_items (
  list_id uuid not null references lists(id) on delete cascade,
  favorite_item_id uuid not null references favorite_items(id) on delete cascade,
  primary key (list_id, favorite_item_id)
);
```

### Build plan

| Phase | Scope | Surfaces touched |
|---|---|---|
| 0 — Foundation | Repo scaffold, Supabase project + schema migration, auth wiring, Tailwind theme from the style guide | — |
| 1 — Claim + Profile skeleton | Username claim (immutable), magic-link verification, empty-state public profile render (`1a`) — publishable at zero favorites | Claim & Onboarding, Public Profile |
| 2 — Editor core | TMDB + Places search-and-add, structured restaurant fields, one-sentence review field (280 char), edit/delete | Editor |
| 3 — Landing | Curate the seed profile's 18 posters first, then ship `1d`, 3-step explainer wired to real claim flow | Landing |
| 4 — Lists & saved | List CRUD, saved-for-later toggle (restaurants only), recent-reviews ordering | Public Profile, Editor |
| 5 — Polish & P2s | Manual cover-image override | Editor |

**Open questions**
- Username/slug collision handling and moderation policy *(tech)*
- TMDB API terms for this use case (commercial display of poster art) *(tech/legal)*
- Google Places photo-usage/cost terms at scale *(tech)*
