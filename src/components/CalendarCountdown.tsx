"use client";

import { useEffect, useMemo, useState } from "react";
import { getNextSpecialDate, type SpecialDate } from "@/lib/countdown";

const MONTH_VI = [
  "Th 1", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6",
  "Th 7", "Th 8", "Th 9", "Th 10", "Th 11", "Th 12",
];

const WEEKDAY_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

type CalendarCountdownProps = {
  dates: SpecialDate[];
};

export function CalendarCountdown({ dates }: CalendarCountdownProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const target = useMemo(() => getNextSpecialDate(dates, now), [dates, now]);
  if (!target) return null;

  // Compute the next occurrence's display values.
  const [, mm, dd] = target.date.split("-").map(Number);
  const month = MONTH_VI[(mm ?? 1) - 1] ?? "";
  const day = String(dd).padStart(2, "0");

  // Next occurrence Date for weekday lookup.
  const occ = (() => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let d = new Date(now.getFullYear(), (mm ?? 1) - 1, dd ?? 1);
    while (d < today) d = new Date(d.getFullYear() + 1, d.getMonth(), d.getDate());
    return d;
  })();
  const weekday = WEEKDAY_VI[occ.getDay()] ?? "";

  const urgent = target.daysUntil <= 7;
  const days = target.daysUntil;
  const tagline =
    days === 0 ? "Hôm nay là ngày đó" :
    days === 1 ? "Ngày mai rồi nhé" :
    `Còn ${days} ngày`;

  return (
    <div className="relative inline-flex items-stretch gap-3 rounded-2xl border border-accent-soft/70 bg-surface/80 p-2 shadow-sm">
      {/* Calendar tear-off */}
      <div className="relative flex w-20 flex-col items-center overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(236,124,139,0.25)] ring-1 ring-accent-soft">
        <div className="w-full bg-accent px-2 py-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          {month}
        </div>
        <div className="flex flex-col items-center justify-center px-2 py-2">
          <span className="text-3xl font-bold leading-none text-accent">{day}</span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted">
            {weekday}
          </span>
        </div>
        {/* Punch holes for sticker feel */}
        <div className="pointer-events-none absolute left-1/4 top-[18px] h-1 w-1 rounded-full bg-accent-soft" />
        <div className="pointer-events-none absolute right-1/4 top-[18px] h-1 w-1 rounded-full bg-accent-soft" />
      </div>

      {/* Body */}
      <div className="flex flex-col justify-center pr-2">
        <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${urgent ? "text-accent" : "text-muted"}`}>
          {tagline}
        </span>
        <span className="text-base font-semibold leading-tight text-foreground">
          {target.label}
        </span>
        {urgent && (
          <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-accent">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            sắp đến rồi
          </span>
        )}
      </div>
    </div>
  );
}
