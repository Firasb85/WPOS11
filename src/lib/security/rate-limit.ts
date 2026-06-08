/**
 * Client-Side Rate Limiting.
 * Prevents rapid-fire requests from the browser.
 * Server-side rate limiting should also be applied via Supabase/Cloudflare.
 */

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

const LIMITS: Record<string, RateLimitConfig> = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 per 15 min
  passwordReset: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  signup: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  apiCall: { maxAttempts: 100, windowMs: 60 * 1000 }, // 100 per minute
  export: { maxAttempts: 10, windowMs: 60 * 1000 }, // 10 per minute
};

const attempts: Record<string, { count: number; resetAt: number }> = {};

/**
 * Check if an action is rate-limited.
 * Returns true if the action should be BLOCKED.
 */
export function isRateLimited(action: keyof typeof LIMITS): boolean {
  const config = LIMITS[action];
  if (!config) return false;

  const now = Date.now();
  const state = attempts[action];

  if (!state || now >= state.resetAt) {
    attempts[action] = { count: 1, resetAt: now + config.windowMs };
    return false;
  }

  state.count++;
  return state.count > config.maxAttempts;
}

/**
 * Get remaining attempts for an action.
 */
export function getRemainingAttempts(action: keyof typeof LIMITS): number {
  const config = LIMITS[action];
  if (!config) return Infinity;

  const state = attempts[action];
  if (!state || Date.now() >= state.resetAt) return config.maxAttempts;

  return Math.max(0, config.maxAttempts - state.count);
}

/**
 * Get time until rate limit resets (ms).
 */
export function getResetTime(action: keyof typeof LIMITS): number {
  const state = attempts[action];
  if (!state) return 0;
  return Math.max(0, state.resetAt - Date.now());
}
