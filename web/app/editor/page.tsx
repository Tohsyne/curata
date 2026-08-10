import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditorApp, type EditorFavorite } from "./EditorApp";

export default async function EditorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/claim");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (!profile) redirect("/claim");

  const { data: favorites } = await supabase
    .from("favorite_items")
    .select("*, restaurant_details(*), reviews(*)")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <EditorApp
      username={profile.username}
      favorites={(favorites as EditorFavorite[] | null) ?? []}
    />
  );
}
