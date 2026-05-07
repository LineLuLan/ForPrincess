"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Heart, Loader2, Send, X } from "lucide-react";
import { sendHeartPing } from "@/app/actions/ping";
import type { UserRole } from "@/types/wish";

type HeartRainButtonProps = {
  initialCooldownMs: number;
  role: UserRole;
};

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const KNIGHT_SUGGESTIONS = [
  "Anh nhớ em quá",
  "Em ăn cơm chưa?",
  "Đang nghĩ tới em",
  "Yêu em",
];

const PRINCESS_SUGGESTIONS = [
  "Bé nhớ Na quá",
  "Na ăn cơm chưa?",
  "Đang nghĩ tới Na",
  "Yêu Na",
];

export function HeartRainButton({ initialCooldownMs, role }: HeartRainButtonProps) {
  const idleLabel = role === "KNIGHT" ? "Anh nhớ em" : "Bé nhớ Na";
  const placeholder =
    role === "KNIGHT" ? "Hôm nay anh nhớ em quá..." : "Hôm nay bé nhớ Na quá...";
  const SUGGESTIONS = role === "KNIGHT" ? KNIGHT_SUGGESTIONS : PRINCESS_SUGGESTIONS;
  const [readyAt, setReadyAt] = useState<number>(() => Date.now() + initialCooldownMs);
  const [now, setNow] = useState<number>(() => Date.now());
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const composerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Click outside to close composer.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (composerRef.current && !composerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  const remaining = readyAt - now;
  const onCooldown = remaining > 0;

  const handleSend = () => {
    if (onCooldown || pending) return;
    setError(null);
    startTransition(async () => {
      const r = await sendHeartPing(message.trim() || undefined);
      if (!r.ok) {
        setError(r.message);
        if (r.retryInSeconds) {
          setReadyAt(Date.now() + r.retryInSeconds * 1000);
        }
        return;
      }
      setReadyAt(Date.now() + 15 * 60 * 1000);
      setMessage("");
      setOpen(false);
    });
  };

  return (
    <div ref={composerRef} className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {open && !onCooldown && (
        <div className="w-72 rounded-2xl border border-border bg-surface p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              Lời nhắn (tùy chọn)
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng"
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted hover:bg-surface-soft"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <textarea
            autoFocus
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={200}
            placeholder={placeholder}
            className="block w-full resize-none rounded-xl border border-border bg-surface-soft px-3 py-2 text-sm text-foreground placeholder:text-muted/70 outline-none focus:border-accent focus:ring-2 focus:ring-ring/40"
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setMessage(s)}
                className="rounded-full bg-accent-soft/60 px-2.5 py-1 text-[11px] text-accent hover:bg-accent hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-[10px] text-muted">{message.length}/200</span>
            <button
              type="button"
              onClick={handleSend}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-accent/90 disabled:opacity-60"
            >
              {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Gửi
            </button>
          </div>
          {error && (
            <p className="mt-2 rounded-lg bg-accent-soft/50 px-2 py-1 text-[11px] text-accent">
              {error}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (onCooldown || pending) return;
          setOpen((v) => !v);
        }}
        disabled={onCooldown || pending}
        className="group inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        aria-label={role === "KNIGHT" ? "Gửi mưa tim cho nàng" : "Gửi mưa tim cho chàng"}
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart className="h-4 w-4 fill-white" />
        )}
        <span>{onCooldown ? formatCountdown(remaining) : idleLabel}</span>
      </button>
    </div>
  );
}
