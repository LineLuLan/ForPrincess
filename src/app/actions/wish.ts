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
