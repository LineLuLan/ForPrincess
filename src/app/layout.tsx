import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { NavbarUser } from "@/components/NavbarUser";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ForPrincess 💝",
  description: "Hộp ước mơ chung của hai người.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${quicksand.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
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
