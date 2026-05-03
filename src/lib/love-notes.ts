import { promises as fs } from "node:fs";
import path from "node:path";

let cachedSeed: string[] | null = null;

async function loadSeed(): Promise<string[]> {
  if (cachedSeed) return cachedSeed;
  const file = path.join(process.cwd(), "public", "love-notes.json");
  try {
    const raw = await fs.readFile(file, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return (cachedSeed = []);
    cachedSeed = parsed.filter(
      (x): x is string => typeof x === "string" && x.trim().length > 0,
    );
    return cachedSeed;
  } catch {
    return (cachedSeed = []);
  }
}

/**
 * Pick a deterministic note for `date`. If `customNotes` is non-empty,
 * uses that pool; otherwise falls back to the seed JSON shipped in /public.
 */
export async function getNoteForDate(
  customNotes: string[] = [],
  date = new Date(),
): Promise<string | null> {
  const pool = customNotes.length > 0 ? customNotes : await loadSeed();
  if (pool.length === 0) return null;
  const epochDays = Math.floor(date.getTime() / 86_400_000);
  return pool[epochDays % pool.length] ?? null;
}
