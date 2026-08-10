import { CoverArt } from "./CoverArt";
import type { MovieOrShowItem } from "@/lib/types";

export function PosterCard({ item }: { item: MovieOrShowItem }) {
  return (
    <div className="flex flex-col gap-2.5">
      <CoverArt
        src={item.imageUrl}
        alt={item.title}
        ratio="2/3"
        radius="rounded-2xl"
        sizes="(min-width: 1024px) 16vw, 33vw"
        className="shadow-card"
      />
      <div>
        <div className="truncate text-[15px] font-medium text-ink">{item.title}</div>
        <div className="mt-0.5 text-[13px] text-ink-2">{item.meta}</div>
      </div>
    </div>
  );
}
