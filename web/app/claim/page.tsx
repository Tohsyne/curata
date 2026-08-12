"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isValidUsername } from "@/lib/username";

type Status = "idle" | "checking" | "available" | "taken" | "invalid" | "sending" | "sent" | "error";

const CALLBACK_ERRORS: Record<string, string> = {
  missing_code: "That link looks broken — try claiming again.",
  auth_failed: "That link expired or was already used — try claiming again.",
  invalid_username: "Something went wrong with the username — try claiming again.",
  username_taken: "That username was claimed by someone else in the meantime — try another.",
};

function ClaimForm() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(searchParams.get("username")?.toLowerCase() ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState(
    callbackError ? (CALLBACK_ERRORS[callbackError] ?? "Something went wrong — try again.") : ""
  );

  async function checkUsername(value: string) {
    if (!value) {
      setStatus("idle");
      return;
    }
    if (!isValidUsername(value)) {
      setStatus("invalid");
      return;
    }
    setStatus("checking");
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", value)
      .maybeSingle();
    setStatus(data ? "taken" : "available");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidUsername(username)) {
      setStatus("invalid");
      return;
    }

    setStatus("sending");
    const supabase = createClient();

    // Re-check right before sending — the blur check can go stale between
    // typing and submit.
    const { data: existing } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .maybeSingle();
    if (existing) {
      setStatus("taken");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?username=${encodeURIComponent(username)}`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-[20px] font-semibold text-ink">Check your email.</p>
        <p className="max-w-[40ch] text-[14px] text-ink-2">
          We sent a link to {email} — click it to finish claiming curata.co/{username}.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="flex w-full max-w-[420px] flex-col gap-5">
        <div className="flex flex-col gap-1.5 text-center">
          <p className="text-[15px] font-semibold tracking-tight text-ink">Curata</p>
          <p className="text-[14px] text-ink-2">Claim your page.</p>
        </div>

        {errorMessage && !["taken", "invalid", "checking", "available"].includes(status) && (
          <p className="rounded-xl bg-surface px-4 py-3 text-center text-[13px] text-ink-2">
            {errorMessage}
          </p>
        )}

        <div className="flex items-center gap-2.5 rounded-full bg-pill py-2 pr-2 pl-5">
          <span className="font-mono text-[14px] text-pill-ink/55">curata.co/</span>
          <input
            value={username}
            onChange={(e) => {
              const v = e.target.value.toLowerCase();
              setUsername(v);
              setStatus("idle");
            }}
            onBlur={() => checkUsername(username)}
            placeholder="yourname"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-pill-ink placeholder:text-pill-ink/55 focus:outline-none"
            maxLength={24}
          />
        </div>

        <p className="min-h-[16px] px-1 text-[12px] text-ink-2">
          {status === "checking" && "Checking…"}
          {status === "available" && "Available."}
          {status === "taken" && "That username is already claimed."}
          {status === "invalid" &&
            "3–24 characters, lowercase letters, numbers, and hyphens only."}
        </p>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="rounded-full border border-line bg-surface px-5 py-2.5 text-[15px] text-ink placeholder:text-ink-2 focus:outline-none"
        />

        <button
          type="submit"
          disabled={status === "sending" || status === "taken" || status === "invalid"}
          className="rounded-full bg-pill px-5 py-3 text-[14px] font-medium text-pill-ink transition-opacity disabled:opacity-40"
        >
          {status === "sending" ? "Sending…" : "Claim your page"}
        </button>
      </form>
    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense>
      <ClaimForm />
    </Suspense>
  );
}
