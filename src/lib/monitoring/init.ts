/**
 * Initialize all monitoring/observability integrations.
 * Call this once at app startup (in __root.tsx).
 * Safe to call during SSR — no-ops when window is undefined.
 */

export function initMonitoring(): void {
  // Only initialize in browser
  if (typeof window === "undefined") return;

  // Sentry
  try {
    const sentryDsn = import.meta.env?.VITE_SENTRY_DSN;
    if (sentryDsn) {
      console.info("[Monitoring] Sentry DSN detected — initializing...");
      import("@/lib/monitoring/sentry")
        .then(({ initSentry }) => {
          initSentry({
            dsn: sentryDsn,
            environment: import.meta.env?.MODE ?? "production",
          });
        })
        .catch(() => {
          console.warn("[Monitoring] @sentry/react not installed. Run: npm install @sentry/react");
        });
    }
  } catch {
    // import.meta.env not available
  }

  // Global error handler
  window.addEventListener("unhandledrejection", (event) => {
    console.error("[Monitoring] Unhandled rejection:", event.reason);
  });
}
