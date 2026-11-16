"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { signOut as nextAuthSignOut } from "next-auth/react";
import type { Session } from "next-auth";

// Lightweight replacement for next-auth's SessionProvider. The stock provider
// calls /api/auth/session on every page load for every visitor, which on
// Netlify is one serverless invocation per view. Here the call happens only
// when a non-httpOnly hint cookie says the browser has signed in before.

export const SESSION_HINT_COOKIE = "ss_auth";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type SessionContextValue = {
  data: Session | null;
  status: SessionStatus;
  refresh: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue>({
  data: null,
  status: "unauthenticated",
  refresh: async () => {}
});

export function hasSessionHint() {
  if (typeof document === "undefined") {
    return false;
  }
  return document.cookie.split(";").some((part) => part.trim().startsWith(`${SESSION_HINT_COOKIE}=1`));
}

export function setSessionHint(value: boolean) {
  if (typeof document === "undefined") {
    return;
  }
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = value
    ? `${SESSION_HINT_COOKIE}=1; Path=/; Max-Age=2592000; SameSite=Lax${secure}`
    : `${SESSION_HINT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export function AppSessionProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Session | null>(null);
  const [status, setStatus] = useState<SessionStatus>("unauthenticated");

  const refresh = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/auth/session", { credentials: "same-origin" });
      const session = response.ok ? ((await response.json()) as Session | null) : null;
      const isSignedIn = Boolean(session && session.user);
      setData(isSignedIn ? session : null);
      setStatus(isSignedIn ? "authenticated" : "unauthenticated");
      setSessionHint(isSignedIn);
    } catch {
      setData(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    if (hasSessionHint()) {
      void refresh();
    }
  }, [refresh]);

  const value = useMemo(() => ({ data, status, refresh }), [data, refresh, status]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}

/** Sign out and forget the hint so later page views skip the session call. */
export async function signOut(options?: { redirectTo?: string }) {
  setSessionHint(false);
  await nextAuthSignOut(options);
}

/** Rendered by pages that already know the viewer is signed in. */
export function SessionHint({ signedIn }: { signedIn: boolean }) {
  const { refresh, status } = useSession();

  useEffect(() => {
    setSessionHint(signedIn);
    if (signedIn && status === "unauthenticated") {
      void refresh();
    }
    // Only on mount: the page itself established the signed-in state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
