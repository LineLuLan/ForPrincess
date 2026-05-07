import { getPingCooldown } from "@/app/actions/ping";
import { HeartRainButton } from "@/components/HeartRainButton";
import type { UserRole } from "@/types/wish";

type HeartRainSectionProps = {
  role: UserRole;
};

export async function HeartRainSection({ role }: HeartRainSectionProps) {
  const cooldownMs = await getPingCooldown();
  return <HeartRainButton initialCooldownMs={cooldownMs} role={role} />;
}
