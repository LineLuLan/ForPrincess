export function DailyNoteSkeleton() {
  return (
    <div
      aria-hidden
      className="flex justify-end xl:pointer-events-none xl:fixed xl:inset-y-0 xl:right-0 xl:flex xl:w-[calc((100vw-64rem)/2)] xl:max-w-[18rem] xl:items-start xl:justify-center xl:pt-32"
    >
      <div className="relative w-full max-w-sm rotate-[2deg] rounded-2xl border border-accent-soft/40 bg-surface-soft/40 px-5 py-4 xl:max-w-[16rem]">
        <div className="flex items-start gap-2">
          <div className="mt-1 h-3.5 w-3.5 shrink-0 animate-pulse rounded-full bg-surface-soft" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3 w-24 animate-pulse rounded-full bg-surface-soft" />
            <div className="h-5 w-full animate-pulse rounded-full bg-surface-soft" />
            <div className="h-5 w-3/4 animate-pulse rounded-full bg-surface-soft" />
          </div>
        </div>
      </div>
    </div>
  );
}
