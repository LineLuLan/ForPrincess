import { AddWishConnected } from "@/components/AddWishConnected";
import { EmptyState } from "@/components/EmptyState";
import { WishCard } from "@/components/WishCard";
import { fetchVisibleWishes } from "@/lib/wish-queries";
import { PRIORITY_RANK } from "@/types/wish";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { items, source, warning } = await fetchVisibleWishes();

  const sorted = [...items].sort(
    (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Hộp ước mơ
        </span>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Những điều nàng đang mong 💝
        </h1>
        <p className="text-sm text-muted">
          Một nơi nhỏ để gửi gắm mong muốn, và để chàng âm thầm biến chúng thành kỷ niệm.
        </p>
      </header>

      {source === "mock" && warning && (
        <div className="rounded-2xl border border-dashed border-accent-soft bg-accent-soft/40 px-4 py-3 text-xs text-accent">
          ⚠️ {warning}
        </div>
      )}

      <AddWishConnected />

      {sorted.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((item) => (
            <WishCard key={item.id} item={item} />
          ))}
        </section>
      )}
    </div>
  );
}
