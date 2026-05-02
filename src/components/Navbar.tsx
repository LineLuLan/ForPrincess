import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";

type NavbarProps = {
  roleSlot?: React.ReactNode;
  signOutSlot?: React.ReactNode;
};

export function Navbar({ roleSlot, signOutSlot }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/55">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 font-bold text-foreground"
        >
          <span className="relative grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-accent shadow-sm">
            <Heart className="h-4.5 w-4.5 fill-accent stroke-accent" strokeWidth={2.2} />
            <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-gold" />
          </span>
          <span className="text-lg tracking-tight">
            ForPrincess
            <span className="ml-1 text-accent transition-transform group-hover:scale-110 inline-block">💝</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 text-sm sm:flex">
          <NavLink href="/">Điều ước</NavLink>
          <NavLink href="/memories">Tủ kỷ niệm</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {roleSlot}
          {signOutSlot}
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-1.5 text-muted transition hover:bg-accent-soft hover:text-foreground"
    >
      {children}
    </Link>
  );
}
