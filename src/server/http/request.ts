import { siteConfig } from "@/lib/site";
import type { ApiErrorCode } from "@/shared/api";

type ReadJsonOptions = {
  maxBytes?: number;
};

export class ApiRequestError extends Error {
  code: ApiErrorCode;
  status: number;
  details?: unknown;

  constructor({
    code,
    details,
    message,
    status
  }: {
    code: ApiErrorCode;
    details?: unknown;
    message: string;
    status: number;
  }) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

export async function readJsonBody(
  request: Request,
  { maxBytes = 64 * 1024 }: ReadJsonOptions = {}
) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

  if (!contentType.includes("application/json")) {
    throw new ApiRequestError({
      code: "UNSUPPORTED_MEDIA_TYPE",
      message: "Request body must be JSON.",
      status: 415
    });
  }

  const contentLength = request.headers.get("content-length");

  if (contentLength && Number(contentLength) > maxBytes) {
    throw new ApiRequestError({
      code: "PAYLOAD_TOO_LARGE",
      message: "Request body is too large.",
      status: 413
    });
  }

  const body = await request.text();

  if (Buffer.byteLength(body, "utf8") > maxBytes) {
    throw new ApiRequestError({
      code: "PAYLOAD_TOO_LARGE",
      message: "Request body is too large.",
      status: 413
    });
  }

  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new ApiRequestError({
      code: "BAD_REQUEST",
      message: "Request body must be valid JSON.",
      status: 400
    });
  }
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return;
  }

  if (!getAllowedOrigins(request).has(origin)) {
    throw new ApiRequestError({
      code: "FORBIDDEN",
      message: "Request origin is not allowed.",
      status: 403
    });
  }
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}

function getAllowedOrigins(request: Request) {
  const origins = new Set<string>();
  addOrigin(origins, siteConfig.url);
  addOrigin(origins, process.env.AUTH_URL);
  addRequestOrigin(origins, request);
  return origins;
}

function addRequestOrigin(origins: Set<string>, request: Request) {
  const host = firstHeaderValue(
    request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  );

  if (!host) {
    return;
  }

  const protocol =
    firstHeaderValue(request.headers.get("x-forwarded-proto")) ??
    (process.env.NODE_ENV === "production" ? "https" : "http");

  addOrigin(origins, `${protocol}://${host}`);
}

function addOrigin(origins: Set<string>, value?: string) {
  if (!value) {
    return;
  }

  try {
    origins.add(new URL(value).origin);
  } catch {
    // Ignore invalid deployment metadata rather than breaking request handling.
  }
}

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}
