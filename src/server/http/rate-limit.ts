type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

const buckets = new Map<string, Bucket>();
const maxBuckets = 5000;

export class RateLimitError extends Error {
  retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("Too many requests. Please try again later.");
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return normalizeClientIp(forwardedFor.split(",")[0]);
  }

  return normalizeClientIp(request.headers.get("x-real-ip"));
}

export function assertRateLimit({
  key,
  limit,
  windowMs
}: RateLimitOptions) {
  const now = Date.now();
  pruneExpiredBuckets(now);

  if (buckets.size > maxBuckets) {
    buckets.clear();
  }

  const normalizedKey = key.slice(0, 240);
  const bucket = buckets.get(normalizedKey);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(normalizedKey, {
      count: 1,
      resetAt: now + windowMs
    });
    return;
  }

  if (bucket.count >= limit) {
    throw new RateLimitError(Math.ceil((bucket.resetAt - now) / 1000));
  }

  bucket.count += 1;
}

function pruneExpiredBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

function normalizeClientIp(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length <= 120 ? trimmed : "unknown";
}
