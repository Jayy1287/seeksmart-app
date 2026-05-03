import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const brandLogo = "/brand/seeksmart-logo.png";

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
  icons: {
    icon: brandLogo,
    apple: brandLogo
  },
  openGraph: {
    siteName: siteConfig.name,
    title: "SeekSmart - Find the right AI tool",
    description: siteConfig.description,
    url: "/",
    type: "website",
    images: [
      {
        url: brandLogo,
        width: 500,
        height: 500,
        alt: "SeekSmart logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SeekSmart - Find the right AI tool",
    description: siteConfig.description,
    images: [brandLogo]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem("seeksmart-theme");
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (theme === "dark" || (!theme && prefersDark)) {
                  document.documentElement.classList.add("dark");
                }
              } catch {}
            `
          }}
        />
      </head>
      <body>
        <div className="min-h-screen">
          <header className="sticky top-0 z-50 border-b border-line bg-paper/88 shadow-sm shadow-ink/5 backdrop-blur-xl">
            <div className="app-container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <Link className="flex items-center gap-3 font-semibold" href="/">
                <span className="brand-mark flex h-11 w-11 items-center justify-center rounded-full">
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="brand-logo-image"
                    height={44}
                    priority
                    src={brandLogo}
                    width={44}
                  />
                </span>
                <span className="leading-tight">
                  <span className="block">SeekSmart</span>
                  <span className="block text-xs font-medium text-ink/45">
                    AI tool intelligence
                  </span>
                </span>
              </Link>
              <div className="flex w-full items-center gap-3 sm:w-auto">
                <nav className="flex flex-1 items-center justify-between gap-3 rounded-full border border-line bg-surface/70 px-3 py-2 text-sm font-medium text-ink/70 shadow-sm sm:flex-none sm:justify-start sm:gap-5">
                  <Link className="transition hover:text-accent" href="/tools">
                    Tools
                  </Link>
                  <Link
                    className="transition hover:text-accent"
                    href="/categories"
                  >
                    Categories
                  </Link>
                  <Link
                    className="transition hover:text-accent"
                    href="/use-cases"
                  >
                    Use cases
                  </Link>
                  <Link className="transition hover:text-accent" href="/submit">
                    Submit
                  </Link>
                </nav>
                <ThemeToggle />
              </div>
            </div>
          </header>
          {children}
          <footer className="border-t border-line bg-paper/80">
            <div className="app-container flex flex-col gap-3 py-8 text-sm text-ink/55 md:flex-row md:items-center md:justify-between">
              <div className="inline-flex items-center gap-2">
                <span className="brand-mark flex h-7 w-7 items-center justify-center rounded-full">
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="brand-logo-image"
                    height={28}
                    src={brandLogo}
                    width={28}
                  />
                </span>
                Curated AI discovery for practical teams.
              </div>
              <div className="flex gap-4">
                <Link className="hover:text-accent" href="/tools">
                  Directory
                </Link>
                <Link className="hover:text-accent" href="/submit">
                  Submit tool
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
