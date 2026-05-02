import { z } from "zod";

export const wishPriorityValues = ["WANT", "REALLY_WANT", "MUST_HAVE"] as const;

export const wishFormSchema = z.object({
  title: z
    .string()
    .min(1, "Đặt tên cho điều ước nha 🌸")
    .max(120, "Tên hơi dài, rút gọn lại nhé"),
  url: z
    .string()
    .trim()
    .url("Link không hợp lệ")
    .or(z.literal(""))
    .optional(),
  price: z
    .union([
      z
        .number({ message: "Giá phải là số" })
        .nonnegative("Giá không thể âm")
        .max(10_000_000_000, "Giá hơi lớn quá nhỉ"),
      z.nan(),
    ])
    .optional(),
  priority: z.enum(wishPriorityValues),
  note: z.string().max(500, "Note tối đa 500 ký tự").optional(),
});

export type WishFormValues = z.infer<typeof wishFormSchema>;

export const wishFormDefaults: WishFormValues = {
  title: "",
  url: "",
  price: undefined,
  priority: "WANT",
  note: "",
};
