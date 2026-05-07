export function HeroSkeleton() {
  return (
    <div
      aria-hidden
      className="relative overflow-hidden rounded-[2rem] border border-border bg-surface/60 px-6 py-10 sm:px-10 sm:py-12"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="flex flex-col gap-3">
          <div className="h-5 w-32 animate-pulse rounded-full bg-mint-soft" />
          <div className="h-9 w-2/3 animate-pulse rounded-2xl bg-surface-soft" />
          <div className="h-7 w-1/2 animate-pulse rounded-2xl bg-accent-soft/40" />
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-surface-soft" />
        </div>
        <div className="h-32 w-32 animate-pulse rounded-2xl bg-surface-soft" />
      </div>
    </div>
  );
}
