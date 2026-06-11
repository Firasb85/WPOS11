/**
 * WPOS Open API — RESTful API definitions for external integrations.
 *
 * Provides documented endpoints for:
 * - Employee data sync
 * - KPI & snapshot management
 * - Diagnostic reports
 * - Webhook subscriptions
 *
 * Authentication: Bearer token (Supabase JWT)
 * Rate Limit: 100 requests/minute per API key
 */

export interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  descriptionAr: string;
  auth: "api_key" | "bearer" | "public";
  rateLimit: number;
  requestBody?: Record<string, string>;
  responseExample: Record<string, unknown>;
  category: string;
}

export const API_VERSION = "v1";
export const API_BASE = "/api/v1";

export const API_ENDPOINTS: APIEndpoint[] = [
  // Employees
  { method: "GET", path: "/employees", description: "List all employees", descriptionAr: "عرض جميع الموظفين", auth: "bearer", rateLimit: 100, responseExample: { data: [{ id: "uuid", first_name: "Ahmad", last_name: "Khalid", email: "a@test.com", employment_status: "active" }], total: 1 }, category: "employees" },
  { method: "GET", path: "/employees/:id", description: "Get employee by ID", descriptionAr: "عرض موظف بالمعرف", auth: "bearer", rateLimit: 100, responseExample: { id: "uuid", first_name: "Ahmad", last_name: "Khalid" }, category: "employees" },
  { method: "POST", path: "/employees", description: "Create employee", descriptionAr: "إنشاء موظف", auth: "bearer", rateLimit: 30, requestBody: { first_name: "string*", last_name: "string*", email: "string", team_id: "uuid" }, responseExample: { id: "uuid", created: true }, category: "employees" },
  { method: "PATCH", path: "/employees/:id", description: "Update employee", descriptionAr: "تحديث موظف", auth: "bearer", rateLimit: 30, requestBody: { first_name: "string", employment_status: "string" }, responseExample: { id: "uuid", updated: true }, category: "employees" },

  // KPIs
  { method: "GET", path: "/kpis", description: "List all KPIs", descriptionAr: "عرض جميع المؤشرات", auth: "bearer", rateLimit: 100, responseExample: { data: [{ id: "uuid", name: "CSAT", target_value: 95, unit: "%" }] }, category: "kpis" },
  { method: "POST", path: "/kpis", description: "Create KPI", descriptionAr: "إنشاء مؤشر", auth: "bearer", rateLimit: 30, requestBody: { name: "string*", code: "string*", target_value: "number", unit: "string" }, responseExample: { id: "uuid", created: true }, category: "kpis" },

  // Performance Snapshots
  { method: "GET", path: "/snapshots", description: "List performance snapshots", descriptionAr: "عرض لقطات الأداء", auth: "bearer", rateLimit: 100, responseExample: { data: [{ id: "uuid", employee_id: "uuid", kpi_id: "uuid", actual_value: 78, target_value: 95, status: "red" }] }, category: "snapshots" },
  { method: "POST", path: "/snapshots", description: "Record a snapshot", descriptionAr: "تسجيل لقطة", auth: "bearer", rateLimit: 30, requestBody: { employee_id: "uuid*", kpi_id: "uuid*", actual_value: "number*", target_value: "number*", period: "string*" }, responseExample: { id: "uuid", status: "red", gap_percentage: -17.9 }, category: "snapshots" },

  // Diagnostics
  { method: "GET", path: "/diagnostics", description: "List diagnostic reports", descriptionAr: "عرض تقارير التشخيص", auth: "bearer", rateLimit: 100, responseExample: { data: [{ id: "uuid", title: "CSAT Investigation", status: "draft", confidence_score: 85 }] }, category: "diagnostics" },
  { method: "POST", path: "/diagnostics", description: "Create diagnostic report", descriptionAr: "إنشاء تقرير تشخيصي", auth: "bearer", rateLimit: 10, requestBody: { title: "string*", employee_id: "uuid*", performance_summary: "string" }, responseExample: { id: "uuid", status: "draft" }, category: "diagnostics" },

  // Evidence
  { method: "GET", path: "/evidence", description: "List evidence items", descriptionAr: "عرض الأدلة", auth: "bearer", rateLimit: 100, responseExample: { data: [{ id: "uuid", evidence_type: "quantitative", reliability: "high" }] }, category: "evidence" },
  { method: "POST", path: "/evidence", description: "Submit evidence", descriptionAr: "تقديم دليل", auth: "bearer", rateLimit: 30, requestBody: { employee_id: "uuid*", evidence_type: "string*", source: "string*", description: "string*", reliability: "high|medium|low" }, responseExample: { id: "uuid", created: true }, category: "evidence" },

  // Cases
  { method: "GET", path: "/cases", description: "List cases", descriptionAr: "عرض الحالات", auth: "bearer", rateLimit: 100, responseExample: { data: [{ id: "uuid", case_number: "CAS-2026-0001", status: "open", priority: "high" }] }, category: "cases" },

  // AI Analysis
  { method: "POST", path: "/ai/analyze", description: "AI performance analysis", descriptionAr: "تحليل ذكي للأداء", auth: "api_key", rateLimit: 10, requestBody: { type: "diagnose|predict|recommend|summarize", employee_id: "uuid", kpi_id: "uuid" }, responseExample: { content: "Analysis result...", confidence: 85, suggestions: ["..."] }, category: "ai" },

  // Webhooks
  { method: "POST", path: "/webhooks", description: "Register webhook", descriptionAr: "تسجيل webhook", auth: "api_key", rateLimit: 5, requestBody: { url: "string*", events: "string[]", secret: "string" }, responseExample: { id: "uuid", url: "https://...", active: true }, category: "webhooks" },
  { method: "GET", path: "/webhooks", description: "List webhooks", descriptionAr: "عرض webhooks", auth: "api_key", rateLimit: 30, responseExample: { data: [{ id: "uuid", url: "https://...", events: ["kpi.breach"], active: true }] }, category: "webhooks" },

  // Health
  { method: "GET", path: "/health", description: "System health check", descriptionAr: "فحص صحة النظام", auth: "public", rateLimit: 60, responseExample: { status: "healthy", services: { database: "up", auth: "up", realtime: "up" }, timestamp: "2026-06-11T00:00:00Z" }, category: "system" },
];

/** Webhook event types */
export const WEBHOOK_EVENTS = [
  "kpi.breach", "kpi.recovery", "snapshot.created",
  "diagnostic.created", "diagnostic.approved", "diagnostic.rejected",
  "case.created", "case.resolved",
  "employee.created", "employee.updated",
  "intervention.started", "intervention.completed",
] as const;

export type WebhookEvent = typeof WEBHOOK_EVENTS[number];

/** Get endpoints by category */
export function getEndpointsByCategory(category: string): APIEndpoint[] {
  return API_ENDPOINTS.filter((e) => e.category === category);
}

/** Get all unique categories */
export function getAPICategories(): string[] {
  return [...new Set(API_ENDPOINTS.map((e) => e.category))];
}
