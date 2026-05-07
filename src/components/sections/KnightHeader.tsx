import { Shield, TerminalSquare } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { LetterComposerButton } from "@/components/LetterComposerButton";
import { LoveNotesDialog } from "@/components/LoveNotesDialog";
import { SpecialDatesDialog } from "@/components/SpecialDatesDialog";
import { fetchActiveLetter } from "@/lib/letter";
import {
  fetchKnightLoveNotes,
  fetchKnightSpecialDates,
} from "@/lib/profile-queries";

export async function KnightHeader() {
  const [specialDates, loveNotes, activeLetter] = await Promise.all([
    fetchKnightSpecialDates(),
    fetchKnightLoveNotes(),
    fetchActiveLetter(),
  ]);

  return (
    <header className="flex flex-col gap-2 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-border bg-surface/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-mint">
          <TerminalSquare className="h-3 w-3" /> Knight · Bảng điều khiển
        </span>
        <h1 className="flex items-center gap-2 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
          <Shield className="h-6 w-6 text-accent" />
          Những điều nàng đang mong
        </h1>
        <p className="text-xs text-muted">
          Sort theo mức độ → bí mật chuẩn bị → tặng đúng lúc.
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Countdown dates={specialDates} tone="knight" />
          <SpecialDatesDialog initial={specialDates} />
          <LoveNotesDialog initial={loveNotes} />
          <LetterComposerButton hasActiveLetter={activeLetter !== null} />
        </div>
        <div className="font-mono text-[11px] text-muted tabular-nums">
          last sync · {new Date().toLocaleTimeString("vi-VN")}
        </div>
      </div>
    </header>
  );
}
