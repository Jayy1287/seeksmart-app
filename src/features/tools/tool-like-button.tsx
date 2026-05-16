"use client";

import { useMemo } from "react";
import { useFormStatus } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import clsx from "clsx";
import { toggleToolLikeAction } from "@/server/tools/like-actions";
import type { ToolLikeState } from "@/shared/domain";

type ToolLikeButtonProps = {
  className?: string;
  isSignedIn: boolean;
  state: ToolLikeState;
  toolId: string;
  toolName: string;
  toolSlug: string;
  variant?: "card" | "detail" | "dashboard" | "fit";
};

export function ToolLikeButton({
  className,
  isSignedIn,
  state,
  toolId,
  toolName,
  toolSlug,
  variant = "card"
}: ToolLikeButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectTo = useMemo(() => {
    const queryString = searchParams.toString();

    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [pathname, searchParams]);

  return (
    <form
      action={toggleToolLikeAction}
      className={clsx("tool-like-form", className)}
    >
      <input name="toolId" type="hidden" value={toolId} />
      <input name="toolSlug" type="hidden" value={toolSlug} />
      <input name="redirectTo" type="hidden" value={redirectTo} />
      <LikeSubmitButton
        isSignedIn={isSignedIn}
        state={state}
        toolName={toolName}
        variant={variant}
      />
    </form>
  );
}

function LikeSubmitButton({
  isSignedIn,
  state,
  toolName,
  variant
}: {
  isSignedIn: boolean;
  state: ToolLikeState;
  toolName: string;
  variant: NonNullable<ToolLikeButtonProps["variant"]>;
}) {
  const { pending } = useFormStatus();
  const label = pending ? "Saving" : state.isLiked ? "Liked" : "Like";
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
      disabled={pending}
      title={isSignedIn ? ariaLabel : "Sign in to like this tool"}
      type="submit"
    >
      <span className="tool-like-icon" aria-hidden="true">
        {pending ? (
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

function formatLikeCount(count: number) {
  return new Intl.NumberFormat("en", {
    compactDisplay: "short",
    notation: "compact"
  }).format(count);
}
