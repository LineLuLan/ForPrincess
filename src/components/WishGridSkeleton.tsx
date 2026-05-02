type WishGridSkeletonProps = {
  count?: number;
  cols?: 3 | 4;
};

export function WishGridSkeleton({ count = 6, cols = 3 }: WishGridSkeletonProps) {
  const gridClass =
    cols === 4
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className={gridClass} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[var(--radius-soft)] border border-border bg-surface/60"
        >
          <div className="aspect-[4/3] animate-pulse bg-surface-soft" />
          <div className="flex flex-col gap-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-surface-soft" />
            <div className="h-3 w-1/3 animate-pulse rounded-full bg-surface-soft" />
            <div className="h-3 w-full animate-pulse rounded-full bg-surface-soft" />
          </div>
        </div>
      ))}
    </section>
  );
}
