"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, LogOut } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { signOut, useSession } from "next-auth/react";
import { CommandPalette } from "@/components/command-palette";
import { navigationLinks } from "@/components/site-navigation";

const ease = [0.22, 1, 0.36, 1] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const isSignedIn = Boolean(session?.user);
  const isAdmin = session?.user?.role === "ADMIN";
  const firstName = session?.user?.name?.split(" ")[0] ?? "Dashboard";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className="site-header"
      data-menu={menuOpen ? "true" : undefined}
      data-scrolled={scrolled ? "true" : undefined}
    >
      <div className="app-container">
        <div className="site-header-bar">
          <Link aria-label="SeekSmart home" className="flex items-center gap-2.5" href="/">
            <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-ink">
              <Image
                alt=""
                className="h-8 w-8 object-cover"
                height={32}
                priority
                src="/brand/seeksmart-logo-v3.png"
                width={32}
              />
            </span>
            <span className="brand-wordmark">SeekSmart</span>
          </Link>

          <nav
            aria-label="Main"
            className="ml-6 hidden items-center lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {navigationLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className="nav-link isolate"
                  data-active={active ? "true" : undefined}
                  href={link.href}
                  key={link.href}
                  onMouseEnter={() => setHovered(link.href)}
                >
                  {hovered === link.href && !reduce ? (
                    <motion.span
                      className="nav-hover"
                      layoutId="nav-hover"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-signal"
                    />
                  ) : null}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <CommandPalette trigger="header" />
            {isSignedIn ? (
              <div className="hidden items-center gap-1 lg:flex">
                {isAdmin ? (
                  <Link className="nav-link" href="/admin">
                    Admin
                  </Link>
                ) : null}
                <Link className="nav-link" href="/dashboard">
                  {firstName}
                </Link>
                <button
                  aria-label="Sign out"
                  className="nav-link"
                  onClick={() => void signOut({ redirectTo: "/" })}
                  type="button"
                >
                  <LogOut aria-hidden="true" size={15} />
                </button>
              </div>
            ) : (
              <Link className="nav-link hidden lg:inline-flex" href="/login">
                Sign in
              </Link>
            )}
            <Link className="btn btn-primary btn-sm hidden sm:inline-flex" href="/audit/questions">
              Start audit
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
            <button
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="relative flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              <span className="sr-only">Menu</span>
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                className="absolute h-[1.5px] w-5 rounded-full bg-ink"
                transition={{ duration: 0.35, ease }}
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                className="absolute h-[1.5px] w-5 rounded-full bg-ink"
                transition={{ duration: 0.35, ease }}
              />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            className="fixed inset-x-0 bottom-0 top-0 -z-10 flex flex-col bg-paper px-4 pb-8 pt-24 lg:hidden"
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease }}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {navigationLinks.map((link, index) => (
                <div className="overflow-hidden border-b border-ink/10" key={link.href}>
                  <motion.div
                    animate={{ y: "0%" }}
                    initial={reduce ? false : { y: "100%" }}
                    transition={{ delay: 0.15 + index * 0.05, duration: 0.6, ease }}
                  >
                    <Link
                      className="flex items-center justify-between py-4 font-display text-[2.1rem] font-bold leading-none tracking-[-0.04em]"
                      href={link.href}
                    >
                      {link.label}
                      <ArrowUpRight aria-hidden="true" className="text-ink/30" size={22} />
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-auto grid gap-2"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              transition={{ delay: 0.45, duration: 0.5, ease }}
            >
              <Link className="btn btn-primary btn-lg w-full" href="/audit/questions">
                Start the free audit
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
              {isSignedIn ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link className="btn btn-ghost" href="/dashboard">
                    {firstName}
                  </Link>
                  <button
                    className="btn btn-ghost"
                    onClick={() => void signOut({ redirectTo: "/" })}
                    type="button"
                  >
                    Sign out
                  </button>
                  {isAdmin ? (
                    <Link className="btn btn-ghost col-span-2" href="/admin">
                      Admin
                    </Link>
                  ) : null}
                </div>
              ) : (
                <Link className="btn btn-ghost w-full" href="/login">
                  Sign in
                </Link>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
