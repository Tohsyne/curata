import type { ListSummary } from "@/lib/types";

export function ListRow({ list }: { list: ListSummary }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-3.5 last:border-b-0">
      <div className="flex flex-col gap-0.5">
        <span className="text-[15px] font-medium text-ink">{list.name}</span>
        <span className="text-[13px] text-ink-2">{list.meta}</span>
      </div>
      <span className="text-[13px] text-ink-2">{list.count}</span>
    </div>
  );
}
