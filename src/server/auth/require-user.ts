import type { Route } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Login URL that returns the visitor to `returnTo` after signing in. */
export function loginUrl(returnTo: string) {
  return `/login?callbackUrl=${encodeURIComponent(returnTo)}` as Route;
}

/**
 * Server-side gate for pages that need an account (running the audit).
 * Browsing tools, use cases and guides stays public.
 */
export async function requireUser(returnTo: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(loginUrl(returnTo));
  }

  return session.user;
}
