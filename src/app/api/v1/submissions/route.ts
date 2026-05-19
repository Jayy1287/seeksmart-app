import type { NextRequest } from "next/server";
import { ZodError } from "zod";
import {
  apiError,
  apiInternalError,
  apiOk,
  apiRequestError
} from "@/server/http/responses";
import {
  assertSameOrigin,
  isApiRequestError,
  readJsonBody
} from "@/server/http/request";
import {
  assertRateLimit,
  getClientIp,
  RateLimitError
} from "@/server/http/rate-limit";
import {
  createToolSubmission,
  DuplicateSubmissionError
} from "@/server/submissions/mutations";
import { withPostHogClient } from "@/lib/posthog-server";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    assertRateLimit({
      key: `submission:${getClientIp(request)}`,
      limit: 5,
      windowMs: 60 * 60 * 1000
    });

    const body = await readJsonBody(request);
    const submission = await createToolSubmission(body);

    await withPostHogClient((posthog) => {
      const rawBody = body as Record<string, unknown>;

      posthog.capture({
        distinctId: `submission:${submission.id}`,
        event: "tool_submission_created",
        properties: {
          submission_id: submission.id,
          tool_name: typeof rawBody.toolName === "string" ? rawBody.toolName : "",
          category: typeof rawBody.category === "string" ? rawBody.category : "",
          pricing_type:
            typeof rawBody.pricingType === "string" ? rawBody.pricingType : ""
        }
      });
    });

    return apiOk({ submission }, { status: 201 });
  } catch (error) {
    if (isApiRequestError(error)) {
      return apiRequestError(error);
    }

    if (error instanceof ZodError) {
      return apiError(
        "BAD_REQUEST",
        "Submission input is invalid.",
        400,
        error.flatten()
      );
    }

    if (error instanceof DuplicateSubmissionError) {
      return apiError("CONFLICT", error.message, 409);
    }

    if (error instanceof RateLimitError) {
      return apiError("RATE_LIMITED", error.message, 429, {
        retryAfterSeconds: error.retryAfterSeconds
      });
    }

    console.error(error);
    return apiInternalError();
  }
}
