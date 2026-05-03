"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarHeart } from "lucide-react";
import { getNextSpecialDate, type SpecialDate } from "@/lib/countdown";

type CountdownProps = {
  dates: SpecialDate[];
  tone?: "princess" | "knight";
};

export function Countdown({ dates, tone = "princess" }: CountdownProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const target = useMemo(() => getNextSpecialDate(dates, now), [dates, now]);
  if (!target) return null;

  const urgent = target.daysUntil <= 7;
  const days = target.daysUntil;
  const dayLabel =
    days === 0 ? "Hôm nay là" : days === 1 ? "Ngày mai là" : `Còn ${days} ngày là`;

  if (tone === "knight") {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-3 py-1.5 font-mono text-xs text-foreground ${
          urgent ? "ring-1 ring-mint" : ""
        }`}
      >
        <CalendarHeart className={`h-3.5 w-3.5 ${urgent ? "text-mint" : "text-muted"}`} />
        <span className="text-muted">{dayLabel}</span>
        <span className="font-semibold">{target.label}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-mint-soft/70 px-3.5 py-1.5 text-xs font-semibold text-accent shadow-sm ${
        urgent ? "animate-pulse" : ""
      }`}
    >
      <CalendarHeart className="h-3.5 w-3.5" />
      <span>{dayLabel}</span>
      <span className="font-[family-name:var(--font-script)] text-base text-accent">
        {target.label}
      </span>
    </div>
  );
}
