import { WishGridSkeleton } from "@/components/WishGridSkeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-32 animate-pulse rounded-[2rem] bg-surface-soft/70" />
      <div className="h-16 animate-pulse rounded-[var(--radius-soft)] bg-surface-soft/60" />
      <WishGridSkeleton count={6} />
    </div>
  );
}
