import { Sparkles } from "lucide-react";
import { AddWishConnected } from "@/components/AddWishConnected";
import { CalendarCountdown } from "@/components/CalendarCountdown";
import { DailyLoveNote } from "@/components/DailyLoveNote";
import { EmptyState } from "@/components/EmptyState";
import { FloatingHearts } from "@/components/FloatingHearts";
import { HeartRainButton } from "@/components/HeartRainButton";
import { LetterCardClient } from "@/components/LetterCardClient";
import { WishGrid, WishListProvider } from "@/components/WishGrid";
import type { SpecialDate } from "@/lib/countdown";
import type { ActiveLetter } from "@/lib/letter";
import { type WishItem } from "@/types/wish";

type PrincessHomeProps = {
  items: WishItem[];
  specialDates: SpecialDate[];
  loveNotes: string[];
  viewerId: string | null;
  activeLetter: ActiveLetter | null;
  pingCooldownMs: number;
};

export function PrincessHome({
  items,
  specialDates,
  loveNotes,
  viewerId,
  activeLetter,
  pingCooldownMs,
}: PrincessHomeProps) {
  return (
    <WishListProvider initialItems={items}>
      <div className="flex flex-col gap-10">
        {/* Hero — airy, dreamy, script accent */}
        <header className="relative overflow-hidden rounded-[2rem] border border-border bg-surface/60 px-6 py-10 sm:px-10 sm:py-12">
          <FloatingHearts />
          <div className="pointer-events-none absolute -right-12 -top-10 h-44 w-44 rounded-full bg-mint/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-accent-soft/60 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="flex flex-col gap-3">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-mint-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                <Sparkles className="h-3 w-3" /> Hộp ước mơ
              </span>
              <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                Những điều em đang mong{" "}
                <span className="text-4xl sm:text-5xl" aria-label="cỏ bốn lá">
                  🍀
                </span>
              </h1>
              <p
                className="font-[family-name:var(--font-script)] text-2xl text-accent/90 sm:text-3xl"
                aria-hidden
              >
                mỗi ước mơ là một ngày mai
              </p>
              <p className="max-w-xl text-sm text-muted">
                Một nơi nhỏ để gửi gắm mong muốn — chàng sẽ âm thầm biến chúng thành
                kỷ niệm khi đúng lúc.
              </p>
            </div>

            <CalendarCountdown dates={specialDates} />
          </div>
        </header>

        {activeLetter && (
          <LetterCardClient
            letter={{
              id: activeLetter.id,
              title: activeLetter.title,
              body: activeLetter.body,
              startsAt: activeLetter.startsAt,
              expiresAt: activeLetter.expiresAt,
            }}
            viewerRole="PRINCESS"
          />
        )}

        <DailyLoveNote customNotes={loveNotes} />

        <AddWishConnected />

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <WishGrid viewerRole="PRINCESS" viewerId={viewerId} density="airy" />
        )}
      </div>
      <HeartRainButton initialCooldownMs={pingCooldownMs} role="PRINCESS" />
    </WishListProvider>
  );
}
