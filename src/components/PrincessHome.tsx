import { Heart, Sparkles } from "lucide-react";
import { AddWishConnected } from "@/components/AddWishConnected";
import { EmptyState } from "@/components/EmptyState";
import { WishGrid, WishListProvider } from "@/components/WishGrid";
import { PRIORITY_RANK, type WishItem } from "@/types/wish";

type PrincessHomeProps = {
  items: WishItem[];
};

export function PrincessHome({ items }: PrincessHomeProps) {
  const sortFn = (a: WishItem, b: WishItem) =>
    PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];

  return (
    <WishListProvider initialItems={items}>
      <div className="flex flex-col gap-10">
        {/* Hero — airy, dreamy, script accent */}
        <header className="relative overflow-hidden rounded-[2rem] border border-border bg-surface/60 px-6 py-10 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-12 -top-10 h-44 w-44 rounded-full bg-mint/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-accent-soft/60 blur-3xl" />

          <div className="relative flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-mint-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              <Sparkles className="h-3 w-3" /> Hộp ước mơ
            </span>
            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Những điều em đang mong{" "}
              <span className="font-[family-name:var(--font-script)] text-4xl text-accent sm:text-5xl">
                ✨
              </span>
            </h1>
            <p
              className="font-[family-name:var(--font-script)] text-2xl text-accent/90 sm:text-3xl"
              aria-hidden
            >
              mỗi ước mơ là một ngày mai
            </p>
            <p className="max-w-xl text-sm text-muted">
              Một nơi nhỏ để gửi gắm mong muốn — chàng sẽ âm thầm biến chúng thành
              kỷ niệm khi đúng lúc.
            </p>
          </div>
        </header>

        <AddWishConnected />

        {items.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-6 w-6 fill-accent stroke-accent" />}
          />
        ) : (
          <WishGrid viewerRole="PRINCESS" density="airy" sort={sortFn} />
        )}
      </div>
    </WishListProvider>
  );
}
