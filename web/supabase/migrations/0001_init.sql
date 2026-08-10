-- Curata schema — mirrors spec.md § Tech → Data schema.
-- Not yet applied to a live Supabase project (Phase 0-1 pass has no backend wired up).

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
