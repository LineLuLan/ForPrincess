export type WishPriority = "WANT" | "REALLY_WANT" | "MUST_HAVE";
export type UserRole = "PRINCESS" | "KNIGHT";

export type WishItem = {
  id: string;
  title: string;
  url: string | null;
  image_url: string | null;
  price: number | null;
  currency: string | null;
  priority: WishPriority;
  note: string | null;
  is_secretly_buying: boolean;
  is_gifted: boolean;
  gifted_at: string | null;
  gift_message: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export const PRIORITY_LABEL: Record<WishPriority, string> = {
  WANT: "Thích",
  REALLY_WANT: "Rất thích",
  MUST_HAVE: "Phải có",
};

export const PRIORITY_RANK: Record<WishPriority, number> = {
  MUST_HAVE: 0,
  REALLY_WANT: 1,
  WANT: 2,
};
