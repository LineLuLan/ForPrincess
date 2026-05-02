import { Sparkles } from "lucide-react";
import { ConfettiOnNewGifts } from "@/components/ConfettiOnNewGifts";
import { EmptyState } from "@/components/EmptyState";
import { WishCard } from "@/components/WishCard";
import { getViewer } from "@/lib/auth";
import { fetchGiftedWishes } from "@/lib/wish-queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tủ kỷ niệm — ForPrincess",
};

export default async function MemoriesPage() {
  const [viewer, fetched] = await Promise.all([
    getViewer(),
    fetchGiftedWishes(),
  ]);

  const role = viewer?.role ?? "PRINCESS";
  const items = fetched.items;

  return (
    <div className="flex flex-col gap-8">
      <ConfettiOnNewGifts giftedIds={items.map((i) => i.id)} />

      <header className="flex flex-col gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          <Sparkles className="h-3.5 w-3.5" /> Tủ kỷ niệm
        </span>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Những điều đã thành kỷ niệm 🎁
        </h1>
        <p className="text-sm text-muted">
          Mỗi món đồ ở đây là một ngày mình đã đi qua cùng nhau.
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          title="Chưa có kỷ niệm nào"
          description="Khi chàng tặng món đầu tiên, nó sẽ bay vào đây kèm lời nhắn ✨"
          icon={<Sparkles className="h-6 w-6" />}
        />
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <WishCard key={item.id} item={item} viewerRole={role} />
          ))}
        </section>
      )}
    </div>
  );
}
