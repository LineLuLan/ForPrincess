"use client";

import { useEffect } from "react";
import { rainHearts } from "@/lib/confetti";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const SEEN_KEY = "fp.last-ping-seen";

/**
 * Subscribes to ping inserts. When a fresh one arrives, rains hearts on screen.
 * Also fires once for the latest ping if it's newer than what we've seen
 * (covers the case where Princess opened the app right after Knight pinged).
 */
export function HeartRainListener() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    const supabase = createSupabaseBrowserClient();

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
        /* storage full / private mode — ignore */
      }
    };

    // Catch-up: rain once if there's a recent ping we haven't seen.
    void (async () => {
      const { data } = await supabase
        .from("pings")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1);
      if (cancelled) return;
      const latest = data?.[0]?.created_at;
      if (latest && new Date(latest).getTime() > lastSeen) {
        // Only auto-rain if the ping is fresh (< 5 min old) to avoid replays.
        const age = Date.now() - new Date(latest).getTime();
        if (age < 5 * 60 * 1000) rainHearts();
        markSeen(latest);
      }
    })();

    const channel = supabase
      .channel("pings-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pings" },
        (payload) => {
          const row = payload.new as { created_at?: string } | null;
          rainHearts();
          if (row?.created_at) markSeen(row.created_at);
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
