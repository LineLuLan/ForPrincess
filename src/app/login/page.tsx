import Link from "next/link";
import { Heart } from "lucide-react";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Đăng nhập — ForPrincess",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 py-10 sm:py-16">
      <Link href="/" className="flex flex-col items-center gap-2">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent shadow-sm">
          <Heart className="h-6 w-6 fill-accent stroke-accent" />
        </span>
        <span className="text-xl font-bold">ForPrincess 💝</span>
        <span className="text-xs text-muted">Hộp ước mơ chung của hai mình.</span>
      </Link>

      <LoginForm />
    </div>
  );
}
