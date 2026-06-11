/**
 * WPOS ISO 27001 Compliance Module.
 *
 * Information Security Management System (ISMS) controls
 * mapped to ISO 27001:2022 Annex A.
 *
 * Each control has: implementation status, evidence, last audit date.
 */

export type ControlStatus = "implemented" | "partial" | "planned" | "not_applicable";

export interface ISMSControl {
  id: string;
  clause: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  status: ControlStatus;
  evidence: string;
  lastAudit?: string;
  owner: string;
}

/** ISO 27001:2022 Annex A controls relevant to WPOS */
export const ISO27001_CONTROLS: ISMSControl[] = [
  // A.5 — Information Security Policies
  { id: "A.5.1", clause: "A.5", title: "Information Security Policy", titleAr: "سياسة أمن المعلومات", description: "Documented security policies approved by management", descriptionAr: "سياسات أمنية موثقة ومعتمدة من الإدارة", status: "implemented", evidence: "SECURITY.md, security headers in vercel.json", owner: "CISO" },
  // A.6 — Organization of Information Security
  { id: "A.6.1", clause: "A.6", title: "Roles & Responsibilities", titleAr: "الأدوار والمسؤوليات", description: "RBAC with 4 roles and 20 permissions", descriptionAr: "نظام RBAC بـ 4 أدوار و20 صلاحية", status: "implemented", evidence: "src/lib/rbac/index.ts, 40+ RLS policies", owner: "Admin" },
  // A.7 — Human Resource Security
  { id: "A.7.2", clause: "A.7", title: "Employee Performance Management", titleAr: "إدارة أداء الموظفين", description: "Performance tracking, diagnostics, and evidence-based interventions", descriptionAr: "تتبع الأداء والتشخيصات والتدخلات المبنية على الأدلة", status: "implemented", evidence: "7-step diagnostic workflow, 36 DB tables", owner: "HR" },
  // A.8 — Asset Management
  { id: "A.8.1", clause: "A.8", title: "Data Classification", titleAr: "تصنيف البيانات", description: "Sensitive performance data classified and protected by RLS", descriptionAr: "بيانات الأداء الحساسة مصنفة ومحمية بسياسات RLS", status: "implemented", evidence: "migration 006_secure_rls.sql, field-level encryption", owner: "DBA" },
  // A.9 — Access Control
  { id: "A.9.1", clause: "A.9", title: "Access Control Policy", titleAr: "سياسة التحكم في الوصول", description: "Multi-layer access: UI guards, API middleware, DB RLS", descriptionAr: "وصول متعدد الطبقات: حماية واجهة، وسيط API، سياسات قاعدة البيانات", status: "implemented", evidence: "PermissionGuard, auth-middleware.ts, 40+ RLS policies", owner: "Security" },
  { id: "A.9.4", clause: "A.9", title: "MFA & Authentication", titleAr: "المصادقة متعددة العوامل", description: "Supabase Auth with MFA, session management, rate limiting", descriptionAr: "مصادقة Supabase مع MFA وإدارة الجلسات وتحديد المعدل", status: "implemented", evidence: "src/lib/security/mfa.ts, rate-limit.ts, session.ts", owner: "Security" },
  // A.10 — Cryptography
  { id: "A.10.1", clause: "A.10", title: "Data Encryption", titleAr: "تشفير البيانات", description: "AES-256-GCM field encryption, TLS in transit, scrypt for passwords", descriptionAr: "تشفير حقول AES-256-GCM، TLS أثناء النقل، scrypt لكلمات المرور", status: "implemented", evidence: "src/lib/security/encryption.ts, Supabase TLS", owner: "Engineering" },
  // A.12 — Operations Security
  { id: "A.12.4", clause: "A.12", title: "Audit Logging", titleAr: "تسجيل التدقيق", description: "Complete audit trail with 5 filter types, 365-day retention", descriptionAr: "سجل تدقيق كامل مع 5 أنواع تصفية، احتفاظ لمدة 365 يوم", status: "implemented", evidence: "audit_logs table, src/lib/audit/", owner: "Compliance" },
  { id: "A.12.6", clause: "A.12", title: "Vulnerability Management", titleAr: "إدارة الثغرات", description: "Dependencies monitored, CSP headers, XSS protection", descriptionAr: "مراقبة التبعيات، رؤوس CSP، حماية XSS", status: "implemented", evidence: "vercel.json headers, npm audit", owner: "DevOps" },
  // A.13 — Communications Security
  { id: "A.13.1", clause: "A.13", title: "Network Security", titleAr: "أمن الشبكة", description: "TLS 1.3, API key management, CORS configuration", descriptionAr: "TLS 1.3، إدارة مفاتيح API، تكوين CORS", status: "implemented", evidence: "Supabase TLS, src/lib/security/headers.ts", owner: "Infrastructure" },
  // A.18 — Compliance
  { id: "A.18.1", clause: "A.18", title: "GDPR Compliance", titleAr: "الامتثال لـ GDPR", description: "Data export, deletion requests, consent management, DPA", descriptionAr: "تصدير البيانات، طلبات الحذف، إدارة الموافقة", status: "implemented", evidence: "src/lib/compliance/gdpr.ts", owner: "DPO" },
  { id: "A.18.2", clause: "A.18", title: "Data Retention", titleAr: "الاحتفاظ بالبيانات", description: "Configurable retention policies per data type", descriptionAr: "سياسات احتفاظ قابلة للتكوين حسب نوع البيانات", status: "implemented", evidence: "src/lib/governance/retention.ts", owner: "Compliance" },
];

/** Get compliance score as percentage */
export function getComplianceScore(): { score: number; implemented: number; total: number } {
  const total = ISO27001_CONTROLS.length;
  const implemented = ISO27001_CONTROLS.filter((c) => c.status === "implemented").length;
  const partial = ISO27001_CONTROLS.filter((c) => c.status === "partial").length;
  return { score: Math.round(((implemented + partial * 0.5) / total) * 100), implemented, total };
}

/** Get controls by status */
export function getControlsByStatus(status: ControlStatus): ISMSControl[] {
  return ISO27001_CONTROLS.filter((c) => c.status === status);
}
