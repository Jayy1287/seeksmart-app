"use client";

import posthog from "posthog-js";

type PostHogProperties = Record<string, unknown>;

export function capturePostHogEvent(
  event: string,
  properties?: PostHogProperties
) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return;
  }

  posthog.capture(event, properties);
}
