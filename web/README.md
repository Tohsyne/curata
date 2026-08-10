# Curata — web

Next.js implementation. Full product/design/tech spec is in [`../spec.md`](../spec.md) and [`../design.md`](../design.md).

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it links to `/juliet`, a demo public profile.

## What's built (Phase 0-1)

- Design tokens from `spec.md` § Design → Style guide, implemented as Tailwind v4 theme (`app/globals.css`), light/dark aware.
- Public Profile surface (`1a` — full-width grid), at `app/[username]/page.tsx`.
- Component library from `spec.md` § Design → Component library (`components/`).
- Copy-link share button (real clipboard write, no backend needed).
- `supabase/migrations/0001_init.sql` — schema from `spec.md`, not yet applied to a live project.
- Real cover art: `lib/tmdb.ts` resolves movie/TV posters, `lib/places.ts` resolves restaurant photos — both live API lookups by title, cached 24h–7d via Next.js's fetch cache to limit request volume (Places bills per request). Needs `TMDB_API_KEY` and `GOOGLE_PLACES_API_KEY` in `.env.local` (see `.env.example`); falls back to `components/Placeholder.tsx` if a key is missing or a title doesn't resolve.

## What's mocked

There's no Supabase project yet, so `lib/mock-data.ts` stands in for the database — `getProfileByUsername()` returns a hardcoded "juliet" profile shaped exactly like a real Supabase query result will be (cover art resolved live via TMDB/Places, everything else hardcoded), so swapping in real auth/DB later is a one-function change, not a rewrite.

## Not built yet

Claim & Onboarding, Editor, Landing (`1d`), Lists/Saved CRUD — see `../spec.md` § Tech → Build plan for the phase order.
