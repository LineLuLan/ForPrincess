import { AddWishForm } from "@/components/AddWishForm";
import { EmptyState } from "@/components/EmptyState";
import { WishCard } from "@/components/WishCard";
import { MOCK_WISHES } from "@/lib/mock-data";
import { PRIORITY_RANK } from "@/types/wish";

export default function HomePage() {
  const items = [...MOCK_WISHES].sort((a, b) => {
    if (a.is_gifted !== b.is_gifted) return a.is_gifted ? 1 : -1;
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  });

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

      <AddWishForm />

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <WishCard key={item.id} item={item} />
          ))}
        </section>
      )}
    </div>
  );
}
