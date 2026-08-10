import { Placeholder } from "./Placeholder";
import type { Review } from "@/lib/types";

export function ReviewRow({ review }: { review: Review }) {
  return (
    <div className="flex gap-4.5 border-b border-line py-5 last:border-b-0">
      <div className="w-14 flex-none">
        <Placeholder ratio="2/3" radius="rounded-[10px]" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline gap-2.5">
          <span className="text-[15px] font-medium text-ink">{review.title}</span>
          <span className="text-[13px] text-ink-2">
            {review.category} · {review.timeAgo}
          </span>
        </div>
        <p className="max-w-[640px] text-[14px] leading-relaxed text-ink-2">{review.quote}</p>
      </div>
    </div>
  );
}
