import { PostHog } from "posthog-node";

export function getPostHogClient() {
  const posthogKey =
    process.env.POSTHOG_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (!posthogKey) {
    return null;
  }

  return new PostHog(posthogKey, {
    host:
      process.env.POSTHOG_HOST ??
      process.env.NEXT_PUBLIC_POSTHOG_HOST ??
      "https://eu.i.posthog.com",
    flushAt: 1,
    flushInterval: 0
  });
}

export async function withPostHogClient(
  callback: (posthog: PostHog) => Promise<void> | void
) {
  const posthog = getPostHogClient();

  if (!posthog) {
    return;
  }

  try {
    await callback(posthog);
  } catch (error) {
    console.warn("PostHog analytics capture failed.", error);
  } finally {
    try {
      await posthog.shutdown();
    } catch (error) {
      console.warn("PostHog analytics shutdown failed.", error);
    }
  }
}
