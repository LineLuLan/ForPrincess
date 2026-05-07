export function KpiBarSkeleton() {
  return (
    <section aria-hidden className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-2xl border border-border bg-surface/80 px-4 py-3"
        >
          <div className="h-9 w-9 animate-pulse rounded-xl bg-surface-soft" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="h-2.5 w-16 animate-pulse rounded-full bg-surface-soft" />
            <div className="h-4 w-12 animate-pulse rounded-full bg-surface-soft" />
          </div>
        </div>
      ))}
    </section>
  );
}
