"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navigationLinks } from "@/components/site-navigation";

type SiteMobileMenuProps = {
  isAdmin: boolean;
  isSignedIn: boolean;
  signOutAction?: () => Promise<void>;
  userLabel?: string;
};

export function SiteMobileMenu({
  isAdmin,
  isSignedIn,
  signOutAction,
  userLabel
}: SiteMobileMenuProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mobile-menu-control md:hidden">
      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="mobile-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {isOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
      </button>
      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              aria-label="Close menu"
              className="mobile-menu-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              type="button"
            />
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mobile-menu-panel"
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav aria-label="Mobile navigation" className="grid gap-2">
                {navigationLinks.map((link) => (
                  <Link
                    className="mobile-menu-link"
                    href={link.href}
                    key={link.href}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 grid gap-2 border-t border-line/50 pt-4">
                <Link
                  className="primary-button min-h-11"
                  href="/audit/start"
                  onClick={() => setIsOpen(false)}
                >
                  Start audit
                </Link>
                {isSignedIn ? (
                  <>
                    <Link
                      className="secondary-button min-h-11"
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                    >
                      {userLabel ?? "Dashboard"}
                    </Link>
                    {isAdmin ? (
                      <Link
                        className="secondary-button min-h-11"
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin
                      </Link>
                    ) : null}
                    {signOutAction ? (
                      <form action={signOutAction}>
                        <button
                          className="secondary-button min-h-11 w-full"
                          type="submit"
                        >
                          Sign out
                        </button>
                      </form>
                    ) : null}
                  </>
                ) : (
                  <Link
                    className="secondary-button min-h-11"
                    href="/login"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
