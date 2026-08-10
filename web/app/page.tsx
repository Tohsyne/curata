import Link from "next/link";

// Landing page (wireframe 1d) is Phase 3 — see spec.md § Tech → Build plan.
// This is a placeholder so `npm run dev` has somewhere to send you.
export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-[15px] font-semibold tracking-tight text-ink">Curata</p>
      <p className="max-w-[46ch] text-[14px] leading-relaxed text-ink-2">
        The landing page ships in Phase 3. For now: claim a real page, or look at the demo.
      </p>
      <div className="mt-2 flex gap-3">
        <Link
          href="/claim"
          className="rounded-full bg-pill px-5 py-2.5 text-[13px] font-medium text-pill-ink"
        >
          Claim your page →
        </Link>
        <Link
          href="/juliet"
          className="rounded-full border border-line px-5 py-2.5 text-[13px] font-medium text-ink"
        >
          View demo profile
        </Link>
      </div>
    </div>
  );
}
