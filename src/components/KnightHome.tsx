import { Shield, TerminalSquare } from "lucide-react";
import { AddWishConnected } from "@/components/AddWishConnected";
import { EmptyState } from "@/components/EmptyState";
import { KpiBar } from "@/components/KpiBar";
import { WishGrid, WishListProvider } from "@/components/WishGrid";
import { PRIORITY_RANK, type WishItem } from "@/types/wish";

type KnightHomeProps = {
  items: WishItem[];
};

export function KnightHome({ items }: KnightHomeProps) {
  const sortFn = (a: WishItem, b: WishItem) => {
    if (a.is_gifted !== b.is_gifted) return a.is_gifted ? 1 : -1;
    if (a.is_secretly_buying !== b.is_secretly_buying) {
      return a.is_secretly_buying ? -1 : 1;
    }
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  };

  return (
    <WishListProvider initialItems={items}>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-border bg-surface/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-mint">
              <TerminalSquare className="h-3 w-3" /> Knight · Bảng điều khiển
            </span>
            <h1 className="flex items-center gap-2 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              <Shield className="h-6 w-6 text-accent" />
              Những điều nàng đang mong
            </h1>
            <p className="text-xs text-muted">
              Sort theo mức độ → bí mật chuẩn bị → tặng đúng lúc.
            </p>
          </div>

          <div className="font-mono text-[11px] text-muted tabular-nums">
            last sync · {new Date().toLocaleTimeString("vi-VN")}
          </div>
        </header>

        <KpiBar items={items} />

        <AddWishConnected />

        {items.length === 0 ? (
          <EmptyState
            title="Chưa có điều ước nào"
            description="Khi nàng thêm điều đầu tiên, nó sẽ xuất hiện ở đây."
            icon={<Shield className="h-6 w-6" />}
          />
        ) : (
          <WishGrid viewerRole="KNIGHT" density="dense" sort={sortFn} />
        )}
      </div>
    </WishListProvider>
  );
}
