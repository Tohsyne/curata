import type { MovieOrShowItem, ProfilePage } from "./types";
import { getPosterUrl } from "./tmdb";
import { getRestaurantPhotoUrl } from "./places";

// Demo fallback profile ("juliet") shown when a username isn't a real
// claimed profile in Supabase — see lib/profile.ts for the real lookup.

const juliet: ProfilePage = {
  profile: {
    username: "juliet",
    displayName: "Juliet's favorites",
    location: "Oakland",
    bio: "Slow films, one long-running sitcom I rewatch every winter, and the eleven restaurants in Lisbon and Oakland I send everyone to.",
  },
  movies: [
    { id: "m1", title: "Past Lives", meta: "2023 · Celine Song" },
    { id: "m2", title: "In the Mood for Love", meta: "2000 · Wong Kar-wai" },
    { id: "m3", title: "Aftersun", meta: "2022 · Charlotte Wells" },
    { id: "m4", title: "Paris, Texas", meta: "1984 · Wim Wenders" },
    { id: "m5", title: "Perfect Days", meta: "2023 · Wim Wenders" },
    { id: "m6", title: "The Farewell", meta: "2019 · Lulu Wang" },
  ],
  shows: [
    { id: "s1", title: "The Bear", meta: "2022– · FX" },
    { id: "s2", title: "Detroiters", meta: "2017 · Comedy Central" },
    { id: "s3", title: "Fleabag", meta: "2016 · BBC Three" },
    { id: "s4", title: "Chef's Table", meta: "2015– · Netflix" },
    { id: "s5", title: "Somebody Somewhere", meta: "2022 · HBO" },
    { id: "s6", title: "Terrace House", meta: "2015 · Fuji TV" },
  ],
  restaurants: [
    { id: "r1", title: "Cervejaria Ramiro", rating: 4.8, priceLevel: 2, cuisine: "Seafood", city: "Lisbon", note: "Go at 4pm, order the carabineiros, skip the bread guilt." },
    { id: "r2", title: "Snail Bar", rating: 4.7, priceLevel: 2, cuisine: "Wine bar", city: "Oakland", note: "Twelve seats, one hot plate, the best uni toast I've had." },
    { id: "r3", title: "Taqueria El Paisa", rating: 4.6, priceLevel: 1, cuisine: "Tacos", city: "Oakland", note: "Al pastor after 10pm, cash only, eat standing up." },
    { id: "r4", title: "Tasca da Esquina", rating: 4.5, priceLevel: 3, cuisine: "Portuguese", city: "Lisbon", note: "The tasting menu is fine — sit at the counter and improvise." },
  ],
  saved: [
    { id: "sv1", title: "O Frade", cuisine: "Portuguese", city: "Lisbon" },
    { id: "sv2", title: "Al's Place", cuisine: "Californian", city: "SF" },
    { id: "sv3", title: "Kabawa", cuisine: "Caribbean", city: "Oakland" },
    { id: "sv4", title: "Cervejaria Trindade", cuisine: "Seafood", city: "Lisbon" },
  ],
  reviews: [
    { id: "v1", title: "Perfect Days", category: "Film", timeAgo: "2 days ago", quote: "A man cleans toilets and reads paperbacks and I cried twice. Nothing happens, beautifully." },
    { id: "v2", title: "The Bear, S3", category: "TV", timeAgo: "last week", quote: "Season three is all vibes and no plot, and I still watched it in one sitting." },
    { id: "v3", title: "Snail Bar", category: "Restaurant", timeAgo: "3 weeks ago", quote: "Went for one glass, stayed for four courses. Ask what came in that morning." },
  ],
  lists: [
    { id: "l1", name: "Films for a rainy Sunday", meta: "Updated in June", count: 11 },
    { id: "l2", name: "Lisbon, 3 days", meta: "Restaurants + one bakery", count: 9 },
    { id: "l3", name: "Comfort rewatches", meta: "Nothing after 2012", count: 7 },
    { id: "l4", name: "Recommended by Dad", meta: "Mostly westerns", count: 6 },
  ],
};

const profiles: Record<string, ProfilePage> = {
  juliet,
};

async function withPosters(
  items: MovieOrShowItem[],
  kind: "movie" | "tv"
): Promise<MovieOrShowItem[]> {
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      imageUrl: (await getPosterUrl(kind, item.title)) ?? undefined,
    }))
  );
}

async function withRestaurantPhotos<T extends { title: string; city: string }>(
  items: T[]
): Promise<T[]> {
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      imageUrl: (await getRestaurantPhotoUrl(item.title, item.city)) ?? undefined,
    }))
  );
}

// Falls back for any username not found in Supabase — see lib/profile.ts.
export async function getMockProfile(username: string): Promise<ProfilePage | null> {
  const data = profiles[username];
  if (!data) return null;

  const [movies, shows, restaurants, saved] = await Promise.all([
    withPosters(data.movies, "movie"),
    withPosters(data.shows, "tv"),
    withRestaurantPhotos(data.restaurants),
    withRestaurantPhotos(data.saved),
  ]);

  return { ...data, movies, shows, restaurants, saved };
}
