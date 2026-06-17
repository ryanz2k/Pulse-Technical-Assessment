/**
 * Basic in-memory rate limiter using a sliding window.
 * In a production app with multiple instances, use Redis (e.g. @upstash/ratelimit).
 */

interface RateLimitTracker {
  count: number;
  resetAt: number;
}

const memoryCache = new Map<string, RateLimitTracker>();

export function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const tracker = memoryCache.get(ip);

  if (!tracker) {
    memoryCache.set(ip, { count: 1, resetAt: now + windowMs });
    return true; // Allowed
  }

  // If the window has expired, reset the counter
  if (now > tracker.resetAt) {
    tracker.count = 1;
    tracker.resetAt = now + windowMs;
    return true; // Allowed
  }

  // Within the window
  tracker.count++;
  if (tracker.count > limit) {
    return false; // Rate limited
  }

  return true; // Allowed
}

// Cleanup stale entries every 5 minutes to prevent memory leaks in the Map
setInterval(() => {
  const now = Date.now();
  for (const [key, tracker] of memoryCache.entries()) {
    if (now > tracker.resetAt) {
      memoryCache.delete(key);
    }
  }
}, 5 * 60 * 1000);
