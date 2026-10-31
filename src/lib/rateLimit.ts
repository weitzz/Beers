import { createHash } from "crypto";

import prisma from "@/lib/prisma";

const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
const globalForRateLimit = globalThis as typeof globalThis & {
  rateLimitCleanupAt?: number;
};

export interface RateLimitPolicy {
  /** A label for the bucket, such as "login-ip". */
  name: string;
  /** A value identifying the caller; it is hashed before persistence. */
  subject: string;
  limit: number;
  windowMs: number;
}

export interface RateLimitDecision {
  allowed: boolean;
  retryAfterSeconds: number;
}

const getBucketId = (policy: RateLimitPolicy, now: number) => {
  const windowStart = Math.floor(now / policy.windowMs) * policy.windowMs;
  const digest = createHash("sha256")
    .update(`${policy.name}:${policy.subject}:${windowStart}`)
    .digest("hex");

  return {
    id: digest,
    expiresAt: new Date(windowStart + policy.windowMs),
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((windowStart + policy.windowMs - now) / 1000),
    ),
  };
};

const cleanupExpiredBuckets = async (now: number) => {
  if ((globalForRateLimit.rateLimitCleanupAt ?? 0) > now) return;

  // Set the next time before the query so concurrent requests do not all run cleanup.
  globalForRateLimit.rateLimitCleanupAt = now + CLEANUP_INTERVAL_MS;
  try {
    await prisma.rateLimitBucket.deleteMany({
      where: { expiresAt: { lt: new Date(now) } },
    });
  } catch (error) {
    // Do not silently disable limiting if storage is unavailable.
    globalForRateLimit.rateLimitCleanupAt = 0;
    throw error;
  }
};

const incrementBucket = async (
  id: string,
  expiresAt: Date,
): Promise<number> => {
  try {
    const bucket = await prisma.rateLimitBucket.upsert({
      where: { id },
      create: { id, hits: 1, expiresAt },
      update: { hits: { increment: 1 } },
      select: { hits: true },
    });
    return bucket.hits;
  } catch (error) {
    // MongoDB can race when multiple first requests upsert the same new bucket.
    const details = error && typeof error === "object"
      ? error as { code?: unknown }
      : {};
    if (details.code !== "P2002") throw error;

    const bucket = await prisma.rateLimitBucket.update({
      where: { id },
      data: { hits: { increment: 1 } },
      select: { hits: true },
    });
    return bucket.hits;
  }
};

export async function consumeRateLimits(
  policies: RateLimitPolicy[],
): Promise<RateLimitDecision> {
  const now = Date.now();
  await cleanupExpiredBuckets(now);

  let allowed = true;
  let retryAfterSeconds = 0;

  for (const policy of policies) {
    const bucket = getBucketId(policy, now);
    const hits = await incrementBucket(bucket.id, bucket.expiresAt);
    if (hits > policy.limit) {
      allowed = false;
      retryAfterSeconds = Math.max(retryAfterSeconds, bucket.retryAfterSeconds);
    }
  }

  return { allowed, retryAfterSeconds };
}

export function getClientIp(
  headers: Headers | Record<string, string | undefined>,
): string {
  const getHeader = (name: string) => {
    if (headers instanceof Headers) return headers.get(name) ?? undefined;
    return headers[name] ?? headers[name.toLowerCase()];
  };

  // Prefer headers supplied by the hosting proxy. Configure the proxy to overwrite
  // these values so clients cannot choose their own rate-limit identity.
  const ip =
    getHeader("cf-connecting-ip") ??
    getHeader("x-real-ip") ??
    getHeader("x-forwarded-for")?.split(",")[0]?.trim();

  return ip && ip.length <= 100 ? ip : "unknown";
}
