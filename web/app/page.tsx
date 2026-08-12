import Link from "next/link";
import { getProfileByUsername } from "@/lib/profile";
import { CoverArt } from "@/components/CoverArt";
import { ReviewRow } from "@/components/ReviewRow";
import { ListRow } from "@/components/ListRow";
import { RestaurantCard } from "@/components/RestaurantCard";
import { ClaimPill } from "@/components/ClaimPill";

const STEPS = [
  {
    n: "01",
    title: "Pick your favorites",
    body: "Search once, tap the poster. Thirty-four is a lot; twelve is enough.",
  },
  {
    n: "02",
    title: "Write a sentence",
    body: "Reviews are capped short on purpose — the length of a text to a friend.",
  },
  {
    n: "03",
    title: "Send the link",
    body: "One URL, no app to install, works when your friend is standing outside the restaurant.",
  },
];

// Landing (wireframe 1d — poster-wall hero). Ships on the real `juliet` seed
// profile rather than 18 placeholder tiles — see spec.md § Decisions locked.
export default async function Home() {
  const data = await getProfileByUsername("juliet");
  if (!data) {
    // Shouldn't happen — the mock fallback always resolves "juliet" — but
    // fail into something functional rather than crash the homepage.
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-[15px] font-semibold tracking-tight text-ink">Curata</p>
        <Link href="/claim" className="rounded-full bg-pill px-5 py-2.5 text-[13px] font-medium text-pill-ink">
          Claim your page →
        </Link>
      </div>
    );
  }

  const { profile, movies, shows, restaurants, reviews, lists } = data;
  const wall = [...movies, ...shows];
  const favoriteCount = movies.length + shows.length + restaurants.length;

  return (
    <div className="mx-auto flex max-w-[1080px] flex-col gap-14 overflow-hidden rounded-3xl bg-bg pb-14 shadow-card sm:my-10">
      <div className="flex flex-col gap-14">
        <div className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <span className="text-[15px] font-semibold tracking-tight text-ink">Curata</span>
          <div className="flex items-center gap-5 text-[13px] text-ink-2">
            <Link href={`/${profile.username}`} className="hidden hover:text-ink sm:inline">
              Full example
            </Link>
            <Link href="/claim" className="hover:text-ink">
              Log in
            </Link>
            <Link
              href="/claim"
              className="rounded-full bg-pill px-4.5 py-2 font-medium text-pill-ink"
            >
              Claim your page
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 px-6 text-center sm:px-10">
          <h1 className="max-w-[760px] text-[36px] leading-[1.05] font-semibold tracking-tight text-ink text-balance sm:text-[52px]">
            This is {profile.displayName.replace("'s favorites", "")}&rsquo;s taste, on one page.
          </h1>
          <p className="max-w-[520px] text-[15px] leading-relaxed text-ink-2 text-balance">
            {favoriteCount} favorites, {reviews.length} short reviews, {lists.length} lists.
            Nothing else. Curata gives everyone a page like it — yours takes about nine minutes.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2.5 px-6 sm:grid-cols-6 sm:px-10">
          {wall.map((item) => (
            <CoverArt
              key={item.id}
              src={item.imageUrl}
              alt={item.title}
              ratio="2/3"
              radius="rounded-[10px]"
              sizes="(min-width: 640px) 15vw, 22vw"
            />
          ))}
        </div>

        <div className="flex justify-center px-6 sm:px-10">
          <ClaimPill />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 border-t border-line px-6 pt-10 sm:grid-cols-3 sm:px-10">
        {STEPS.map((s) => (
          <div key={s.n} className="flex flex-col gap-2">
            <span className="font-mono text-[12px] text-ink-2">{s.n}</span>
            <span className="text-[15px] font-medium text-ink">{s.title}</span>
            <p className="text-[14px] leading-relaxed text-ink-2">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 px-6 sm:grid-cols-2 sm:px-10">
        <div className="flex flex-col gap-6">
          <h2 className="text-[26px] leading-snug font-semibold tracking-tight text-ink text-balance">
            A review here is one sentence, not a star rating.
          </h2>
          <div className="flex flex-col">
            {reviews.map((v) => (
              <ReviewRow key={v.id} review={v} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-4 rounded-2xl bg-surface p-6 shadow-card">
            <span className="text-[15px] font-medium text-ink">
              {profile.displayName.replace("'s favorites", "")}&rsquo;s lists
            </span>
            <div className="flex flex-col">
              {lists.map((l) => (
                <ListRow key={l.id} list={l} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[15px] font-medium text-ink">Where she eats</span>
            <div className="grid grid-cols-2 gap-4">
              {restaurants.slice(0, 2).map((r) => (
                <RestaurantCard key={r.id} item={r} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
