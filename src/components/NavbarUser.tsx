import { Crown, Heart, LogOut } from "lucide-react";
import { getViewer } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

export async function NavbarUser() {
  const viewer = await getViewer();
  if (!viewer) return null;

  const isKnight = viewer.role === "KNIGHT";

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          isKnight
            ? "bg-foreground/90 text-white"
            : "bg-accent-soft text-accent"
        }`}
      >
        {isKnight ? <Crown className="h-3.5 w-3.5" /> : <Heart className="h-3.5 w-3.5 fill-current" />}
        {viewer.displayName ?? (isKnight ? "Knight" : "Princess")}
      </span>

      <form action={signOut}>
        <button
          type="submit"
          aria-label="Đăng xuất"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-accent-soft hover:text-accent"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
