"use client";

import { useEffect } from "react";
import { celebrate } from "@/lib/confetti";

const STORAGE_KEY = "fp.seen-gifted-ids";

type ConfettiOnNewGiftsProps = {
  giftedIds: string[];
};

/**
 * Compares the current gifted-IDs list against the IDs stored in
 * localStorage. If at least one is new, fires confetti once and
 * updates the stored list. Re-runs when the prop changes (e.g. after
 * a server action revalidation).
 */
export function ConfettiOnNewGifts({ giftedIds }: ConfettiOnNewGiftsProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (giftedIds.length === 0) return;

    let seen: string[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      seen = raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      seen = [];
    }

    const seenSet = new Set(seen);
    const fresh = giftedIds.filter((id) => !seenSet.has(id));

    // First-ever visit: skip the celebration so we don't fire 10 times at once.
    if (seen.length === 0) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(giftedIds));
      } catch {
        /* storage full / private mode — ignore */
      }
      return;
    }

    if (fresh.length === 0) return;

    celebrate();

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(giftedIds));
    } catch {
      /* ignore */
    }
  }, [giftedIds]);

  return null;
}
