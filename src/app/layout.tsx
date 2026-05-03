import type { Metadata } from "next";
import { headers } from "next/headers";
import { Dancing_Script, JetBrains_Mono, Quicksand } from "next/font/google";
import { HeartRainListener } from "@/components/HeartRainListener";
import { Navbar } from "@/components/Navbar";
import { NavbarUser } from "@/components/NavbarUser";
import { getViewer } from "@/lib/auth";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-caveat",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ForPrincess 💝",
  description: "Hộp ước mơ chung của hai người.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [viewer, h] = await Promise.all([getViewer(), headers()]);
  const pathname = h.get("x-pathname") ?? "";
  const isLogin = pathname === "/login" || pathname.startsWith("/login/");

  const role = isLogin
    ? "login-pink"
    : (viewer?.role ?? "PRINCESS").toLowerCase();

  return (
    <html
      lang="vi"
      data-role={role}
      className={`${quicksand.variable} ${dancingScript.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {viewer?.role === "PRINCESS" && <HeartRainListener />}
        <Navbar roleSlot={<NavbarUser />} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
        <footer className="border-t border-border/60 py-6 text-center text-xs text-muted">
          Made with <span className="text-accent">♥</span> — chỉ dành cho hai
          chúng mình.
        </footer>
      </body>
    </html>
  );
}
