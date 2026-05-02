import { AddWishConnected } from "@/components/AddWishConnected";
import { EmptyState } from "@/components/EmptyState";
import { KnightActions } from "@/components/KnightActions";
import { WishCard } from "@/components/WishCard";
import { getViewer } from "@/lib/auth";
import { fetchVisibleWishes } from "@/lib/wish-queries";
import { PRIORITY_RANK } from "@/types/wish";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [viewer, fetched] = await Promise.all([
    getViewer(),
    fetchVisibleWishes(),
  ]);

  const role = viewer?.role ?? "PRINCESS";
  const { items, source, warning } = fetched;

  const sorted = [...items].sort((a, b) => {
    if (a.is_secretly_buying !== b.is_secretly_buying) {
      // Knights see secret items pinned to the top so they don't forget.
      return a.is_secretly_buying ? -1 : 1;
    }
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  });

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {role === "KNIGHT" ? "Bảng điều khiển" : "Hộp ước mơ"}
        </span>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          {role === "KNIGHT"
            ? "Những điều nàng đang mong 🛡️"
            : "Những điều nàng đang mong 💝"}
        </h1>
        <p className="text-sm text-muted">
          {role === "KNIGHT"
            ? "Sort theo mức độ thích — bí mật chuẩn bị, rồi tặng đúng lúc."
            : "Một nơi nhỏ để gửi gắm mong muốn, và để chàng âm thầm biến chúng thành kỷ niệm."}
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
            <WishCard
              key={item.id}
              item={item}
              viewerRole={role}
              actionsSlot={role === "KNIGHT" ? <KnightActions item={item} /> : undefined}
            />
          ))}
        </section>
      )}
    </div>
  );
}
