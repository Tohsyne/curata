// Google Places (New) lookups: `getRestaurantPhotoUrl` backs the mock demo
// data (lib/mock-data.ts); `searchRestaurants` + `resolvePhotoUri` back the
// Editor's live search-and-add.
//
// Security note: the API key never reaches the client. We resolve photos
// server-side down to Google's `photoUri` (a public, keyless CDN URL) and
// only ever render that — never a URL with `key=...` in it.
//
// Cost note: `searchRestaurants` deliberately does NOT resolve photos — that
// would bill a Photo request per result on every keystroke. Photos are only
// resolved via `resolvePhotoUri` once a specific result is actually added.

const PLACES_BASE = "https://places.googleapis.com/v1";
const WEEK = 60 * 60 * 24 * 7; // cache aggressively — Places bills per request

type AddressComponent = { longText?: string; types: string[] };

type PlaceResult = {
  id: string;
  displayName?: { text: string };
  addressComponents?: AddressComponent[];
  formattedAddress?: string;
  primaryTypeDisplayName?: { text: string };
  rating?: number;
  priceLevel?: string;
  photos?: { name: string }[];
};

type SearchTextResponse = { places?: PlaceResult[] };
type PhotoMediaResponse = { photoUri?: string };

function findLocality(components?: AddressComponent[]): string | null {
  return components?.find((c) => c.types.includes("locality"))?.longText ?? null;
}

function mapPriceLevel(level?: string): 1 | 2 | 3 | 4 | null {
  switch (level) {
    case "PRICE_LEVEL_INEXPENSIVE":
      return 1;
    case "PRICE_LEVEL_MODERATE":
      return 2;
    case "PRICE_LEVEL_EXPENSIVE":
      return 3;
    case "PRICE_LEVEL_VERY_EXPENSIVE":
      return 4;
    default:
      return null;
  }
}

export async function resolvePhotoUri(photoName: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const photoRes = await fetch(
      `${PLACES_BASE}/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true`,
      {
        headers: { "X-Goog-Api-Key": apiKey },
        next: { revalidate: WEEK },
      }
    );
    if (!photoRes.ok) return null;

    const photoData = (await photoRes.json()) as PhotoMediaResponse;
    return photoData.photoUri ?? null;
  } catch {
    return null;
  }
}

export async function getRestaurantPhotoUrl(
  title: string,
  city: string
): Promise<string | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const searchRes = await fetch(`${PLACES_BASE}/places:searchText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.photos",
      },
      body: JSON.stringify({ textQuery: `${title}, ${city}` }),
      next: { revalidate: WEEK },
    });
    if (!searchRes.ok) return null;

    const searchData = (await searchRes.json()) as SearchTextResponse;
    const photoName = searchData.places?.[0]?.photos?.[0]?.name;
    if (!photoName) return null;

    return resolvePhotoUri(photoName);
  } catch {
    return null;
  }
}

export type PlaceCandidate = {
  externalRef: string;
  title: string;
  city: string;
  cuisine: string;
  rating: number | null;
  priceLevel: 1 | 2 | 3 | 4 | null;
  photoName: string | null; // resolved to a URL only on add, see resolvePhotoUri
};

export async function searchRestaurants(query: string): Promise<PlaceCandidate[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || !query.trim()) return [];

  try {
    const res = await fetch(`${PLACES_BASE}/places:searchText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.addressComponents,places.formattedAddress,places.primaryTypeDisplayName,places.rating,places.priceLevel,places.photos",
      },
      body: JSON.stringify({ textQuery: query }),
    });
    if (!res.ok) return [];

    const data = (await res.json()) as SearchTextResponse;
    return (data.places ?? []).slice(0, 6).map((p) => ({
      externalRef: p.id,
      title: p.displayName?.text ?? "",
      city: findLocality(p.addressComponents) ?? p.formattedAddress ?? "",
      cuisine: p.primaryTypeDisplayName?.text ?? "Restaurant",
      rating: p.rating ?? null,
      priceLevel: mapPriceLevel(p.priceLevel),
      photoName: p.photos?.[0]?.name ?? null,
    }));
  } catch {
    return [];
  }
}
