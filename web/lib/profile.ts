import { createClient } from "./supabase/server";
import { getMockProfile } from "./mock-data";
import type { ProfilePage, Review } from "./types";

type FavoriteRow = {
  id: string;
  category: "movie" | "tv" | "restaurant";
  title: string;
  meta: string | null;
  image_url: string | null;
  is_saved: boolean;
  created_at: string;
  restaurant_details: {
    rating: number | null;
    price_level: number | null;
    cuisine: string | null;
    city: string | null;
  } | null;
  reviews: { id: string; body: string; created_at: string }[];
};

const CATEGORY_LABEL: Record<FavoriteRow["category"], Review["category"]> = {
  movie: "Film",
  tv: "TV",
  restaurant: "Restaurant",
};

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return weeks === 1 ? "last week" : `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  return months <= 1 ? "last month" : `${months} months ago`;
}

async function getSupabaseProfile(username: string): Promise<ProfilePage | null> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, location, bio")
    .eq("username", username)
    .maybeSingle();
  if (!profile) return null;

  const { data: favorites } = await supabase
    .from("favorite_items")
    .select("*, restaurant_details(*), reviews(*)")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  const rows = (favorites as FavoriteRow[] | null) ?? [];

  const movies = rows
    .filter((r) => r.category === "movie")
    .map((r) => ({ id: r.id, title: r.title, meta: r.meta ?? "", imageUrl: r.image_url ?? undefined }));

  const shows = rows
    .filter((r) => r.category === "tv")
    .map((r) => ({ id: r.id, title: r.title, meta: r.meta ?? "", imageUrl: r.image_url ?? undefined }));

  const restaurants = rows
    .filter((r) => r.category === "restaurant" && !r.is_saved)
    .map((r) => ({
      id: r.id,
      title: r.title,
      rating: r.restaurant_details?.rating ?? 0,
      priceLevel: (r.restaurant_details?.price_level ?? 1) as 1 | 2 | 3 | 4,
      cuisine: r.restaurant_details?.cuisine ?? "",
      city: r.restaurant_details?.city ?? "",
      note: r.reviews[0]?.body ?? "",
      imageUrl: r.image_url ?? undefined,
    }));

  const saved = rows
    .filter((r) => r.category === "restaurant" && r.is_saved)
    .map((r) => ({
      id: r.id,
      title: r.title,
      cuisine: r.restaurant_details?.cuisine ?? "",
      city: r.restaurant_details?.city ?? "",
      imageUrl: r.image_url ?? undefined,
    }));

  const reviews: Review[] = rows
    .flatMap((r) => r.reviews.map((v) => ({ ...v, title: r.title, category: r.category })))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((v) => ({
      id: v.id,
      title: v.title,
      category: CATEGORY_LABEL[v.category],
      timeAgo: timeAgo(v.created_at),
      quote: v.body,
    }));

  return {
    profile: {
      username: profile.username,
      displayName: profile.display_name,
      location: profile.location ?? "",
      bio: profile.bio ?? "",
    },
    movies,
    shows,
    restaurants,
    saved,
    reviews,
    lists: [], // list management isn't built yet — see spec.md § Build plan, Phase 4
  };
}

export async function getProfileByUsername(username: string): Promise<ProfilePage | null> {
  const supabaseProfile = await getSupabaseProfile(username);
  if (supabaseProfile) return supabaseProfile;
  return getMockProfile(username);
}
