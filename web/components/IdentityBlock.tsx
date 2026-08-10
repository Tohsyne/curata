import { Placeholder } from "./Placeholder";
import type { Profile } from "@/lib/types";

export function IdentityBlock({
  profile,
  favoriteCount,
  reviewCount,
  listCount,
}: {
  profile: Profile;
  favoriteCount: number;
  reviewCount: number;
  listCount: number;
}) {
  return (
    <div className="flex items-start gap-6">
      <div className="w-[88px] flex-none">
        <Placeholder ratio="1/1" radius="rounded-full" />
      </div>
      <div className="flex max-w-[560px] flex-col gap-2.5">
        <h1 className="text-[32px] leading-[1.1] font-semibold tracking-tight text-ink text-balance">
          {profile.displayName}
        </h1>
        <p className="text-[14px] leading-relaxed text-ink-2">{profile.bio}</p>
        <div className="mt-0.5 flex gap-4.5 text-[13px] text-ink-2">
          <span>{favoriteCount} favorites</span>
          <span>{reviewCount} reviews</span>
          <span>{listCount} lists</span>
        </div>
      </div>
    </div>
  );
}
