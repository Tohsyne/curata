// Diagonal-stripe placeholder for cover art we don't have yet (no TMDB/Places
// integration until Phase 2). Real posters/photos replace this 1:1 later.
export function Placeholder({
  ratio,
  radius,
  className = "",
}: {
  ratio: "2/3" | "4/3" | "1/1";
  radius: string;
  className?: string;
}) {
  return (
    <div
      className={`${radius} ${className}`}
      style={{
        aspectRatio: ratio,
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--line) 0 7px, transparent 7px 14px)",
        backgroundColor: "var(--bg)",
      }}
    />
  );
}
