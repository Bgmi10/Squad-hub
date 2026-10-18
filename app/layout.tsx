import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Squad Hub", template: "%s | Squad Hub" },
  description: "Roster, fixtures, training schedule and stats for our football squad.",
};

const links = [["/", "Home"], ["/players", "Roster"], ["/calendar", "Calendar"], ["/stats", "Stats"]];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="bg-pitch-900 text-white">
          <nav className="mx-auto flex max-w-5xl items-center gap-4 overflow-x-auto px-4 py-3">
            <span className="mr-2 font-bold">⚽ Squad Hub</span>
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="whitespace-nowrap text-sm text-green-100 hover:text-white">{label}</Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
