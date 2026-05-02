import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Search } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "SeekSmart - Find the right AI tool",
    template: "%s | SeekSmart"
  },
  description:
    "Discover AI tools by category, use case, pricing, and alternatives.",
  openGraph: {
    title: "SeekSmart - Find the right AI tool",
    description:
      "Discover AI tools by category, use case, pricing, and alternatives.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-line bg-paper/90">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
              <a className="flex items-center gap-2 font-semibold" href="/">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-paper">
                  <Search aria-hidden="true" size={18} />
                </span>
                SeekSmart
              </a>
              <nav className="flex items-center gap-5 text-sm text-ink/70">
                <a href="/tools">Tools</a>
                <a href="/categories">Categories</a>
                <a href="/submit">Submit</a>
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
