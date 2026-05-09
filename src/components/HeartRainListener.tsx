"use client";

import { useEffect, useState } from "react";
import { rainIcons } from "@/lib/confetti";
import { PING_ICONS, toPingIcon, type PingIcon } from "@/lib/ping-icons";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const SEEN_KEY = "fp.last-ping-seen";
const TOAST_DURATION_MS = 6000;

type ToastState = { id: string; message: string; icon: PingIcon } | null;

type HeartRainListenerProps = {
  viewerId: string;
  senderLabel: string;
};

export function HeartRainListener({ viewerId, senderLabel }: HeartRainListenerProps) {
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    let toastTimeout: ReturnType<typeof setTimeout> | null = null;
    const supabase = createSupabaseBrowserClient();

    const showToast = (message: string | null, icon: PingIcon) => {
      if (!message) return;
      const id = String(Date.now());
      setToast({ id, message, icon });
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    };

    const lastSeen = (() => {
      try {
        const raw = window.localStorage.getItem(SEEN_KEY);
        return raw ? new Date(raw).getTime() : 0;
      } catch {
        return 0;
      }
    })();

    const markSeen = (iso: string) => {
      try {
        window.localStorage.setItem(SEEN_KEY, iso);
      } catch {
        /* ignore */
      }
    };

    void (async () => {
      const { data } = await supabase
        .from("pings")
        .select("created_at, message, from_user, type")
        .neq("from_user", viewerId)
        .order("created_at", { ascending: false })
        .limit(1);
      if (cancelled) return;
      const latest = data?.[0];
      if (latest?.created_at && new Date(latest.created_at).getTime() > lastSeen) {
        const age = Date.now() - new Date(latest.created_at).getTime();
        if (age < 5 * 60 * 1000) {
          const icon = toPingIcon(latest.type);
          rainIcons(icon);
          showToast(latest.message ?? null, icon);
        }
        markSeen(latest.created_at);
      }
    })();

    const channel = supabase
      .channel("pings-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pings" },
        (payload) => {
          const row = payload.new as {
            created_at?: string;
            message?: string | null;
            from_user?: string;
            type?: string | null;
          } | null;
          if (!row || row.from_user === viewerId) return;
          const icon = toPingIcon(row.type);
          rainIcons(icon);
          showToast(row.message ?? null, icon);
          if (row.created_at) markSeen(row.created_at);
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      if (toastTimeout) clearTimeout(toastTimeout);
      void supabase.removeChannel(channel);
    };
  }, [viewerId]);

  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border border-accent-soft/70 bg-white/95 px-5 py-4 shadow-2xl backdrop-blur animate-[ping-pop_400ms_ease-out]">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-lg leading-none">
          <span aria-hidden>{PING_ICONS[toast.icon].emoji}</span>
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            {senderLabel}
          </span>
          <p
            className="font-[family-name:var(--font-script)] text-xl leading-snug text-accent"
            style={{ fontFamily: "var(--font-caveat)" }}
          >
            {toast.message}
          </p>
        </div>
      </div>
    </div>
  );
}
