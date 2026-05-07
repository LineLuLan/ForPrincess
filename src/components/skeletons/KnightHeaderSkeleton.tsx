export function KnightHeaderSkeleton() {
  return (
    <div
      aria-hidden
      className="flex flex-col gap-2 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="flex flex-col gap-2">
        <div className="h-4 w-40 animate-pulse rounded-md bg-surface-soft" />
        <div className="h-7 w-72 animate-pulse rounded-2xl bg-surface-soft" />
        <div className="h-3 w-56 animate-pulse rounded-full bg-surface-soft" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-7 w-28 animate-pulse rounded-md bg-surface-soft" />
          <div className="h-7 w-20 animate-pulse rounded-md bg-surface-soft" />
          <div className="h-7 w-20 animate-pulse rounded-md bg-surface-soft" />
          <div className="h-7 w-24 animate-pulse rounded-md bg-surface-soft" />
        </div>
        <div className="h-3 w-32 animate-pulse rounded-full bg-surface-soft" />
      </div>
    </div>
  );
}
