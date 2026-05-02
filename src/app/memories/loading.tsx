import { WishGridSkeleton } from "@/components/WishGridSkeleton";

export default function MemoriesLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-24 animate-pulse rounded-[var(--radius-soft)] bg-surface-soft/60" />
      <WishGridSkeleton count={6} />
    </div>
  );
}
