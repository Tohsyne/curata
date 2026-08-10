// Mirrors the favorite_items / restaurant_details / reviews / lists schema in spec.md § Tech → Data schema.

export type Profile = {
  username: string;
  displayName: string;
  location: string;
  bio: string;
};

export type MovieOrShowItem = {
  id: string;
  title: string;
  meta: string; // "2023 · Celine Song" — matches favorite_items.meta in the DB schema
  imageUrl?: string;
};

export type RestaurantItem = {
  id: string;
  title: string;
  rating: number;
  priceLevel: 1 | 2 | 3 | 4;
  cuisine: string;
  city: string;
  note: string;
  imageUrl?: string;
};

// Saved-for-later is restaurants only (see spec.md § Decisions locked).
export type SavedRestaurant = {
  id: string;
  title: string;
  cuisine: string;
  city: string;
  imageUrl?: string;
};

export type Review = {
  id: string;
  title: string;
  category: "Film" | "TV" | "Restaurant";
  timeAgo: string;
  quote: string; // capped at 280 chars
};

export type ListSummary = {
  id: string;
  name: string;
  meta: string;
  count: number;
};

export type ProfilePage = {
  profile: Profile;
  movies: MovieOrShowItem[];
  shows: MovieOrShowItem[];
  restaurants: RestaurantItem[];
  saved: SavedRestaurant[];
  reviews: Review[];
  lists: ListSummary[];
};
