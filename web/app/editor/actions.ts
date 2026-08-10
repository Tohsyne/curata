"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getTmdbCreator, type TmdbCandidate } from "@/lib/tmdb";
import { resolvePhotoUri, type PlaceCandidate } from "@/lib/places";

const UNIQUE_VIOLATION = "23505";

async function getOwnProfileId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) throw new Error("No profile found for this account.");

  return profile.id as string;
}

export async function addMovieOrShow(kind: "movie" | "tv", candidate: TmdbCandidate) {
  const supabase = await createClient();
  const profileId = await getOwnProfileId(supabase);
  const creator = await getTmdbCreator(kind, candidate.externalRef);
  const meta = [candidate.year, creator].filter(Boolean).join(" · ");

  const { error } = await supabase.from("favorite_items").insert({
    profile_id: profileId,
    category: kind,
    external_source: "tmdb",
    external_ref: candidate.externalRef,
    title: candidate.title,
    meta,
    image_url: candidate.imageUrl,
  });

  if (error) {
    throw new Error(
      error.code === UNIQUE_VIOLATION ? "Already on your favorites." : error.message
    );
  }
  revalidatePath("/editor");
}

export async function addRestaurant(candidate: PlaceCandidate) {
  const supabase = await createClient();
  const profileId = await getOwnProfileId(supabase);
  const imageUrl = candidate.photoName ? await resolvePhotoUri(candidate.photoName) : null;

  const { data: item, error } = await supabase
    .from("favorite_items")
    .insert({
      profile_id: profileId,
      category: "restaurant",
      external_source: "places",
      external_ref: candidate.externalRef,
      title: candidate.title,
      image_url: imageUrl,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(
      error.code === UNIQUE_VIOLATION ? "Already on your favorites." : error.message
    );
  }

  const { error: detailsError } = await supabase.from("restaurant_details").insert({
    favorite_item_id: item.id,
    rating: candidate.rating,
    price_level: candidate.priceLevel,
    cuisine: candidate.cuisine,
    city: candidate.city,
  });
  if (detailsError) throw new Error(detailsError.message);

  revalidatePath("/editor");
}

export async function deleteFavorite(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("favorite_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/editor");
}

// One review per favorite item for v1 — this both creates and edits.
export async function saveReview(favoriteItemId: string, body: string) {
  const supabase = await createClient();
  const trimmed = body.trim().slice(0, 280);

  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("favorite_item_id", favoriteItemId)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("reviews").update({ body: trimmed }).eq("id", existing.id)
    : await supabase.from("reviews").insert({ favorite_item_id: favoriteItemId, body: trimmed });

  if (error) throw new Error(error.message);
  revalidatePath("/editor");
}
