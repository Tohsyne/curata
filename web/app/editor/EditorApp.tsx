"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { addMovieOrShow, addRestaurant, deleteFavorite, saveReview } from "./actions";
import type { TmdbCandidate } from "@/lib/tmdb";
import type { PlaceCandidate } from "@/lib/places";

export type EditorFavorite = {
  id: string;
  category: "movie" | "tv" | "restaurant";
  title: string;
  meta: string | null;
  image_url: string | null;
  restaurant_details: {
    rating: number | null;
    price_level: number | null;
    cuisine: string | null;
    city: string | null;
  } | null;
  reviews: { id: string; body: string }[];
};

type Category = "movie" | "tv" | "restaurant";

const LABELS: Record<Category, string> = {
  movie: "Movies",
  tv: "TV Shows",
  restaurant: "Restaurants",
};

export function EditorApp({
  username,
  favorites,
}: {
  username: string;
  favorites: EditorFavorite[];
}) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-11 px-6 py-11 sm:px-10 sm:py-14">
      <div className="flex items-center justify-between border-b border-line pb-5">
        <span className="text-[15px] font-semibold tracking-tight text-ink">Curata</span>
        <div className="flex items-center gap-4 text-[13px] text-ink-2">
          <Link href={`/${username}`} className="hover:text-ink">
            View your page →
          </Link>
          <button onClick={handleSignOut} className="hover:text-ink">
            Sign out
          </button>
        </div>
      </div>

      {(["movie", "tv", "restaurant"] as Category[]).map((category) => (
        <CategorySection
          key={category}
          category={category}
          items={favorites.filter((f) => f.category === category)}
        />
      ))}
    </div>
  );
}

function CategorySection({ category, items }: { category: Category; items: EditorFavorite[] }) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] font-medium text-ink">{LABELS[category]}</span>
        <span className="text-[13px] text-ink-2">{items.length}</span>
      </div>

      <SearchAndAdd category={category} onAdded={() => router.refresh()} />

      <div className="flex flex-col">
        {items.map((item) => (
          <FavoriteRow key={item.id} item={item} onChanged={() => router.refresh()} />
        ))}
      </div>
    </div>
  );
}

function SearchAndAdd({ category, onAdded }: { category: Category; onAdded: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<(TmdbCandidate | PlaceCandidate)[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingRef, setAddingRef] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) return;

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?category=${category}&q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [query, category]);

  const showResults = query.trim().length > 0;

  async function handleAdd(candidate: TmdbCandidate | PlaceCandidate) {
    setAddingRef(candidate.externalRef);
    setError("");
    try {
      if (category === "restaurant") {
        await addRestaurant(candidate as PlaceCandidate);
      } else {
        await addMovieOrShow(category, candidate as TmdbCandidate);
      }
      setQuery("");
      setResults([]);
      onAdded();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't add that.");
    } finally {
      setAddingRef(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${LABELS[category].toLowerCase()}…`}
        className="rounded-full border border-line bg-surface px-5 py-2.5 text-[14px] text-ink placeholder:text-ink-2 focus:outline-none"
      />

      {error && <p className="px-1 text-[12px] text-ink-2">{error}</p>}
      {showResults && loading && <p className="px-1 text-[12px] text-ink-2">Searching…</p>}

      {showResults && results.length > 0 && (
        <div className="flex flex-col gap-1 rounded-2xl bg-surface p-2 shadow-card">
          {results.map((r) => (
            <button
              key={r.externalRef}
              onClick={() => handleAdd(r)}
              disabled={addingRef === r.externalRef}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-bg disabled:opacity-50"
            >
              {"imageUrl" in r && r.imageUrl && (
                <div className="relative h-12 w-8 flex-none overflow-hidden rounded-md">
                  <Image src={r.imageUrl} alt="" fill sizes="32px" className="object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] text-ink">{r.title}</div>
                <div className="truncate text-[12px] text-ink-2">
                  {"year" in r
                    ? r.year
                    : [r.cuisine, r.city].filter(Boolean).join(" · ")}
                </div>
              </div>
              <span className="flex-none text-[12px] text-ink-2">
                {addingRef === r.externalRef ? "Adding…" : "Add"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FavoriteRow({ item, onChanged }: { item: EditorFavorite; onChanged: () => void }) {
  const [reviewBody, setReviewBody] = useState(item.reviews[0]?.body ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const metaLine =
    item.category === "restaurant"
      ? [
          item.restaurant_details?.rating ? `★ ${item.restaurant_details.rating}` : null,
          item.restaurant_details?.price_level
            ? "$".repeat(item.restaurant_details.price_level)
            : null,
          item.restaurant_details?.cuisine,
          item.restaurant_details?.city,
        ]
          .filter(Boolean)
          .join(" · ")
      : item.meta;

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteFavorite(item.id);
      onChanged();
    } finally {
      setDeleting(false);
    }
  }

  async function handleSaveReview() {
    setSaving(true);
    try {
      await saveReview(item.id, reviewBody);
      onChanged();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex gap-4 border-b border-line py-4 last:border-b-0">
      {item.image_url && (
        <div className="relative h-20 w-14 flex-none overflow-hidden rounded-lg">
          <Image src={item.image_url} alt="" fill sizes="56px" className="object-cover" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-medium text-ink">{item.title}</div>
            <div className="truncate text-[13px] text-ink-2">{metaLine}</div>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-none text-[12px] text-ink-2 hover:text-ink disabled:opacity-50"
          >
            {deleting ? "Removing…" : "Remove"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={reviewBody}
            onChange={(e) => setReviewBody(e.target.value.slice(0, 280))}
            placeholder="One-sentence review…"
            className="min-w-0 flex-1 rounded-full border border-line bg-surface px-4 py-1.5 text-[13px] text-ink placeholder:text-ink-2 focus:outline-none"
          />
          <span className="flex-none text-[11px] text-ink-2">{reviewBody.length}/280</span>
          <button
            onClick={handleSaveReview}
            disabled={saving || reviewBody === (item.reviews[0]?.body ?? "")}
            className="flex-none rounded-full bg-pill px-3.5 py-1.5 text-[12px] font-medium text-pill-ink disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
