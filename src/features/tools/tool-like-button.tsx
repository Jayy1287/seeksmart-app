"use client";

import { useRef, useState } from "react";
import type { FormEvent, RefObject } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import clsx from "clsx";
import { animate } from "motion/react";
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
  /** `icon` is the compact, unobtrusive version used inside list rows. */
  variant?: "card" | "detail" | "dashboard" | "fit" | "icon";
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
  const iconRef = useRef<HTMLSpanElement>(null);
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
    if (!previousState.isLiked && iconRef.current) {
      animate(iconRef.current, { scale: [1, 1.35, 1] }, { duration: 0.45, ease: [0.22, 1, 0.36, 1] });
    }

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
      className={clsx(
        "relative inline-flex min-w-0",
        variant === "fit" && "w-full",
        className
      )}
      onSubmit={handleSubmit}
    >
      <input name="toolId" type="hidden" value={toolId} />
      <input name="toolSlug" type="hidden" value={toolSlug} />
      <input name="redirectTo" type="hidden" value={redirectTo} />
      <LikeSubmitButton
        iconRef={iconRef}
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

const variantClasses: Record<NonNullable<ToolLikeButtonProps["variant"]>, string> = {
  card: "min-h-9 px-3.5 text-[0.82rem]",
  dashboard: "min-h-10 px-4 text-[0.86rem]",
  detail: "min-h-[3.4rem] px-5 text-[0.98rem]",
  fit: "min-h-11 w-full px-4 text-[0.9rem]",
  icon: "min-h-10 min-w-10 px-2.5 text-[0.8rem]"
};

function LikeSubmitButton({
  iconRef,
  isSignedIn,
  isSaving,
  state,
  toolName,
  variant
}: {
  iconRef: RefObject<HTMLSpanElement | null>;
  isSignedIn: boolean;
  isSaving: boolean;
  state: ToolLikeState;
  toolName: string;
  variant: NonNullable<ToolLikeButtonProps["variant"]>;
}) {
  const label = isSaving ? "Saving" : state.isLiked ? "Liked" : "Like";
  const countLabel =
    typeof state.count === "number" && state.count > 0
      ? formatLikeCount(state.count)
      : null;
  const ariaLabel = state.isLiked
    ? `Unlike ${toolName}`
    : isSignedIn
      ? `Like ${toolName}`
      : `Sign in to like ${toolName}`;
  const isIcon = variant === "icon";

  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={state.isLiked}
      className={clsx(
        "group/like inline-flex items-center justify-center gap-1.5 rounded-full border font-medium leading-none whitespace-nowrap transition-[color,background-color,border-color,transform] duration-200 ease-out active:scale-95 disabled:cursor-wait",
        variantClasses[variant],
        state.isLiked
          ? "border-signal/30 bg-signal/10 text-accent"
          : isIcon
            ? "border-transparent bg-transparent text-ink/40 hover:border-ink/10 hover:bg-surface hover:text-accent"
            : "border-ink/[0.14] bg-surface/60 text-ink/70 hover:border-ink/40 hover:bg-surface hover:text-ink"
      )}
      data-liked={state.isLiked}
      data-variant={variant}
      disabled={isSaving}
      title={isSignedIn ? ariaLabel : "Sign in to like this tool"}
      type="submit"
    >
      <span aria-hidden="true" className="inline-flex" ref={iconRef}>
        {isSaving ? (
          <Loader2 className="animate-spin" size={variant === "detail" ? 17 : 15} />
        ) : (
          <Heart
            className={clsx(
              "transition-colors",
              !state.isLiked && "group-hover/like:text-signal"
            )}
            fill={state.isLiked ? "currentColor" : "none"}
            size={variant === "detail" ? 17 : 15}
            strokeWidth={2}
          />
        )}
      </span>
      {isIcon ? null : <span>{label}</span>}
      {countLabel ? (
        <span
          className={clsx(
            "font-mono text-[0.92em] tabular",
            isIcon ? "" : "border-l border-current pl-1.5 opacity-60"
          )}
        >
          {countLabel}
        </span>
      ) : null}
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
