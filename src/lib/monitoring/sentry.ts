/**
 * Sentry integration stub for WPOS.
 *
 * To enable:
 * 1. Install: npm install @sentry/react
 * 2. Set VITE_SENTRY_DSN in .env
 * 3. Uncomment the initialization below
 *
 * This module provides a no-op fallback when Sentry is not configured,
 * so calling code doesn't need to check for availability.
 */

export interface SentryConfig {
  dsn: string;
  environment: string;
  release?: string;
  tracesSampleRate?: number;
}

export function initSentry(_config?: SentryConfig): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    console.debug("[Sentry] No DSN configured — error tracking disabled");
    return;
  }

  // Uncomment when @sentry/react is installed:
  // import('@sentry/react').then((Sentry) => {
  //   Sentry.init({
  //     dsn,
  //     environment: config?.environment ?? import.meta.env.MODE,
  //     release: config?.release ?? `wpos@${import.meta.env.VITE_APP_VERSION ?? '1.0.0'}`,
  //     tracesSampleRate: config?.tracesSampleRate ?? 0.1,
  //     integrations: [Sentry.browserTracingIntegration()],
  //   });
  // });
}

/**
 * Capture an exception for error tracking.
 * No-op when Sentry is not initialized.
 */
export function captureException(error: unknown, context?: Record<string, unknown>): void {
  console.error("[Monitoring]", error, context);

  // Uncomment when @sentry/react is installed:
  // import('@sentry/react').then((Sentry) => {
  //   Sentry.captureException(error, { extra: context });
  // });
}

/**
 * Set user context for error tracking.
 */
export function setUser(
  user: {
    id: string;
    email?: string;
    role?: string;
  } | null,
): void {
  if (!user) return;

  // Uncomment when @sentry/react is installed:
  // import('@sentry/react').then((Sentry) => {
  //   Sentry.setUser(user);
  // });
}
