import { promises as fs } from "node:fs";
import path from "node:path";

let cached: string[] | null = null;

async function loadNotes(): Promise<string[]> {
  if (cached) return cached;
  const file = path.join(process.cwd(), "public", "love-notes.json");
  const raw = await fs.readFile(file, "utf-8");
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return (cached = []);
  cached = parsed.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
  return cached;
}

export async function getNoteForDate(date = new Date()): Promise<string | null> {
  const notes = await loadNotes();
  if (notes.length === 0) return null;
  const epochDays = Math.floor(date.getTime() / 86_400_000);
  return notes[epochDays % notes.length] ?? null;
}
