"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { rainHearts } from "@/lib/confetti";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const SEEN_KEY = "fp.last-letter-seen";
const TOAST_DURATION_MS = 8000;

type ToastState = { id: string; title: string | null } | null;

/**
 * Mounts on Princess only. Subscribes to INSERT events on `letters` and:
 *   - rains hearts
 *   - shows a toast pointing her at the new letter card
 *   - triggers router.refresh() so the server-rendered LetterCard appears
 *
 * On first mount, also checks if the latest letter is fresh (< 5 min old) and
 * unseen — covers the case where Knight sent the letter while Princess was
 * away and she comes back.
 */
export function LetterListener() {
  const [toast, setToast] = useState<ToastState>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    let toastTimeout: ReturnType<typeof setTimeout> | null = null;
    const supabase = createSupabaseBrowserClient();

    const showToast = (title: string | null) => {
      const id = String(Date.now());
      setToast({ id, title });
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
        .from("letters")
        .select("created_at, title")
        .order("created_at", { ascending: false })
        .limit(1);
      if (cancelled) return;
      const latest = data?.[0];
      if (latest?.created_at && new Date(latest.created_at).getTime() > lastSeen) {
        const age = Date.now() - new Date(latest.created_at).getTime();
        if (age < 5 * 60 * 1000) {
          rainHearts();
          showToast(latest.title ?? null);
        }
        markSeen(latest.created_at);
      }
    })();

    const channel = supabase
      .channel("letters-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "letters" },
        (payload) => {
          const row = payload.new as {
            created_at?: string;
            title?: string | null;
          } | null;
          rainHearts();
          showToast(row?.title ?? null);
          if (row?.created_at) markSeen(row.created_at);
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      if (toastTimeout) clearTimeout(toastTimeout);
      void supabase.removeChannel(channel);
    };
  }, [router]);

  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border border-gold/50 bg-white/95 px-5 py-4 shadow-2xl backdrop-blur animate-[ping-pop_400ms_ease-out]">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
          <Mail className="h-4 w-4" />
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            Chàng vừa gửi
          </span>
          <p className="text-sm font-semibold text-foreground">
            {toast.title || "Một lá thư cho em..."}
          </p>
          <span className="mt-0.5 text-[11px] text-muted">Cuộn lên đầu trang để đọc 💌</span>
        </div>
      </div>
    </div>
  );
}
