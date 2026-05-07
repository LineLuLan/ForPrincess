"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, X } from "lucide-react";
import type { UserRole } from "@/types/wish";

type LetterCardClientProps = {
  letter: {
    id: string;
    title: string | null;
    body: string;
    startsAt: string;
    expiresAt: string;
  };
  viewerRole: UserRole;
};

function formatRemaining(ms: number): string {
  if (ms <= 0) return "đã hết hạn";
  const totalMinutes = Math.floor(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `Còn ${minutes}m`;
  return `Còn ${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function formatScheduledFor(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LetterCardClient({ letter, viewerRole }: LetterCardClientProps) {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState<number>(() => Date.now());
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  const expiresMs = new Date(letter.expiresAt).getTime();
  const startsMs = new Date(letter.startsAt).getTime();
  const remainingMs = expiresMs - now;
  if (remainingMs <= 0) return null;

  const isScheduled = startsMs > now;
  // Princess never reaches this branch (RLS hides scheduled rows). Defensive only.
  if (isScheduled && viewerRole === "PRINCESS") return null;

  const remainingLabel = formatRemaining(remainingMs);
  const scheduledLabel = formatScheduledFor(letter.startsAt);
  const preview =
    letter.title?.trim() ||
    letter.body.replace(/\s+/g, " ").slice(0, 96).trim() + (letter.body.length > 96 ? "…" : "");

  const headline = isScheduled
    ? "Lá thư đã lên lịch"
    : viewerRole === "PRINCESS"
      ? "Một lá thư từ chàng"
      : "Lá thư em đã gửi cho nàng";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative w-full overflow-hidden rounded-[var(--radius-soft)] px-5 py-5 text-left shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring/60 sm:px-6 ${
          isScheduled
            ? "border border-dashed border-gold/60 bg-gradient-to-br from-surface-soft/80 via-gold/10 to-surface-soft/60 opacity-95"
            : "border border-gold/40 bg-gradient-to-br from-accent-soft/60 via-gold/15 to-mint-soft/60"
        }`}
      >
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-accent-soft/40 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-surface text-2xl shadow-sm">
            💌
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
              {headline}
            </span>
            <span className="truncate text-base font-semibold text-foreground">{preview}</span>
            <span className="mt-1 inline-flex flex-wrap items-center gap-2 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1 rounded-full bg-surface/80 px-2 py-0.5 font-mono tabular-nums">
                {isScheduled ? `📅 Mở vào ${scheduledLabel}` : `⏳ ${remainingLabel}`}
              </span>
              <span className="text-accent transition group-hover:translate-x-0.5">
                {isScheduled ? "Xem trước →" : "Nhấn để đọc →"}
              </span>
            </span>
          </div>
        </div>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
        className="m-auto w-full max-w-2xl rounded-[var(--radius-soft)] border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-foreground/40 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[90vh] flex-col">
          <div className="flex items-start justify-between gap-3 border-b border-border/60 px-6 py-4">
            <div className="flex flex-col gap-0.5">
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                <Mail className="h-3 w-3" />
                {headline}
              </span>
              {letter.title && (
                <h2 className="text-lg font-semibold text-foreground">{letter.title}</h2>
              )}
              <span className="font-mono text-[11px] tabular-nums text-muted">
                {isScheduled ? `📅 Hiện vào ${scheduledLabel}` : `⏳ ${remainingLabel}`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface-soft"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <p
              className="whitespace-pre-wrap font-[family-name:var(--font-script)] text-2xl leading-relaxed text-foreground"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              {letter.body}
            </p>
          </div>

          <div className="flex justify-end border-t border-border/60 px-6 py-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted hover:text-foreground"
            >
              Đóng
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
