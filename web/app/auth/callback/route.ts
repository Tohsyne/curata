import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidUsername } from "@/lib/username";

// Landing point for the magic-link email. Exchanges the auth code for a
// session, then creates the profile row for a first-time claim — the
// username travels through as a query param set when the link was sent
// (see app/claim/page.tsx).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const username = searchParams.get("username");

  if (!code) {
    return NextResponse.redirect(`${origin}/claim?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/claim?error=auth_failed`);
  }

  // Already has a profile — re-clicked an old link, or this is a returning
  // owner. Either way, no new claim to make.
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (existingProfile) {
    return NextResponse.redirect(`${origin}/editor`);
  }

  if (!username || !isValidUsername(username)) {
    return NextResponse.redirect(`${origin}/claim?error=invalid_username`);
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    user_id: data.user.id,
    username,
    display_name: `${username}'s favorites`,
  });

  if (insertError) {
    // Most likely the username was claimed by someone else in the gap
    // between the availability check and clicking the email link.
    return NextResponse.redirect(`${origin}/claim?error=username_taken`);
  }

  return NextResponse.redirect(`${origin}/editor`);
}
