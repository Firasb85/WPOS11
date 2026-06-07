/**
 * OpenTelemetry tracing stub for WPOS.
 *
 * To enable:
 * 1. Install: npm install @opentelemetry/api @opentelemetry/sdk-trace-web
 * 2. Set VITE_OTEL_ENDPOINT in .env
 * 3. Uncomment the initialization below
 *
 * Provides no-op trace/span helpers when OTel is not configured.
 */

export interface TraceContext {
  traceId: string;
  spanId: string;
}

let traceCounter = 0;

function generateId(): string {
  traceCounter += 1;
  return `${Date.now().toString(36)}-${traceCounter.toString(36)}`;
}

/**
 * Create a simple trace context for request correlation.
 */
export function createTrace(): TraceContext {
  return {
    traceId: generateId(),
    spanId: generateId(),
  };
}

/**
 * Wrap an async operation with timing and error tracking.
 */
export async function withSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    if (import.meta.env.DEV) {
      console.debug(`[Trace] ${name}: ${duration.toFixed(1)}ms`);
    }
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[Trace] ${name} FAILED after ${duration.toFixed(1)}ms`, error);
    throw error;
  }
}

/**
 * Initialize OpenTelemetry.
 * No-op when OTEL_ENDPOINT is not configured.
 */
export function initTracing(): void {
  const endpoint = import.meta.env.VITE_OTEL_ENDPOINT;
  if (!endpoint) {
    console.debug("[Tracing] No endpoint configured — tracing disabled");
    return;
  }

  // Uncomment when OTel packages are installed:
  // import('@opentelemetry/sdk-trace-web').then(({ WebTracerProvider }) => {
  //   const provider = new WebTracerProvider();
  //   provider.register();
  // });
}
