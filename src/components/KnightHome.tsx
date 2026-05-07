import { Suspense } from "react";
import { HeartRainSection } from "@/components/sections/HeartRainSection";
import { KnightHeader } from "@/components/sections/KnightHeader";
import { LetterCardSection } from "@/components/sections/LetterCardSection";
import { WishGridSection } from "@/components/sections/WishGridSection";
import { KnightHeaderSkeleton } from "@/components/skeletons/KnightHeaderSkeleton";
import { LetterCardSkeleton } from "@/components/skeletons/LetterCardSkeleton";
import { WishGridSectionSkeleton } from "@/components/skeletons/WishGridSectionSkeleton";

export function KnightHome() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<KnightHeaderSkeleton />}>
        <KnightHeader />
      </Suspense>

      <Suspense fallback={<LetterCardSkeleton />}>
        <LetterCardSection viewerRole="KNIGHT" />
      </Suspense>

      <Suspense fallback={<WishGridSectionSkeleton viewerRole="KNIGHT" />}>
        <WishGridSection viewerRole="KNIGHT" />
      </Suspense>

      <Suspense fallback={null}>
        <HeartRainSection role="KNIGHT" />
      </Suspense>
    </div>
  );
}
