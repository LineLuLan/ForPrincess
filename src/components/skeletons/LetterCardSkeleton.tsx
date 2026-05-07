export function LetterCardSkeleton() {
  return (
    <div
      aria-hidden
      className="relative overflow-hidden rounded-[var(--radius-soft)] border border-gold/20 bg-gradient-to-br from-accent-soft/20 via-gold/5 to-mint-soft/20 px-5 py-5 sm:px-6"
    >
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 animate-pulse rounded-2xl bg-surface-soft" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-3 w-28 animate-pulse rounded-full bg-surface-soft" />
          <div className="h-5 w-2/3 animate-pulse rounded-full bg-surface-soft" />
          <div className="h-3 w-1/3 animate-pulse rounded-full bg-surface-soft" />
        </div>
      </div>
    </div>
  );
}
