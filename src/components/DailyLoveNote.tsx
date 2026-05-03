import { Heart } from "lucide-react";
import { getNoteForDate } from "@/lib/love-notes";

export async function DailyLoveNote() {
  const note = await getNoteForDate();
  if (!note) return null;

  return (
    <div className="relative mx-auto max-w-xl rounded-3xl border border-accent-soft/60 bg-accent-soft/30 px-6 py-5 text-center shadow-sm">
      <Heart
        aria-hidden
        className="absolute -left-2 -top-2 h-5 w-5 fill-accent stroke-accent drop-shadow-sm"
      />
      <p
        className="font-[family-name:var(--font-script)] text-2xl leading-snug text-accent sm:text-3xl"
        style={{ fontFamily: "var(--font-caveat)" }}
      >
        {note}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted">
        Lời nhắn hôm nay
      </p>
    </div>
  );
}
