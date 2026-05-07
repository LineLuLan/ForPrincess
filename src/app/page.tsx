import { KnightHome } from "@/components/KnightHome";
import { PrincessHome } from "@/components/PrincessHome";
import { getViewer } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const viewer = await getViewer();
  const role = viewer?.role ?? "PRINCESS";
  return role === "KNIGHT" ? <KnightHome /> : <PrincessHome />;
}
