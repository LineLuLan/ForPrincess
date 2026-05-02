"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/auth";
import { wishPriorityValues } from "@/lib/wish-schema";

const addWishInput = z.object({
  title: z.string().trim().min(1).max(120),
  url: z.string().trim().url().or(z.literal("")).optional(),
  price: z.number().nonnegative().nullable().optional(),
  priority: z.enum(wishPriorityValues),
  note: z.string().trim().max(500).optional(),
  imageUrl: z.string().url().nullable().optional(),
});

export type AddWishInput = z.infer<typeof addWishInput>;

export type ActionResult =
  | { ok: true }
  | { ok: false; message: string };

export async function addWish(input: AddWishInput): Promise<ActionResult> {
  const viewer = await getViewer();
  if (!viewer) return { ok: false, message: "Hãy đăng nhập đã nhé." };

  const parsed = addWishInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("wish_items").insert({
    title: parsed.data.title,
    url: parsed.data.url || null,
    price: parsed.data.price ?? null,
    priority: parsed.data.priority,
    note: parsed.data.note || null,
    image_url: parsed.data.imageUrl ?? null,
    created_by: viewer.userId,
  });

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  return { ok: true };
}

async function ensureKnight(): Promise<ActionResult | null> {
  const viewer = await getViewer();
  if (!viewer) return { ok: false, message: "Hãy đăng nhập đã nhé." };
  if (viewer.role !== "KNIGHT") {
    return { ok: false, message: "Tính năng này chỉ Knight mới dùng được 🛡️" };
  }
  return null;
}

export async function setSecretBuying(
  wishId: string,
  isSecretlyBuying: boolean,
): Promise<ActionResult> {
  const guard = await ensureKnight();
  if (guard) return guard;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("wish_items")
    .update({ is_secretly_buying: isSecretlyBuying })
    .eq("id", wishId);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  return { ok: true };
}

const markGiftedInput = z.object({
  wishId: z.string().uuid(),
  message: z.string().trim().max(500).optional(),
});

export async function markGifted(
  wishId: string,
  message?: string,
): Promise<ActionResult> {
  const guard = await ensureKnight();
  if (guard) return guard;

  const parsed = markGiftedInput.safeParse({ wishId, message });
  if (!parsed.success) {
    return { ok: false, message: "Dữ liệu chưa hợp lệ." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("wish_items")
    .update({
      is_gifted: true,
      is_secretly_buying: false,
      gifted_at: new Date().toISOString(),
      gift_message: parsed.data.message?.trim() || null,
    })
    .eq("id", parsed.data.wishId);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  revalidatePath("/memories");
  return { ok: true };
}

export async function unmarkGifted(wishId: string): Promise<ActionResult> {
  const guard = await ensureKnight();
  if (guard) return guard;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("wish_items")
    .update({ is_gifted: false, gifted_at: null, gift_message: null })
    .eq("id", wishId);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  revalidatePath("/memories");
  return { ok: true };
}
