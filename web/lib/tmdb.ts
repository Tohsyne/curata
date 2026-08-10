// TMDB lookups: `getPosterUrl` backs the mock demo data (lib/mock-data.ts);
// `searchTmdbTitles` + `getTmdbCreator` back the Editor's live search-and-add.

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

type TmdbSearchResponse = {
  results: {
    id: number;
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
    poster_path: string | null;
  }[];
};

type TmdbCreditsResponse = {
  crew: { job: string; name: string }[];
};

type TmdbTvDetailsResponse = {
  networks?: { name: string }[];
};

export async function getPosterUrl(
  kind: "movie" | "tv",
  title: string
): Promise<string | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  const url = new URL(`${TMDB_BASE}/search/${kind}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("query", title);

  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
    if (!res.ok) return null;

    const data = (await res.json()) as TmdbSearchResponse;
    const posterPath = data.results[0]?.poster_path;
    return posterPath ? `${TMDB_IMAGE_BASE}${posterPath}` : null;
  } catch {
    return null;
  }
}

export type TmdbCandidate = {
  externalRef: string;
  title: string;
  year: string;
  imageUrl: string | null;
};

export async function searchTmdbTitles(
  kind: "movie" | "tv",
  query: string
): Promise<TmdbCandidate[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || !query.trim()) return [];

  const url = new URL(`${TMDB_BASE}/search/${kind}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("query", query);

  try {
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = (await res.json()) as TmdbSearchResponse;
    return data.results.slice(0, 6).map((r) => ({
      externalRef: String(r.id),
      title: (kind === "movie" ? r.title : r.name) ?? "",
      year: ((kind === "movie" ? r.release_date : r.first_air_date) ?? "").slice(0, 4),
      imageUrl: r.poster_path ? `${TMDB_IMAGE_BASE}${r.poster_path}` : null,
    }));
  } catch {
    return [];
  }
}

// Director (movie) or first network (tv) — a second call, only made once an
// item is actually selected, not per search keystroke.
export async function getTmdbCreator(kind: "movie" | "tv", externalRef: string): Promise<string> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return "";

  try {
    if (kind === "movie") {
      const res = await fetch(
        `${TMDB_BASE}/movie/${externalRef}/credits?api_key=${apiKey}`
      );
      if (!res.ok) return "";
      const data = (await res.json()) as TmdbCreditsResponse;
      return data.crew.find((c) => c.job === "Director")?.name ?? "";
    }

    const res = await fetch(`${TMDB_BASE}/tv/${externalRef}?api_key=${apiKey}`);
    if (!res.ok) return "";
    const data = (await res.json()) as TmdbTvDetailsResponse;
    return data.networks?.[0]?.name ?? "";
  } catch {
    return "";
  }
}
