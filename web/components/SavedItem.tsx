import { CoverArt } from "./CoverArt";
import type { SavedRestaurant } from "@/lib/types";

// Restaurants only — see spec.md § Decisions locked. No rating: not visited yet.
export function SavedItem({ item }: { item: SavedRestaurant }) {
  return (
    <div className="flex flex-col gap-2">
      <CoverArt
        src={item.imageUrl}
        alt={item.title}
        ratio="4/3"
        radius="rounded-xl"
        sizes="(min-width: 1024px) 13vw, 45vw"
      />
      <div>
        <div className="truncate text-[13px] text-ink">{item.title}</div>
        <div className="mt-0.5 truncate text-[12px] text-ink-2">
          {item.cuisine} · {item.city}
        </div>
      </div>
    </div>
  );
}
