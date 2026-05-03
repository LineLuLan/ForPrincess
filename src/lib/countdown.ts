import { z } from "zod";

export const specialDateSchema = z.object({
  label: z.string().trim().min(1).max(60),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày phải dạng YYYY-MM-DD"),
});

export const specialDatesSchema = z.array(specialDateSchema).max(20);

export type SpecialDate = z.infer<typeof specialDateSchema>;

export type CountdownTarget = {
  label: string;
  date: string;
  daysUntil: number;
};

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function nextOccurrence(isoDate: string, today: Date): Date {
  // Anniversary-style: roll forward year-by-year so once a date passes,
  // we count down to the same MM-DD next year.
  const [y, m, d] = isoDate.split("-").map(Number);
  let candidate = new Date(y, (m ?? 1) - 1, d ?? 1);
  while (startOfDay(candidate) < startOfDay(today)) {
    candidate = new Date(candidate.getFullYear() + 1, candidate.getMonth(), candidate.getDate());
  }
  return candidate;
}

export function getNextSpecialDate(
  raw: unknown,
  today = new Date(),
): CountdownTarget | null {
  const parsed = specialDatesSchema.safeParse(raw);
  const dates = parsed.success ? parsed.data : [];
  if (dates.length === 0) return null;

  const start = startOfDay(today);
  let best: CountdownTarget | null = null;

  for (const sd of dates) {
    const next = nextOccurrence(sd.date, today);
    const days = Math.round((next.getTime() - start.getTime()) / 86_400_000);
    if (best === null || days < best.daysUntil) {
      best = { label: sd.label, date: sd.date, daysUntil: days };
    }
  }

  return best;
}

export function parseSpecialDates(raw: unknown): SpecialDate[] {
  const parsed = specialDatesSchema.safeParse(raw);
  return parsed.success ? parsed.data : [];
}
