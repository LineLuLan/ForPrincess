"use client";

import { useEffect, useState, useTransition } from "react";
import { Heart, Loader2 } from "lucide-react";
import { sendHeartPing } from "@/app/actions/ping";

type HeartRainButtonProps = {
  initialCooldownMs: number;
};

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function HeartRainButton({ initialCooldownMs }: HeartRainButtonProps) {
  const [readyAt, setReadyAt] = useState<number>(() => Date.now() + initialCooldownMs);
  const [now, setNow] = useState<number>(() => Date.now());
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = readyAt - now;
  const onCooldown = remaining > 0;

  const handleClick = () => {
    if (onCooldown || pending) return;
    setError(null);
    startTransition(async () => {
      const r = await sendHeartPing();
      if (!r.ok) {
        setError(r.message);
        if (r.retryInSeconds) {
          setReadyAt(Date.now() + r.retryInSeconds * 1000);
        }
        return;
      }
      setReadyAt(Date.now() + 15 * 60 * 1000);
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-1.5">
      {error && (
        <span className="rounded-full bg-surface-soft px-3 py-1 text-[11px] text-accent shadow">
          {error}
        </span>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={onCooldown || pending}
        className="group relative inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        aria-label="Gửi mưa tim cho nàng"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart className="h-4 w-4 fill-white" />
        )}
        <span>{onCooldown ? formatCountdown(remaining) : "Anh nhớ em"}</span>
      </button>
    </div>
  );
}
