import { Heart } from "lucide-react";
import { getNoteForDate } from "@/lib/love-notes";

export async function DailyLoveNote() {
  const note = await getNoteForDate();
  if (!note) return null;

  return (
    <div className="flex justify-end">
      <div
        className="relative w-full max-w-sm rotate-[1.2deg] rounded-2xl border border-accent-soft/60 bg-gradient-to-br from-accent-soft/40 to-mint-soft/40 px-5 py-4 shadow-md"
      >
        {/* tape */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-2 left-1/2 h-3 w-12 -translate-x-1/2 -rotate-3 rounded-sm bg-white/70 shadow-sm"
        />
        <div className="flex items-start gap-2">
          <Heart aria-hidden className="mt-1 h-3.5 w-3.5 shrink-0 fill-accent stroke-accent" />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              Lời nhắn hôm nay
            </span>
            <p
              className="font-[family-name:var(--font-script)] text-xl leading-snug text-accent sm:text-2xl"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              {note}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
