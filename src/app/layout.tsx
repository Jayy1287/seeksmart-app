import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { PageTransition } from "@/components/page-transition";
import { SiteAccountNav } from "@/components/site-account-nav";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteAnalytics } from "@/features/analytics/site-analytics";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const brandLogo = "/brand/seeksmart-logo-v3.png";

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
        alt: "SeekSmart logo mark"
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
      <head />
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <SiteAnalytics />
        </Suspense>
        <div className="min-h-screen">
          <header className="site-header sticky top-0 z-50">
            <div className="app-container grid grid-cols-1 items-center gap-3 py-3 md:grid-cols-[auto_1fr_auto] lg:py-4">
              <Link
                aria-label="SeekSmart home"
                className="brand-lockup flex items-center gap-3"
                href="/"
              >
                <span className="brand-mark flex h-12 w-12 items-center justify-center md:h-[3.25rem] md:w-[3.25rem]">
                  <Image
                    alt="SeekSmart"
                    className="brand-logo-image"
                    height={64}
                    priority
                    src={brandLogo}
                    width={64}
                  />
                </span>
                <span className="brand-type min-w-0 leading-none">
                  <span className="brand-title block">SeekSmart</span>
                  <span className="brand-tagline block">Smarter AI Choices</span>
                </span>
              </Link>
              <SiteNavigation />
              <SiteAccountNav />
            </div>
          </header>
          <PageTransition>{children}</PageTransition>
          <footer className="border-t border-line/50 bg-white/30 backdrop-blur">
            <div className="app-container flex flex-col gap-3 py-8 text-sm text-ink/55 md:flex-row md:items-center md:justify-between">
              <div className="inline-flex items-center gap-2">
                <span className="brand-mark flex h-7 w-7 items-center justify-center rounded-full">
                  <Image
                    alt="SeekSmart"
                    className="brand-logo-image"
                    height={28}
                    src={brandLogo}
                    width={28}
                  />
                </span>
                Smarter AI Choices for practical teams.
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
