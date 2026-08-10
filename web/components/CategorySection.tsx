export function CategorySection({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] font-medium text-ink">{label}</span>
        <span className="text-[13px] text-ink-2">{count}</span>
      </div>
      {children}
    </div>
  );
}
