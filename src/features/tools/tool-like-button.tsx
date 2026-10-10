"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import clsx from "clsx";
import { capturePostHogEvent } from "@/features/analytics/posthog-client";
import { useToolLike } from "@/features/tools/tool-like-context";
import {
  toggleToolLikeAction,
  toggleToolLikeStateAction
} from "@/server/tools/like-actions";
import type { ToolLikeState } from "@/shared/domain";

type ToolLikeButtonProps = {
  className?: string;
  /** Known state from a server-rendered, per-user page (the dashboard). */
  initialState?: ToolLikeState;
  toolId: string;
  toolName: string;
  toolSlug: string;
  variant?: "card" | "detail" | "dashboard" | "fit";
};

export function ToolLikeButton({
  className,
  initialState,
  toolId,
  toolName,
  toolSlug,
  variant = "card"
}: ToolLikeButtonProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, setState, state } = useToolLike(toolId, initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Read the query string at submit time instead of via useSearchParams so
  // this button does not force the page out of static rendering.
  const redirectTo =
    typeof window === "undefined"
      ? pathname
      : `${window.location.pathname}${window.location.search}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSignedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(redirectTo)}`);
      return;
    }

    if (isSaving) {
      return;
    }

    const previousState = state;
    setError(null);
    setState(getOptimisticLikeState(state));
    setIsSaving(true);

    try {
      const nextState = await toggleToolLikeStateAction({
        redirectTo,
        toolId,
        toolSlug
      });
      setState(nextState);
      capturePostHogEvent(previousState.isLiked ? "tool_unliked" : "tool_liked", {
        tool_id: toolId,
        tool_slug: toolSlug,
        tool_name: toolName
      });
    } catch {
      setState(previousState);
      setError("Could not save like. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      action={toggleToolLikeAction}
      className={clsx("tool-like-form", className)}
      onSubmit={handleSubmit}
    >
      <input name="toolId" type="hidden" value={toolId} />
      <input name="toolSlug" type="hidden" value={toolSlug} />
      <input name="redirectTo" type="hidden" value={redirectTo} />
      <LikeSubmitButton
        isSignedIn={isSignedIn}
        isSaving={isSaving}
        state={state}
        toolName={toolName}
        variant={variant}
      />
      {error ? <span className="sr-only" role="status">{error}</span> : null}
    </form>
  );
}

function LikeSubmitButton({
  isSignedIn,
  isSaving,
  state,
  toolName,
  variant
}: {
  isSignedIn: boolean;
  isSaving: boolean;
  state: ToolLikeState;
  toolName: string;
  variant: NonNullable<ToolLikeButtonProps["variant"]>;
}) {
  const label = isSaving ? "Saving" : state.isLiked ? "Liked" : "Like";
  const countLabel =
    typeof state.count === "number" ? formatLikeCount(state.count) : null;
  const ariaLabel = state.isLiked
    ? `Unlike ${toolName}`
    : isSignedIn
      ? `Like ${toolName}`
      : `Sign in to like ${toolName}`;

  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={state.isLiked}
      className="tool-like-button"
      data-liked={state.isLiked}
      data-variant={variant}
      disabled={isSaving}
      title={isSignedIn ? ariaLabel : "Sign in to like this tool"}
      type="submit"
    >
      <span className="tool-like-icon" aria-hidden="true">
        {isSaving ? (
          <Loader2 className="animate-spin" size={15} />
        ) : (
          <Heart
            fill={state.isLiked ? "currentColor" : "none"}
            size={15}
            strokeWidth={2.2}
          />
        )}
      </span>
      <span className="tool-like-label">{label}</span>
      {countLabel ? <span className="tool-like-count">{countLabel}</span> : null}
    </button>
  );
}

function getOptimisticLikeState(state: ToolLikeState): ToolLikeState {
  const count =
    typeof state.count === "number"
      ? Math.max(0, state.count + (state.isLiked ? -1 : 1))
      : null;

  return {
    count,
    isLiked: !state.isLiked
  };
}

function formatLikeCount(count: number) {
  return new Intl.NumberFormat("en", {
    compactDisplay: "short",
    notation: "compact"
  }).format(count);
}
