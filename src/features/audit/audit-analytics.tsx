"use client";

import { useEffect } from "react";
import { MotionButton } from "@/components/motion/motion-button";

type AuditAnalyticsEventName =
  | "audit_start_viewed"
  | "audit_questions_viewed"
  | "audit_questions_submitted"
  | "audit_results_viewed";

type AuditAnalyticsPayload = {
  event: AuditAnalyticsEventName;
  version: "audit-rules-v2.3";
  properties?: Record<string, string | number | boolean | string[]>;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function AuditAnalyticsEvent({
  event,
  properties
}: {
  event: AuditAnalyticsEventName;
  properties?: AuditAnalyticsPayload["properties"];
}) {
  useEffect(() => {
    trackAuditEvent(event, properties);
  }, [event, properties]);

  return null;
}

export function AuditSubmitButton() {
  return (
    <MotionButton
      className="primary-button min-h-12"
      onClick={() => trackAuditEvent("audit_questions_submitted")}
      type="submit"
    >
      Generate audit result
    </MotionButton>
  );
}

export function trackAuditEvent(
  event: AuditAnalyticsEventName,
  properties?: AuditAnalyticsPayload["properties"]
) {
  const payload: AuditAnalyticsPayload = {
    event,
    version: "audit-rules-v2.3",
    properties
  };

  window.dispatchEvent(
    new CustomEvent("seeksmart:analytics", {
      detail: payload
    })
  );
  window.dataLayer?.push(payload as unknown as Record<string, unknown>);
}
