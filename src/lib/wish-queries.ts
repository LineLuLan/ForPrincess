import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { WishItem } from "@/types/wish";
import { MOCK_WISHES } from "@/lib/mock-data";

export type WishFetchResult = {
  items: WishItem[];
  source: "supabase" | "mock";
  warning: string | null;
};

function envConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export const fetchVisibleWishes = cache(async (): Promise<WishFetchResult> => {
  if (!envConfigured()) {
    return {
      items: MOCK_WISHES,
      source: "mock",
      warning: "Đang dùng dữ liệu giả — chưa cấu hình NEXT_PUBLIC_SUPABASE_URL.",
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("wish_items")
      .select("*")
      .eq("is_gifted", false)
      .order("created_at", { ascending: false });

    if (error) {
      return { items: [], source: "supabase", warning: error.message };
    }

    return { items: (data ?? []) as WishItem[], source: "supabase", warning: null };
  } catch (e) {
    return {
      items: MOCK_WISHES,
      source: "mock",
      warning:
        e instanceof Error ? e.message : "Không kết nối được Supabase, dùng dữ liệu giả.",
    };
  }
});

export type WishStats = {
  total: number;
  giftedCount: number;
  giftedRatio: number; // 0..1
  totalGiftedValueVND: number;
  mostExpensive: { title: string; price: number } | null;
  firstWish: { title: string; created_at: string } | null;
  avgDaysCreatedToGifted: number | null;
  monthly: { month: string; gifted: number }[]; // last 6 months
};

export async function fetchAllWishesForStats(): Promise<WishFetchResult> {
  if (!envConfigured()) {
    return { items: MOCK_WISHES, source: "mock", warning: null };
  }
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("wish_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return { items: [], source: "supabase", warning: error.message };
    return { items: (data ?? []) as WishItem[], source: "supabase", warning: null };
  } catch (e) {
    return {
      items: MOCK_WISHES,
      source: "mock",
      warning: e instanceof Error ? e.message : "Lỗi không xác định.",
    };
  }
}

export function computeWishStats(items: WishItem[]): WishStats {
  const total = items.length;
  const gifted = items.filter((w) => w.is_gifted);
  const giftedCount = gifted.length;
  const giftedRatio = total === 0 ? 0 : giftedCount / total;

  const totalGiftedValueVND = gifted.reduce(
    (sum, w) => sum + (w.price ?? 0),
    0,
  );

  const mostExpensive = gifted.reduce<WishStats["mostExpensive"]>(
    (best, w) =>
      w.price != null && (best == null || w.price > best.price)
        ? { title: w.title, price: w.price }
        : best,
    null,
  );

  const firstWish = items
    .slice()
    .sort((a, b) => a.created_at.localeCompare(b.created_at))[0];

  const giftedSpans = gifted
    .filter((w) => w.gifted_at)
    .map((w) => {
      const a = new Date(w.created_at).getTime();
      const b = new Date(w.gifted_at!).getTime();
      return Math.max(0, (b - a) / 86_400_000);
    });
  const avgDaysCreatedToGifted =
    giftedSpans.length === 0
      ? null
      : Math.round(giftedSpans.reduce((s, d) => s + d, 0) / giftedSpans.length);

  // Last 6 months gifted count, oldest → newest.
  const now = new Date();
  const months: { month: string; gifted: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const count = gifted.filter((w) => w.gifted_at?.startsWith(key)).length;
    months.push({ month: key, gifted: count });
  }

  return {
    total,
    giftedCount,
    giftedRatio,
    totalGiftedValueVND,
    mostExpensive,
    firstWish: firstWish
      ? { title: firstWish.title, created_at: firstWish.created_at }
      : null,
    avgDaysCreatedToGifted,
    monthly: months,
  };
}

export async function fetchGiftedWishes(): Promise<WishFetchResult> {
  if (!envConfigured()) {
    return {
      items: MOCK_WISHES.filter((w) => w.is_gifted),
      source: "mock",
      warning: null,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("wish_items")
      .select("*")
      .eq("is_gifted", true)
      .order("gifted_at", { ascending: false });

    if (error) {
      return { items: [], source: "supabase", warning: error.message };
    }

    return { items: (data ?? []) as WishItem[], source: "supabase", warning: null };
  } catch (e) {
    return {
      items: [],
      source: "mock",
      warning: e instanceof Error ? e.message : "Lỗi không xác định.",
    };
  }
}
