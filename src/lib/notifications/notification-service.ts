export type NotificationType = "alert" | "warning" | "info" | "success" | "action_required";
export type NotificationPriority = "critical" | "high" | "medium" | "low";
export interface WPOSNotification { id: string; type: NotificationType; priority: NotificationPriority; title: string; titleAr: string; message: string; messageAr: string; category: string; actionUrl?: string; actionLabel?: string; actionLabelAr?: string; read: boolean; dismissed: boolean; createdAt: string; }

const SK = "wpos_notifications";
let c = 0;
const nid = () => `n-${Date.now()}-${++c}`;
function gs(): WPOSNotification[] { if (typeof window === "undefined") return []; try { return JSON.parse(localStorage.getItem(SK) || "[]"); } catch { return []; } }
function sv(i: WPOSNotification[]): void { if (typeof window === "undefined") return; try { localStorage.setItem(SK, JSON.stringify(i.slice(0, 100))); window.dispatchEvent(new CustomEvent("wpos:notifications-updated")); } catch {} }

export function getNotifications(o?: { unreadOnly?: boolean; limit?: number }): WPOSNotification[] { let i = gs().filter((n) => !n.dismissed); if (o?.unreadOnly) i = i.filter((n) => !n.read); if (o?.limit) i = i.slice(0, o.limit); return i; }
export function getUnreadCount(): number { return gs().filter((n) => !n.read && !n.dismissed).length; }
export function markAsRead(id: string): void { sv(gs().map((n) => n.id === id ? { ...n, read: true } : n)); }
export function markAllAsRead(): void { sv(gs().map((n) => ({ ...n, read: true }))); }
export function dismissNotification(id: string): void { sv(gs().map((n) => n.id === id ? { ...n, dismissed: true } : n)); }
export function clearAll(): void { sv([]); }

export function addNotification(n: Omit<WPOSNotification, "id" | "read" | "dismissed" | "createdAt">): WPOSNotification {
  const item: WPOSNotification = { ...n, id: nid(), read: false, dismissed: false, createdAt: new Date().toISOString() };
  sv([item, ...gs()]); return item;
}

export function notifyKPIBreach(emp: string, kpi: string, gap: number): void { addNotification({ type: "alert", priority: gap < -20 ? "critical" : "high", title: "KPI Breach: " + emp, titleAr: "انتهاك: " + emp, message: kpi + " is " + Math.abs(gap).toFixed(1) + "% below target.", messageAr: kpi + " أقل من الهدف بنسبة " + Math.abs(gap).toFixed(1) + "%.", category: "performance", actionUrl: "/snapshots", actionLabel: "View", actionLabelAr: "عرض" }); }
export function notifyTrendWarning(emp: string, kpi: string, periods: number): void { addNotification({ type: "warning", priority: periods >= 3 ? "high" : "medium", title: "Declining: " + emp, titleAr: "انخفاض: " + emp, message: kpi + " declining for " + periods + " periods.", messageAr: kpi + " في انخفاض لمدة " + periods + " فترات.", category: "performance", actionUrl: "/diagnostics/new", actionLabel: "Diagnose", actionLabelAr: "تشخيص" }); }
export function notifyDiagnosticReady(title: string, id: string): void { addNotification({ type: "action_required", priority: "high", title: "Review Needed", titleAr: "مراجعة مطلوبة", message: '"' + title + '" needs review.', messageAr: '"' + title + '" بحاجة للمراجعة.', category: "diagnostic", actionUrl: "/diagnostics/report/" + id, actionLabel: "Review", actionLabelAr: "مراجعة" }); }
export function notifyCaseAssigned(num: string, id: string): void { addNotification({ type: "info", priority: "medium", title: "Case: " + num, titleAr: "حالة: " + num, message: "Case " + num + " assigned.", messageAr: "تم إسناد الحالة " + num + ".", category: "case", actionUrl: "/cases/" + id, actionLabel: "Open", actionLabelAr: "فتح" }); }
export function notifyAIInsight(t: string, d: string): void { addNotification({ type: "info", priority: "low", title: "AI: " + t, titleAr: "ذكاء: " + t, message: d, messageAr: d, category: "ai", actionUrl: "/ai-assistant", actionLabel: "Explore", actionLabelAr: "استكشاف" }); }

export function seedSampleNotifications(): void {
  if (gs().length > 0) return;
  notifyKPIBreach("Ahmad Khalid", "Customer Satisfaction", -17.9);
  notifyTrendWarning("Ahmad Khalid", "CSAT Score", 3);
  notifyKPIBreach("Sara Mohammed", "Revenue Target", -35);
  notifyDiagnosticReady("CSAT Decline Investigation", "diag-1");
  notifyAIInsight("3 At-Risk Employees", "AI detected 3 employees with declining trends.");
}
