import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import { PageTransition } from "@/components/page-transition";
import { RouteProgress } from "@/components/route-progress";
import { MotionProvider } from "@/components/motion/motion-provider";
import { AppSessionProvider } from "@/components/session-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteAnalytics } from "@/features/analytics/site-analytics";
import { ToolLikeProvider } from "@/features/tools/tool-like-context";
import { siteConfig } from "@/lib/site";
import {
  JsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/structured-data";
import "../styles/legacy.css";
import "./globals.css";

const brandLogo = "/brand/seeksmart-logo-v3.png";

const fontSans = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontDisplay = Bricolage_Grotesque({
  axes: ["opsz"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display",
});

const fontMono = Geist_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#f4f2ed",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "SeekSmart - Find the right AI workflow first",
    template: "%s | SeekSmart",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: brandLogo,
    apple: brandLogo,
  },
  openGraph: {
    siteName: siteConfig.name,
    title: "SeekSmart - Find the right AI workflow first",
    description: siteConfig.description,
    url: "/",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </head>
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <SiteAnalytics />
        </Suspense>
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        <AppSessionProvider>
          <ToolLikeProvider>
            <MotionProvider>
              <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <PageTransition>{children}</PageTransition>
                <SiteFooter />
              </div>
            </MotionProvider>
          </ToolLikeProvider>
        </AppSessionProvider>
      </body>
    </html>
  );
}
