import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "SeekSmart - Find the right AI tool",
    template: "%s | SeekSmart"
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    siteName: siteConfig.name,
    title: "SeekSmart - Find the right AI tool",
    description: siteConfig.description,
    url: "/",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "SeekSmart - Find the right AI tool",
    description: siteConfig.description
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
              <Link className="flex items-center gap-2 font-semibold" href="/">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-paper">
                  <Search aria-hidden="true" size={18} />
                </span>
                SeekSmart
              </Link>
              <nav className="flex items-center gap-5 text-sm text-ink/70">
                <Link href="/tools">Tools</Link>
                <Link href="/categories">Categories</Link>
                <Link href="/submit">Submit</Link>
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
