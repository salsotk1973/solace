// lib/solace/rate-limit.ts

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function nowMs(): number {
  return Date.now();
}

function cleanupExpiredEntries(currentTime: number): void {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= currentTime) {
      rateLimitStore.delete(key);
    }
  }
}

export function applySlidingWindowRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const currentTime = nowMs();

  cleanupExpiredEntries(currentTime);

  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= currentTime) {
    const resetAt = currentTime + windowMs;

    rateLimitStore.set(key, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      limit,
      remaining: Math.max(0, limit - 1),
      resetAt,
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);

  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}

export function getClientIdentifierFromHeaders(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  const vercelForwardedFor = headers.get("x-vercel-forwarded-for");

  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();
  const firstVercelIp = vercelForwardedFor?.split(",")[0]?.trim();

  const ip =
    firstForwardedIp ||
    firstVercelIp ||
    realIp ||
    "unknown-client";

  return `choose:${ip}`;
}