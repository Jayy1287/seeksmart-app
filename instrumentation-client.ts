import posthog from "posthog-js";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const DEFAULT_POSTHOG_PROXY_PATH = "/ingest";

function normalizePostHogHost(host: string | undefined) {
  const trimmedHost = host?.trim();

  if (!trimmedHost) {
    return DEFAULT_POSTHOG_PROXY_PATH;
  }

  if (/^https:\/\/(app|us|eu)(\.i)?\.posthog\.com$/i.test(trimmedHost)) {
    return DEFAULT_POSTHOG_PROXY_PATH;
  }

  return trimmedHost.replace(/\/$/, "");
}

function initPostHog(key: string) {
  const apiHost = normalizePostHogHost(process.env.NEXT_PUBLIC_POSTHOG_HOST);

  posthog.init(key, {
    api_host: apiHost,
    ui_host:
      apiHost === DEFAULT_POSTHOG_PROXY_PATH
        ? DEFAULT_POSTHOG_PROXY_PATH
        : process.env.NEXT_PUBLIC_POSTHOG_UI_HOST ?? "https://eu.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true,
    capture_pageview: false,
    capture_pageleave: false,
    autocapture: false,
    disable_session_recording: true,
    debug: process.env.NODE_ENV === "development"
  });
}

// Analytics never needs to compete with first paint. Initialise once the
// browser is idle; events captured before that are queued by posthog-js.
if (posthogKey) {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => initPostHog(posthogKey), { timeout: 3000 });
  } else {
    window.setTimeout(() => initPostHog(posthogKey), 1500);
  }
}
