/**
 * A simple in-memory rate limiter for Next.js API routes.
 * In a real production environment with multiple server instances, 
 * you should use a centralized store like Redis (e.g., Upstash).
 */

const LRU = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now();
  const userData = LRU.get(ip) || { count: 0, lastReset: now };

  if (now - userData.lastReset > windowMs) {
    userData.count = 1;
    userData.lastReset = now;
  } else {
    userData.count++;
  }

  LRU.set(ip, userData);

  return {
    success: userData.count <= limit,
    remaining: Math.max(0, limit - userData.count),
    limit,
  };
}
