import type { NextRequest } from "next/server";
import { ZodError } from "zod";
import { apiError, apiInternalError, apiOk } from "@/server/http/responses";
import {
  assertRateLimit,
  getClientIp,
  RateLimitError
} from "@/server/http/rate-limit";
import {
  createToolSubmission,
  DuplicateSubmissionError
} from "@/server/submissions/mutations";

export async function POST(request: NextRequest) {
  try {
    assertRateLimit({
      key: `submission:${getClientIp(request)}`,
      limit: 5,
      windowMs: 60 * 60 * 1000
    });

    const body = await request.json();
    const submission = await createToolSubmission(body);

    return apiOk({ submission }, { status: 201 });
  } catch (error) {
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
