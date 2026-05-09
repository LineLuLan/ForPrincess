export const PING_ICONS = {
  heart:    { emoji: "❤️",  colors: ["#ec4899", "#f472b6", "#fb7185"] },
  sparkle:  { emoji: "💖",  colors: ["#f472b6", "#fb7185", "#fce7f3"] },
  smitten:  { emoji: "🥰",  colors: ["#fbbf24", "#f472b6", "#fde68a"] },
  pleading: { emoji: "🥺",  colors: ["#fbbf24", "#a78bfa", "#fde68a"] },
  sad:      { emoji: "😢",  colors: ["#60a5fa", "#93c5fd", "#bfdbfe"] },
  crying:   { emoji: "😭",  colors: ["#3b82f6", "#60a5fa", "#dbeafe"] },
  angry:    { emoji: "😠",  colors: ["#ef4444", "#f87171", "#fecaca"] },
  huff:     { emoji: "😤",  colors: ["#f97316", "#fb923c", "#fed7aa"] },
} as const;

export type PingIcon = keyof typeof PING_ICONS;

export const PING_ICON_KEYS = [
  "heart",
  "sparkle",
  "smitten",
  "pleading",
  "sad",
  "crying",
  "angry",
  "huff",
] as const satisfies readonly PingIcon[];

export function isPingIcon(value: unknown): value is PingIcon {
  return typeof value === "string" && value in PING_ICONS;
}

export function toPingIcon(value: unknown): PingIcon {
  return isPingIcon(value) ? value : "heart";
}
