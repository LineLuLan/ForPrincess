import { LetterCardClient } from "@/components/LetterCardClient";
import { fetchActiveLetter } from "@/lib/letter";
import type { UserRole } from "@/types/wish";

type LetterCardSectionProps = {
  viewerRole: UserRole;
};

export async function LetterCardSection({ viewerRole }: LetterCardSectionProps) {
  const letter = await fetchActiveLetter();
  if (!letter) return null;
  return (
    <LetterCardClient
      letter={{
        id: letter.id,
        title: letter.title,
        body: letter.body,
        startsAt: letter.startsAt,
        expiresAt: letter.expiresAt,
      }}
      viewerRole={viewerRole}
    />
  );
}
