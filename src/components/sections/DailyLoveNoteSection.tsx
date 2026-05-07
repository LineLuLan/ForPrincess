import { DailyLoveNote } from "@/components/DailyLoveNote";
import { fetchKnightLoveNotes } from "@/lib/profile-queries";

export async function DailyLoveNoteSection() {
  const loveNotes = await fetchKnightLoveNotes();
  return <DailyLoveNote customNotes={loveNotes} />;
}
