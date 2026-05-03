import type { Metadata } from "next";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { SiteAnalytics } from "@/features/analytics/site-analytics";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const brandLogo = "/brand/seeksmart-logo.png";
const navigationLinks: Array<{ href: Route; label: string }> = [
  { href: "/tools", label: "Tools" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/industries", label: "Industries" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/audit", label: "AI audit" },
  { href: "/resources", label: "Resources" }
];

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "SeekSmart - AI decisions for practical teams",
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
    title: "SeekSmart - AI decisions for practical teams",
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
    title: "SeekSmart - AI decisions for practical teams",
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
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <SiteAnalytics />
        </Suspense>
        <div className="min-h-screen">
          <header className="site-header sticky top-0 z-50 border-b border-line bg-paper/92 shadow-sm shadow-ink/5 backdrop-blur-xl">
            <div className="app-container grid grid-cols-[1fr_auto] items-center gap-3 py-4 md:grid-cols-[auto_1fr_auto] lg:py-5">
              <Link className="brand-lockup flex items-center gap-3.5" href="/">
                <span className="brand-mark flex h-12 w-12 items-center justify-center rounded-full lg:h-14 lg:w-14">
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="brand-logo-image"
                    height={56}
                    priority
                    src={brandLogo}
                    width={56}
                  />
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="brand-word block">SeekSmart</span>
                  <span className="brand-tagline block">
                    AI decision intelligence
                  </span>
                </span>
              </Link>
              <nav className="header-nav order-3 col-span-2 flex flex-wrap items-center justify-center gap-1 rounded-2xl border border-line bg-surface/82 p-1.5 text-sm font-semibold shadow-sm md:order-none md:col-span-1 md:ml-auto md:justify-start md:gap-1.5 lg:rounded-full">
                {navigationLinks.map((link) => (
                  <Link
                    className="header-nav-link"
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <ThemeToggle />
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
                AI decision intelligence for practical teams.
              </div>
              <div className="flex flex-wrap gap-4">
                <Link className="hover:text-accent" href="/tools">
                  Tools
                </Link>
                <Link className="hover:text-accent" href="/methodology">
                  Methodology
                </Link>
                <Link className="hover:text-accent" href="/submit">
                  Submit tool
                </Link>
                <Link className="hover:text-accent" href="/feedback">
                  Feedback
                </Link>
                <Link className="hover:text-accent" href="/privacy">
                  Privacy
                </Link>
                <Link className="hover:text-accent" href="/terms">
                  Terms
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
