import { Suspense } from "react";
import { DailyLoveNoteSection } from "@/components/sections/DailyLoveNoteSection";
import { HeartRainSection } from "@/components/sections/HeartRainSection";
import { LetterCardSection } from "@/components/sections/LetterCardSection";
import { PrincessHero } from "@/components/sections/PrincessHero";
import { WishGridSection } from "@/components/sections/WishGridSection";
import { DailyNoteSkeleton } from "@/components/skeletons/DailyNoteSkeleton";
import { HeroSkeleton } from "@/components/skeletons/HeroSkeleton";
import { LetterCardSkeleton } from "@/components/skeletons/LetterCardSkeleton";
import { WishGridSectionSkeleton } from "@/components/skeletons/WishGridSectionSkeleton";

export function PrincessHome() {
  return (
    <div className="flex flex-col gap-10">
      <Suspense fallback={<HeroSkeleton />}>
        <PrincessHero />
      </Suspense>

      <Suspense fallback={<LetterCardSkeleton />}>
        <LetterCardSection viewerRole="PRINCESS" />
      </Suspense>

      <Suspense fallback={<DailyNoteSkeleton />}>
        <DailyLoveNoteSection />
      </Suspense>

      <Suspense fallback={<WishGridSectionSkeleton viewerRole="PRINCESS" />}>
        <WishGridSection viewerRole="PRINCESS" />
      </Suspense>

      <Suspense fallback={null}>
        <HeartRainSection role="PRINCESS" />
      </Suspense>
    </div>
  );
}
