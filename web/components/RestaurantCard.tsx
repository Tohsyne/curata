import { CoverArt } from "./CoverArt";
import type { RestaurantItem } from "@/lib/types";

export function RestaurantCard({ item }: { item: RestaurantItem }) {
  const price = "$".repeat(item.priceLevel);
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-surface p-3 shadow-card">
      <CoverArt
        src={item.imageUrl}
        alt={item.title}
        ratio="4/3"
        radius="rounded-xl"
        sizes="(min-width: 1024px) 27vw, 90vw"
      />
      <div className="px-1 pb-1.5">
        <div className="truncate text-[15px] font-medium text-ink">{item.title}</div>
        <div className="mt-0.5 text-[13px] text-ink-2">
          ★ {item.rating} · {price} · {item.cuisine} · {item.city}
        </div>
        <div className="mt-2 text-[13px] leading-snug text-ink-2">{item.note}</div>
      </div>
    </div>
  );
}
