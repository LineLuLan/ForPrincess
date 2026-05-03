import { Heart } from "lucide-react";
import { getNoteForDate } from "@/lib/love-notes";

type DailyLoveNoteProps = {
  customNotes?: string[];
};

export async function DailyLoveNote({ customNotes = [] }: DailyLoveNoteProps) {
  const note = await getNoteForDate(customNotes);
  if (!note) return null;

  return (
    <div className="flex justify-end xl:pointer-events-none xl:fixed xl:inset-y-0 xl:right-0 xl:flex xl:w-[calc((100vw-64rem)/2)] xl:max-w-[18rem] xl:items-start xl:justify-center xl:pt-32">
      <div className="pointer-events-auto relative w-full max-w-sm rotate-[2deg] rounded-2xl border border-accent-soft/60 bg-gradient-to-br from-accent-soft/50 to-mint-soft/40 px-5 py-4 shadow-lg xl:max-w-[16rem]">
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
