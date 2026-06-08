/**
 * Health Check Module.
 * Verifies connectivity to all critical services.
 */
import { supabase } from "@/integrations/supabase/client";

export interface HealthStatus {
  service: string;
  status: "healthy" | "degraded" | "down";
  latencyMs: number;
  message?: string;
  checkedAt: string;
}

async function checkDatabase(): Promise<HealthStatus> {
  const start = performance.now();
  try {
    const { error } = await supabase.from("roles").select("id").limit(1);
    const latency = Math.round(performance.now() - start);
    return {
      service: "Database",
      status: error ? "degraded" : "healthy",
      latencyMs: latency,
      message: error?.message,
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      service: "Database",
      status: "down",
      latencyMs: -1,
      message: String(err),
      checkedAt: new Date().toISOString(),
    };
  }
}

async function checkAuth(): Promise<HealthStatus> {
  const start = performance.now();
  try {
    const { error } = await supabase.auth.getSession();
    const latency = Math.round(performance.now() - start);
    return {
      service: "Auth",
      status: error ? "degraded" : "healthy",
      latencyMs: latency,
      message: error?.message,
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      service: "Auth",
      status: "down",
      latencyMs: -1,
      message: String(err),
      checkedAt: new Date().toISOString(),
    };
  }
}

async function checkStorage(): Promise<HealthStatus> {
  const start = performance.now();
  try {
    const { error } = await supabase.storage.listBuckets();
    const latency = Math.round(performance.now() - start);
    return {
      service: "Storage",
      status: error ? "degraded" : "healthy",
      latencyMs: latency,
      message: error?.message,
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      service: "Storage",
      status: "down",
      latencyMs: -1,
      message: String(err),
      checkedAt: new Date().toISOString(),
    };
  }
}

function checkClient(): HealthStatus {
  return {
    service: "Client App",
    status: "healthy",
    latencyMs: 0,
    message: `Build: ${import.meta.env.MODE}`,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Run all health checks.
 */
export async function runHealthChecks(): Promise<{
  overall: "healthy" | "degraded" | "down";
  services: HealthStatus[];
  checkedAt: string;
}> {
  const [db, auth, storage] = await Promise.all([checkDatabase(), checkAuth(), checkStorage()]);

  const services = [checkClient(), db, auth, storage];
  const hasDown = services.some((s) => s.status === "down");
  const hasDegraded = services.some((s) => s.status === "degraded");

  return {
    overall: hasDown ? "down" : hasDegraded ? "degraded" : "healthy",
    services,
    checkedAt: new Date().toISOString(),
  };
}
