import { Activity, Gift, Lock, Wallet } from "lucide-react";
import type { WishItem } from "@/types/wish";
import { formatPrice } from "@/lib/format";

type KpiBarProps = {
  items: WishItem[];
};

export function KpiBar({ items }: KpiBarProps) {
  const active = items.filter((i) => !i.is_gifted);
  const secret = active.filter((i) => i.is_secretly_buying);
  const gifted = items.filter((i) => i.is_gifted);
  const totalActiveValue = active.reduce(
    (sum, i) => sum + (i.price ?? 0),
    0,
  );

  const stats = [
    {
      label: "Đang chờ",
      value: active.length.toString(),
      icon: <Activity className="h-4 w-4" />,
      tone: "text-accent",
    },
    {
      label: "Đang chuẩn bị",
      value: secret.length.toString(),
      icon: <Lock className="h-4 w-4" />,
      tone: "text-mint",
    },
    {
      label: "Đã tặng",
      value: gifted.length.toString(),
      icon: <Gift className="h-4 w-4" />,
      tone: "text-gold",
    },
    {
      label: "Ước tính",
      value: formatPrice(totalActiveValue, "VND") ?? "0đ",
      icon: <Wallet className="h-4 w-4" />,
      tone: "text-accent",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-3 rounded-2xl border border-border bg-surface/80 px-4 py-3 backdrop-blur"
        >
          <div className={`grid h-9 w-9 place-items-center rounded-xl bg-surface-soft ${s.tone}`}>
            {s.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted">
              {s.label}
            </div>
            <div className="truncate font-mono text-base font-semibold text-foreground tabular-nums">
              {s.value}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
