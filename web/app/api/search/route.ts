import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { searchTmdbTitles } from "@/lib/tmdb";
import { searchRestaurants } from "@/lib/places";

// Auth-gated: this proxies our TMDB/Places keys, so an unauthenticated caller
// hitting it directly would spend our quota for free. Only signed-in owners
// (i.e. inside the Editor) can search.
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q") ?? "";

  if (category === "movie" || category === "tv") {
    return NextResponse.json({ results: await searchTmdbTitles(category, q) });
  }
  if (category === "restaurant") {
    return NextResponse.json({ results: await searchRestaurants(q) });
  }
  return NextResponse.json({ error: "Invalid category" }, { status: 400 });
}
