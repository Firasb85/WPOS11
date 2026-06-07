/**
 * WPOS Translation Dictionary.
 * Centralized translations for data labels, statuses, and common terms.
 * Use with the `useLanguage().t()` helper or import `tr()` directly.
 */

const translations: Record<string, { en: string; ar: string }> = {
  // ── Common Actions ──
  "action.create": { en: "Create", ar: "إنشاء" },
  "action.edit": { en: "Edit", ar: "تعديل" },
  "action.delete": { en: "Delete", ar: "حذف" },
  "action.save": { en: "Save", ar: "حفظ" },
  "action.cancel": { en: "Cancel", ar: "إلغاء" },
  "action.search": { en: "Search", ar: "بحث" },
  "action.export": { en: "Export", ar: "تصدير" },
  "action.import": { en: "Import", ar: "استيراد" },
  "action.submit": { en: "Submit", ar: "إرسال" },
  "action.approve": { en: "Approve", ar: "اعتماد" },
  "action.reject": { en: "Reject", ar: "رفض" },
  "action.view": { en: "View", ar: "عرض" },
  "action.back": { en: "Back", ar: "رجوع" },
  "action.next": { en: "Next", ar: "التالي" },
  "action.close": { en: "Close", ar: "إغلاق" },

  // ── Statuses ──
  "status.active": { en: "Active", ar: "نشط" },
  "status.inactive": { en: "Inactive", ar: "غير نشط" },
  "status.draft": { en: "Draft", ar: "مسودة" },
  "status.open": { en: "Open", ar: "مفتوحة" },
  "status.closed": { en: "Closed", ar: "مغلقة" },
  "status.resolved": { en: "Resolved", ar: "تم الحل" },
  "status.pending": { en: "Pending", ar: "معلقة" },
  "status.approved": { en: "Approved", ar: "معتمدة" },
  "status.rejected": { en: "Rejected", ar: "مرفوضة" },
  "status.under_review": { en: "Under Review", ar: "قيد المراجعة" },
  "status.in_progress": { en: "In Progress", ar: "قيد التنفيذ" },
  "status.completed": { en: "Completed", ar: "مكتملة" },
  "status.cancelled": { en: "Cancelled", ar: "ملغاة" },
  "status.scheduled": { en: "Scheduled", ar: "مجدولة" },

  // ── KPI Statuses ──
  "kpi.green": { en: "Good", ar: "جيد" },
  "kpi.yellow": { en: "Warning", ar: "تحذير" },
  "kpi.red": { en: "Critical", ar: "حرج" },

  // ── Priority ──
  "priority.low": { en: "Low", ar: "منخفضة" },
  "priority.medium": { en: "Medium", ar: "متوسطة" },
  "priority.high": { en: "High", ar: "عالية" },
  "priority.critical": { en: "Critical", ar: "حرجة" },

  // ── Evidence Types ──
  "evidence.quantitative": { en: "Quantitative", ar: "كمي" },
  "evidence.qualitative": { en: "Qualitative", ar: "نوعي" },
  "evidence.behavioral": { en: "Behavioral", ar: "سلوكي" },
  "evidence.system_generated": { en: "System Generated", ar: "منشأ من النظام" },
  "evidence.contextual": { en: "Contextual", ar: "سياقي" },
  "evidence.temporal": { en: "Temporal", ar: "زمني" },

  // ── Root Cause Categories ──
  "cause.skill_gap": { en: "Skill Gap", ar: "فجوة مهارية" },
  "cause.knowledge_gap": { en: "Knowledge Gap", ar: "فجوة معرفية" },
  "cause.process_issue": { en: "Process Issue", ar: "مشكلة إجرائية" },
  "cause.tool_issue": { en: "Tool Issue", ar: "مشكلة أدوات" },
  "cause.environmental_issue": { en: "Environmental Issue", ar: "مشكلة بيئية" },
  "cause.resource_issue": { en: "Resource Issue", ar: "مشكلة موارد" },
  "cause.management_issue": { en: "Management Issue", ar: "مشكلة إدارية" },
  "cause.motivation_issue": { en: "Motivation Issue", ar: "مشكلة تحفيز" },
  "cause.workload_issue": { en: "Workload Issue", ar: "مشكلة عبء عمل" },
  "cause.policy_issue": { en: "Policy Issue", ar: "مشكلة سياسات" },

  // ── Intervention Types ──
  "intervention.training": { en: "Training", ar: "تدريب" },
  "intervention.coaching": { en: "Coaching", ar: "توجيه" },
  "intervention.mentoring": { en: "Mentoring", ar: "إرشاد" },
  "intervention.process_redesign": { en: "Process Redesign", ar: "إعادة تصميم العملية" },
  "intervention.tool_upgrade": { en: "Tool Upgrade", ar: "ترقية الأدوات" },
  "intervention.other": { en: "Other", ar: "أخرى" },

  // ── Competency Categories ──
  "competency.skill": { en: "Skill", ar: "مهارة" },
  "competency.knowledge": { en: "Knowledge", ar: "معرفة" },
  "competency.behavior": { en: "Behavior", ar: "سلوك" },
  "competency.attitude": { en: "Attitude", ar: "موقف" },

  // ── Reliability ──
  "reliability.high": { en: "High", ar: "عالية" },
  "reliability.medium": { en: "Medium", ar: "متوسطة" },
  "reliability.low": { en: "Low", ar: "منخفضة" },

  // ── Follow-up Types ──
  "followup.30_day": { en: "30-Day Check-in", ar: "مراجعة 30 يوم" },
  "followup.60_day": { en: "60-Day Check-in", ar: "مراجعة 60 يوم" },
  "followup.90_day": { en: "90-Day Check-in", ar: "مراجعة 90 يوم" },
  "followup.ad_hoc": { en: "Ad Hoc", ar: "غير مجدول" },

  // ── Follow-up Results ──
  "result.improvement": { en: "Improvement", ar: "تحسن" },
  "result.no_change": { en: "No Change", ar: "بدون تغيير" },
  "result.decline": { en: "Decline", ar: "تراجع" },

  // ── Common Labels ──
  "label.name": { en: "Name", ar: "الاسم" },
  "label.code": { en: "Code", ar: "الرمز" },
  "label.description": { en: "Description", ar: "الوصف" },
  "label.status": { en: "Status", ar: "الحالة" },
  "label.date": { en: "Date", ar: "التاريخ" },
  "label.email": { en: "Email", ar: "البريد" },
  "label.phone": { en: "Phone", ar: "الهاتف" },
  "label.department": { en: "Department", ar: "الإدارة" },
  "label.branch": { en: "Branch", ar: "الفرع" },
  "label.company": { en: "Company", ar: "الشركة" },
  "label.team": { en: "Team", ar: "الفريق" },
  "label.employee": { en: "Employee", ar: "الموظف" },
  "label.total": { en: "Total", ar: "الإجمالي" },
  "label.records": { en: "records", ar: "سجلات" },
  "label.loading": { en: "Loading...", ar: "جاري التحميل..." },
  "label.no_data": { en: "No data available", ar: "لا توجد بيانات" },

  // ── Modules ──
  "module.dashboard": { en: "Dashboard", ar: "لوحة القيادة" },
  "module.organization": { en: "Organization", ar: "الهيكل التنظيمي" },
  "module.jobs": { en: "Job Architecture", ar: "هيكل الوظائف" },
  "module.competency": { en: "Competency", ar: "الكفاءات" },
  "module.processes": { en: "Processes", ar: "العمليات" },
  "module.kpis": { en: "KPIs", ar: "مؤشرات الأداء" },
  "module.snapshots": { en: "Snapshots", ar: "اللقطات" },
  "module.evidence": { en: "Evidence", ar: "الأدلة" },
  "module.diagnostics": { en: "Diagnostics", ar: "التشخيصات" },
  "module.cases": { en: "Cases", ar: "الحالات" },
  "module.interventions": { en: "Interventions", ar: "التدخلات" },
  "module.analytics": { en: "Analytics", ar: "التحليلات" },
  "module.reports": { en: "Reports", ar: "التقارير" },
  "module.admin": { en: "Administration", ar: "الإدارة" },
};

/**
 * Translate a key based on the current language.
 * Falls back to the key itself if not found.
 */
export function tr(key: string, lang: "en" | "ar"): string {
  const entry = translations[key];
  if (!entry) return key;
  return lang === "ar" ? entry.ar : entry.en;
}

/**
 * Get all translations for a prefix (e.g., "status." returns all status translations)
 */
export function getTranslationGroup(prefix: string, lang: "en" | "ar"): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(translations)) {
    if (key.startsWith(prefix)) {
      const shortKey = key.slice(prefix.length);
      result[shortKey] = lang === "ar" ? val.ar : val.en;
    }
  }
  return result;
}

export { translations };
