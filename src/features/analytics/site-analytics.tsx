"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { capturePostHogEvent } from "./posthog-client";

type AnalyticsPayload = {
  event: string;
  path: string;
  properties?: Record<string, string | number | boolean | string[]>;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function SiteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    trackEvent("page_view", {
      path: query ? `${pathname}?${query}` : pathname
    });
  }, [pathname, searchParams]);

  return null;
}

export function trackEvent(
  event: string,
  properties?: AnalyticsPayload["properties"]
) {
  const path = window.location.pathname;
  const payload: AnalyticsPayload = {
    event,
    path,
    properties
  };

  window.dispatchEvent(
    new CustomEvent("seeksmart:analytics", {
      detail: payload
    })
  );
  window.dataLayer?.push(payload as unknown as Record<string, unknown>);
  capturePostHogEvent(event, { path, ...properties });
}
