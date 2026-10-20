"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { useSession } from "next-auth/react";
import type { ToolLikeState } from "@/shared/domain";

// Like state used to be resolved on the server for every page that showed a
// tool, which forced those pages to render per request. Now pages are cached
// and this provider fetches the viewer's likes once per page, in one batched
// request, only when someone is signed in.

type LikeMap = Record<string, ToolLikeState>;

type ToolLikeContextValue = {
  getState: (toolId: string) => ToolLikeState | undefined;
  isSignedIn: boolean;
  register: (toolId: string) => void;
  setState: (toolId: string, state: ToolLikeState) => void;
};

const ToolLikeContext = createContext<ToolLikeContextValue | null>(null);

const emptyState: ToolLikeState = { count: null, isLiked: false };

export function ToolLikeProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isSignedIn = Boolean(session?.user);
  const [states, setStates] = useState<LikeMap>({});
  const pendingIds = useRef(new Set<string>());
  const fetchedIds = useRef(new Set<string>());
  const flushTimer = useRef<number | null>(null);

  const flush = useCallback(() => {
    flushTimer.current = null;
    const ids = [...pendingIds.current].filter((id) => !fetchedIds.current.has(id));
    pendingIds.current.clear();

    if (ids.length === 0) {
      return;
    }

    for (const id of ids) {
      fetchedIds.current.add(id);
    }

    void fetch(`/api/v1/tools/likes?ids=${encodeURIComponent(ids.join(","))}`, {
      credentials: "same-origin"
    })
      .then(async (response) => {
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as {
          ok: boolean;
          data?: { states: LikeMap };
        };
        if (payload.ok && payload.data) {
          setStates((current) => ({ ...current, ...payload.data?.states }));
        }
      })
      .catch(() => {
        for (const id of ids) {
          fetchedIds.current.delete(id);
        }
      });
  }, []);

  const register = useCallback(
    (toolId: string) => {
      if (!isSignedIn || fetchedIds.current.has(toolId)) {
        return;
      }
      pendingIds.current.add(toolId);
      if (flushTimer.current === null) {
        flushTimer.current = window.setTimeout(flush, 40);
      }
    },
    [flush, isSignedIn]
  );

  // When the viewer signs out, forget their like states.
  useEffect(() => {
    if (status === "unauthenticated") {
      fetchedIds.current.clear();
      setStates({});
    }
  }, [status]);

  const value = useMemo<ToolLikeContextValue>(
    () => ({
      getState: (toolId) => states[toolId],
      isSignedIn,
      register,
      setState: (toolId, state) =>
        setStates((current) => ({ ...current, [toolId]: state }))
    }),
    [isSignedIn, register, states]
  );

  return (
    <ToolLikeContext.Provider value={value}>{children}</ToolLikeContext.Provider>
  );
}

export function useToolLike(toolId: string, initialState?: ToolLikeState) {
  const context = useContext(ToolLikeContext);

  useEffect(() => {
    if (!initialState) {
      context?.register(toolId);
    }
  }, [context, initialState, toolId]);

  const state = context?.getState(toolId) ?? initialState ?? emptyState;

  return {
    isSignedIn: context?.isSignedIn ?? false,
    setState: (next: ToolLikeState) => context?.setState(toolId, next),
    state
  };
}
