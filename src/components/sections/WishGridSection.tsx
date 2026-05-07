import { AddWishConnected } from "@/components/AddWishConnected";
import { EmptyState } from "@/components/EmptyState";
import { KpiBar } from "@/components/KpiBar";
import { WishGrid, WishListProvider } from "@/components/WishGrid";
import { getViewer } from "@/lib/auth";
import { fetchVisibleWishes } from "@/lib/wish-queries";
import type { UserRole } from "@/types/wish";

type WishGridSectionProps = {
  viewerRole: UserRole;
};

export async function WishGridSection({ viewerRole }: WishGridSectionProps) {
  const [{ items, source, warning }, viewer] = await Promise.all([
    fetchVisibleWishes(),
    getViewer(),
  ]);
  const viewerId = viewer?.userId ?? null;
  const banner =
    source === "mock" && warning ? (
      <div className="rounded-2xl border border-dashed border-accent-soft bg-accent-soft/40 px-4 py-3 text-xs text-accent">
        ⚠️ {warning}
      </div>
    ) : null;

  return (
    <WishListProvider initialItems={items}>
      <div className="flex flex-col gap-6">
        {banner}
        {viewerRole === "KNIGHT" && <KpiBar items={items} />}
        <AddWishConnected />
        {items.length === 0 ? (
          viewerRole === "KNIGHT" ? (
            <EmptyState
              title="Chưa có điều ước nào"
              description="Khi nàng thêm điều đầu tiên, nó sẽ xuất hiện ở đây."
            />
          ) : (
            <EmptyState />
          )
        ) : (
          <WishGrid
            viewerRole={viewerRole}
            viewerId={viewerId}
            density={viewerRole === "KNIGHT" ? "dense" : "airy"}
          />
        )}
      </div>
    </WishListProvider>
  );
}
