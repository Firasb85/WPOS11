/**
 * Initialize all monitoring/observability integrations.
 * Call this once at app startup (in __root.tsx).
 *
 * To enable Sentry:
 *   1. npm install @sentry/react
 *   2. Set VITE_SENTRY_DSN in .env
 *
 * To enable OpenTelemetry:
 *   1. npm install @opentelemetry/api @opentelemetry/sdk-trace-web
 *   2. Set VITE_OTEL_ENDPOINT in .env
 */

export function initMonitoring(): void {
  // Sentry
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  if (sentryDsn) {
    console.info("[Monitoring] Sentry DSN detected — initializing...");
    // Dynamic import to avoid bundling when not configured
    import("@/lib/monitoring/sentry")
      .then(({ initSentry }) => {
        initSentry({ dsn: sentryDsn, environment: import.meta.env.MODE });
      })
      .catch(() => {
        console.warn("[Monitoring] @sentry/react not installed. Run: npm install @sentry/react");
      });
  } else {
    console.debug("[Monitoring] No VITE_SENTRY_DSN — Sentry disabled");
  }

  // OpenTelemetry
  const otelEndpoint = import.meta.env.VITE_OTEL_ENDPOINT;
  if (otelEndpoint) {
    console.info("[Monitoring] OTEL endpoint detected — initializing...");
    import("@/lib/monitoring/tracing")
      .then(({ initTracing }) => {
        initTracing();
      })
      .catch(() => {
        console.warn("[Monitoring] @opentelemetry packages not installed.");
      });
  }

  // Global error handler for unhandled rejections
  if (typeof window !== "undefined") {
    window.addEventListener("unhandledrejection", (event) => {
      console.error("[Monitoring] Unhandled rejection:", event.reason);
    });
  }
}
