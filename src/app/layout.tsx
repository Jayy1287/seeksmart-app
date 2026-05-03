import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
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
            <div className="app-container grid grid-cols-1 items-center gap-3 py-4 md:grid-cols-[auto_1fr_auto] lg:py-5">
              <Link
                aria-label="SeekSmart home"
                className="brand-lockup flex items-center"
                href="/"
              >
                <span className="brand-mark flex h-14 w-14 items-center justify-center">
                  <Image
                    alt="SeekSmart"
                    className="brand-logo-image"
                    height={64}
                    priority
                    src={brandLogo}
                    width={64}
                  />
                </span>
              </Link>
              <SiteNavigation />
              <Link className="primary-button hidden min-h-10 px-4 md:inline-flex" href="/audit/start">
                Start audit
              </Link>
            </div>
          </header>
          {children}
          <footer className="border-t border-line bg-paper/80">
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
