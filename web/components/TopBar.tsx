"use client";

import { useState } from "react";

export function TopBar({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/${username}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard permission denied (e.g. non-HTTPS context) — nothing to recover into.
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-line px-6 py-5 sm:px-10">
      <span className="text-[15px] font-semibold tracking-tight text-ink">Curata</span>
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-[13px] text-ink-2">curata.co/{username}</span>
        <button
          onClick={handleShare}
          className="rounded-full bg-pill px-4 py-2 text-[13px] font-medium text-pill-ink transition-opacity hover:opacity-90"
        >
          {copied ? "Copied" : "Share"}
        </button>
      </div>
    </div>
  );
}
