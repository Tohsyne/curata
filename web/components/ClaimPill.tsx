"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Single-field capture on the landing page — hands off to /claim (which
// collects email and actually sends the magic link) with the username
// pre-filled, rather than duplicating the claim/auth logic here.
export function ClaimPill() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(username ? `/claim?username=${encodeURIComponent(username)}` : "/claim");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[420px] items-center gap-2.5 rounded-full bg-pill py-2 pr-2 pl-5"
    >
      <span className="font-mono text-[14px] text-pill-ink/55">curata.co/</span>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value.toLowerCase())}
        placeholder="yourname"
        maxLength={24}
        className="min-w-0 flex-1 bg-transparent text-[15px] text-pill-ink placeholder:text-pill-ink/55 focus:outline-none"
      />
      <button
        type="submit"
        className="flex-none rounded-full bg-pill-ink px-5 py-2.5 text-[13px] font-medium text-pill"
      >
        Claim your page
      </button>
    </form>
  );
}
