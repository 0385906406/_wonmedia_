/**
 * In-memory rate limiter — hoạt động tốt trên single-instance (dev, VPS, Docker).
 *
 * ⚠️  SERVERLESS WARNING: Trên Vercel/serverless, mỗi invocation là process mới,
 * store Map bị reset → rate limit không có tác dụng thực tế.
 * Để dùng trên serverless, thay thế bằng Upstash Redis:
 *   https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

interface Entry { count: number; resetAt: number }

const store = new Map<string, Entry>()

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= maxRequests) return false

  // Atomic-safe increment (single-threaded Node.js — không có race condition thực sự)
  entry.count++
  return true
}

// Dọn entries hết hạn mỗi 5 phút để tránh memory leak trong long-running process
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [k, v] of store.entries()) {
      if (now > v.resetAt) store.delete(k)
    }
  }, 5 * 60 * 1000)
}
