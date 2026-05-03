import { BarChart3, CalendarHeart, Crown, Gift, Sparkles, Timer } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { formatGiftedDate, formatPrice } from "@/lib/format";
import { computeWishStats, fetchAllWishesForStats } from "@/lib/wish-queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Thống kê — ForPrincess",
};

export default async function StatsPage() {
  const fetched = await fetchAllWishesForStats();
  const stats = computeWishStats(fetched.items);

  if (stats.total === 0) {
    return (
      <div className="flex flex-col gap-8">
        <Header />
        <EmptyState
          title="Chưa có dữ liệu để thống kê"
          description="Khi đã có vài điều ước, nơi này sẽ hiện những con số đáng yêu."
        />
      </div>
    );
  }

  const maxMonthly = Math.max(1, ...stats.monthly.map((m) => m.gifted));

  return (
    <div className="flex flex-col gap-8">
      <Header />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Sparkles className="h-4 w-4" />}
          label="Tổng điều ước"
          value={String(stats.total)}
        />
        <StatCard
          icon={<Gift className="h-4 w-4" />}
          label="Đã tặng"
          value={`${stats.giftedCount} / ${stats.total}`}
          sub={`${Math.round(stats.giftedRatio * 100)}%`}
        />
        <StatCard
          icon={<BarChart3 className="h-4 w-4" />}
          label="Tổng giá trị quà"
          value={
            formatPrice(stats.totalGiftedValueVND, "VND") ??
            `${stats.totalGiftedValueVND.toLocaleString("vi-VN")} đ`
          }
        />
        <StatCard
          icon={<Crown className="h-4 w-4" />}
          label="Món đắt nhất"
          value={stats.mostExpensive?.title ?? "—"}
          sub={
            stats.mostExpensive
              ? formatPrice(stats.mostExpensive.price, "VND") ?? undefined
              : undefined
          }
        />
        <StatCard
          icon={<CalendarHeart className="h-4 w-4" />}
          label="Điều ước đầu tiên"
          value={stats.firstWish?.title ?? "—"}
          sub={
            stats.firstWish
              ? formatGiftedDate(stats.firstWish.created_at) ?? undefined
              : undefined
          }
        />
        <StatCard
          icon={<Timer className="h-4 w-4" />}
          label="TB từ thêm → tặng"
          value={
            stats.avgDaysCreatedToGifted == null
              ? "—"
              : `${stats.avgDaysCreatedToGifted} ngày`
          }
        />
      </section>

      <section className="rounded-[var(--radius-soft)] border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Quà tặng 6 tháng gần nhất
          </h2>
          <span className="text-xs text-muted">cao nhất {maxMonthly}</span>
        </div>
        <div className="flex h-32 items-end gap-2">
          {stats.monthly.map((m) => {
            const pct = (m.gifted / maxMonthly) * 100;
            const [, mm] = m.month.split("-");
            return (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-accent/80 transition-all"
                    style={{ height: `${pct}%`, minHeight: m.gifted > 0 ? 4 : 0 }}
                    title={`${m.gifted} món`}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted">T{Number(mm)}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Header() {
  return (
    <header className="flex flex-col gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        <BarChart3 className="h-3.5 w-3.5" /> Thống kê
      </span>
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Những con số nhỏ của hai mình 📊
      </h1>
      <p className="text-sm text-muted">
        Xem hành trình từ điều ước đầu tiên đến những kỷ niệm đã thành hình.
      </p>
    </header>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-[var(--radius-soft)] border border-border bg-surface p-4 shadow-sm">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
        {icon}
        {label}
      </span>
      <span className="text-lg font-semibold text-foreground line-clamp-1">{value}</span>
      {sub && <span className="text-xs text-accent">{sub}</span>}
    </div>
  );
}
