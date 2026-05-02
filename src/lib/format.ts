export function formatPrice(value: number | null, currency: string | null): string | null {
  if (value == null) return null;
  const code = currency ?? "VND";
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString("vi-VN")} ${code}`;
  }
}

export function formatGiftedDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}
