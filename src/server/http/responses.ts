import { NextResponse } from "next/server";
import type { ApiErrorCode, ApiFailure, ApiSuccess } from "@/shared/api";

export function apiOk<T>(data: T, init?: ResponseInit) {
  const body: ApiSuccess<T> = {
    ok: true,
    data
  };

  return NextResponse.json(body, init);
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: unknown
) {
  const body: ApiFailure = {
    ok: false,
    error: {
      code,
      message,
      details
    }
  };

  return NextResponse.json(body, { status });
}

export function apiInternalError() {
  return apiError(
    "INTERNAL_SERVER_ERROR",
    "Something went wrong. Please try again.",
    500
  );
}

