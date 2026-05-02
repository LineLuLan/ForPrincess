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

export async function fetchVisibleWishes(): Promise<WishFetchResult> {
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
