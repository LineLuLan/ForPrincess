"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { signIn, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      action={formAction}
      className="w-full rounded-[var(--radius-soft)] border border-border bg-surface p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4">
        <Field label="Email" name="email" type="email" autoComplete="email" required />

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-muted">Mật khẩu</span>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="w-full rounded-2xl border border-border bg-surface px-3.5 py-2.5 pr-11 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-accent-soft hover:text-accent"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        {state.status === "error" && (
          <div className="rounded-2xl bg-accent-soft/50 px-3 py-2 text-xs text-accent">
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          Đăng nhập
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  ...input
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted">{label}</span>
      <input
        {...input}
        className="rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/40"
      />
    </label>
  );
}
