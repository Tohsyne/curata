import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProfileByUsername } from "@/lib/profile";
import { TopBar } from "@/components/TopBar";
import { IdentityBlock } from "@/components/IdentityBlock";
import { CategorySection } from "@/components/CategorySection";
import { PosterCard } from "@/components/PosterCard";
import { RestaurantCard } from "@/components/RestaurantCard";
import { SavedItem } from "@/components/SavedItem";
import { ReviewRow } from "@/components/ReviewRow";
import { ListRow } from "@/components/ListRow";

type Params = Promise<{ username: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { username } = await params;
  const data = await getProfileByUsername(username);
  if (!data) return { title: "Curata" };
  return {
    title: `${data.profile.displayName} — Curata`,
    description: data.profile.bio,
  };
}

export default async function ProfilePage({ params }: { params: Params }) {
  const { username } = await params;
  const data = await getProfileByUsername(username);
  if (!data) notFound();

  const { profile, movies, shows, restaurants, saved, reviews, lists } = data;

  return (
    <div className="mx-auto max-w-[1080px] overflow-hidden rounded-3xl bg-bg shadow-card sm:my-10">
      <TopBar username={profile.username} />

      <div className="flex flex-col gap-11 px-6 py-11 sm:px-10 sm:py-14">
        <IdentityBlock
          profile={profile}
          favoriteCount={movies.length + shows.length + restaurants.length}
          reviewCount={reviews.length}
          listCount={lists.length}
        />

        <CategorySection label="Movies" count={movies.length}>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {movies.map((m) => (
              <PosterCard key={m.id} item={m} />
            ))}
          </div>
        </CategorySection>

        <CategorySection label="TV Shows" count={shows.length}>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {shows.map((s) => (
              <PosterCard key={s.id} item={s} />
            ))}
          </div>
        </CategorySection>

        <CategorySection label="Restaurants" count={restaurants.length}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} item={r} />
            ))}
          </div>
        </CategorySection>

        <div className="flex flex-col gap-4.5">
          <span className="text-[15px] font-medium text-ink">Recent reviews</span>
          <div className="flex flex-col">
            {reviews.map((v) => (
              <ReviewRow key={v.id} review={v} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <CategorySection label="Saved for later" count={saved.length}>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              {saved.map((k) => (
                <SavedItem key={k.id} item={k} />
              ))}
            </div>
          </CategorySection>

          <div className="flex flex-col gap-4">
            <span className="text-[15px] font-medium text-ink">Lists</span>
            <div className="flex flex-col">
              {lists.map((l) => (
                <ListRow key={l.id} list={l} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
