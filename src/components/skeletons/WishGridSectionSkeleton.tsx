import { WishGridSkeleton } from "@/components/WishGridSkeleton";
import { KpiBarSkeleton } from "@/components/skeletons/KpiBarSkeleton";

type WishGridSectionSkeletonProps = {
  viewerRole: "PRINCESS" | "KNIGHT";
};

export function WishGridSectionSkeleton({ viewerRole }: WishGridSectionSkeletonProps) {
  const isKnight = viewerRole === "KNIGHT";
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      {isKnight && <KpiBarSkeleton />}
      <div className="h-16 w-full animate-pulse rounded-[var(--radius-soft)] border-2 border-dashed border-border/80 bg-surface/40" />
      <WishGridSkeleton count={isKnight ? 8 : 6} cols={isKnight ? 4 : 3} />
    </div>
  );
}
