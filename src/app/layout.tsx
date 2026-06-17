import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { Suspense, type ReactNode } from "react";
import { auth, signOut } from "@/auth";
import { CommandPalette } from "@/components/command-palette";
import { PageTransition } from "@/components/page-transition";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SiteAccountNav } from "@/components/site-account-nav";
import { SiteMobileMenu } from "@/components/site-mobile-menu";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteAnalytics } from "@/features/analytics/site-analytics";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const brandLogo = "/brand/seeksmart-logo-v3.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "SeekSmart - Find the right AI workflow first",
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
    title: "SeekSmart - Find the right AI workflow first",
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
    title: "SeekSmart - Find the right AI workflow first",
    description: siteConfig.description,
    images: [brandLogo]
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();
  const isSignedIn = Boolean(session?.user);
  const isAdmin = session?.user.role === UserRole.ADMIN;
  const userLabel = session?.user.name?.split(" ")[0] ?? "Dashboard";
  const submitHref = isSignedIn ? "/submit" : "/login?callbackUrl=/submit";

  async function signOutAction() {
    "use server";

    await signOut({
      redirectTo: "/"
    });
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <SiteAnalytics />
        </Suspense>
        <MotionProvider>
          <div className="flex min-h-screen flex-col">
            <header className="site-header sticky top-0 z-50">
              <div className="app-container grid grid-cols-[1fr_auto] items-center gap-3 py-3 md:grid-cols-[auto_1fr_auto] lg:py-4">
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
                <SiteMobileMenu
                  isAdmin={isAdmin}
                  isSignedIn={isSignedIn}
                  signOutAction={isSignedIn ? signOutAction : undefined}
                  userLabel={userLabel}
                />
              </div>
            </header>
            <PageTransition>{children}</PageTransition>
            <footer className="site-footer">
              <div className="app-container footer-shell">
                <div className="footer-main">
                  <div className="footer-brand-block">
                    <Link
                      aria-label="SeekSmart home"
                      className="footer-brand-lockup"
                      href="/"
                    >
                      <span className="brand-mark footer-brand-mark flex items-center justify-center">
                        <Image
                          alt="SeekSmart"
                          className="brand-logo-image"
                          height={48}
                          src={brandLogo}
                          width={48}
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="brand-title footer-brand-title block">
                          SeekSmart
                        </span>
                        <span className="footer-brand-tagline block">
                          Find the right AI workflow first.
                        </span>
                      </span>
                    </Link>
                    <p className="footer-brand-copy">
                      Turn an AI idea into a clear next step, a stronger
                      shortlist, and a more confident pilot plan.
                    </p>
                    <CommandPalette
                      isAdmin={isAdmin}
                      isSignedIn={isSignedIn}
                      trigger="footer"
                    />
                  </div>
                  <nav aria-label="Footer" className="footer-nav">
                    <div className="footer-nav-group">
                      <span className="footer-nav-heading">Explore</span>
                      <Link className="footer-link" href="/tools">
                        Tools
                      </Link>
                      <Link className="footer-link" href="/use-cases">
                        Use cases
                      </Link>
                      <Link className="footer-link" href="/industries">
                        Industries
                      </Link>
                      <Link className="footer-link" href="/playbooks">
                        Playbooks
                      </Link>
                    </div>
                    <div className="footer-nav-group">
                      <span className="footer-nav-heading">Decide</span>
                      <Link className="footer-link" href="/audit/start">
                        AI audit
                      </Link>
                      <Link className="footer-link" href="/opportunities">
                        Opportunities
                      </Link>
                      <Link className="footer-link" href="/methodology">
                        Methodology
                      </Link>
                      <Link className="footer-link" href="/resources">
                        Resources
                      </Link>
                      <Link className="footer-link" href="/articles">
                        Articles
                      </Link>
                    </div>
                    <div className="footer-nav-group">
                      <span className="footer-nav-heading">Company</span>
                      <Link className="footer-link" href={submitHref}>
                        Submit tool
                      </Link>
                      <Link className="footer-link" href="/feedback">
                        Feedback
                      </Link>
                      <Link className="footer-link" href="/privacy">
                        Privacy
                      </Link>
                      <Link className="footer-link" href="/terms">
                        Terms
                      </Link>
                    </div>
                  </nav>
                </div>
                <div className="footer-bottom">
                  <span>&copy; 2026 SeekSmart. All rights reserved.</span>
                  <span>Clear decisions before new software.</span>
                </div>
              </div>
            </footer>
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
