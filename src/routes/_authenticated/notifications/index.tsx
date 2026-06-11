import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { getNotifications, markAsRead, markAllAsRead, dismissNotification, clearAll, getUnreadCount, seedSampleNotifications, type WPOSNotification } from "@/lib/notifications/notification-service";
import { Bell, CheckCheck, Trash2, AlertTriangle, Info, Shield, CheckCircle, ArrowRight, Zap, Filter } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/notifications/")({ component: NotificationsPage });

function NotificationsPage() {
  const { t, lang, isRTL } = useLanguage();
  const [items, setItems] = useState<WPOSNotification[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const refresh = useCallback(() => {
    seedSampleNotifications();
    const opts = filter === "unread" ? { unreadOnly: true } : undefined;
    setItems(getNotifications(opts));
  }, [filter]);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("wpos:notifications-updated", handler);
    return () => window.removeEventListener("wpos:notifications-updated", handler);
  }, [refresh]);

  const unread = getUnreadCount();

  const typeIcon = (type: string) => {
    if (type === "alert") return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (type === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    if (type === "success") return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (type === "action_required") return <Zap className="w-4 h-4 text-blue-500" />;
    return <Info className="w-4 h-4 text-gray-400" />;
  };

  const priorityBadge = (p: string) => {
    const colors: Record<string, string> = { critical: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400", high: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400", medium: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400", low: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400" };
    return <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase ${colors[p] || colors.low}`}>{p}</span>;
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t("Just now", "الآن");
    if (mins < 60) return `${mins}${t("m ago", "د مضت")}`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}${t("h ago", "س مضت")}`;
    return `${Math.floor(hrs / 24)}${t("d ago", "ي مضت")}`;
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <PageHeader title="Notifications" titleAr="الإشعارات" description={`${unread} unread notifications`} descriptionAr={`${unread} إشعارات غير مقروءة`} currentLang={lang}
        actions={
          <div className="flex items-center gap-2">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-1.5 text-xs rounded-md border border-gray-200 dark:border-[#1e2836] bg-white dark:bg-[#111822]">
              <option value="all">{t("All", "الكل")}</option>
              <option value="unread">{t("Unread", "غير مقروءة")}</option>
            </select>
            <button onClick={() => { markAllAsRead(); refresh(); toast.success(t("All marked as read", "تم تحديد الكل كمقروء")); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-gray-200 dark:border-[#1e2836] hover:bg-gray-50 dark:hover:bg-white/5" aria-label="Mark all read"><CheckCheck className="w-3.5 h-3.5" />{t("Mark all read", "تحديد الكل")}</button>
            <button onClick={() => { clearAll(); refresh(); toast.success(t("Cleared", "تم المسح")); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" aria-label="Clear all"><Trash2 className="w-3.5 h-3.5" />{t("Clear", "مسح")}</button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { label: t("Total", "الإجمالي"), value: items.length, icon: <Bell className="w-5 h-5 text-blue-500" /> },
          { label: t("Unread", "غير مقروءة"), value: unread, icon: <Info className="w-5 h-5 text-amber-500" /> },
          { label: t("Critical", "حرجة"), value: items.filter((n) => n.priority === "critical").length, icon: <AlertTriangle className="w-5 h-5 text-red-500" /> },
          { label: t("Action Required", "تحتاج إجراء"), value: items.filter((n) => n.type === "action_required").length, icon: <Zap className="w-5 h-5 text-purple-500" /> },
        ].map((s, i) => (
          <Card key={i} className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#0d1117] flex items-center justify-center">{s.icon}</div>
            <div><p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p><p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</p></div>
          </Card>
        ))}
      </div>

      {/* Notification list */}
      <Card padding="none">
        {items.length === 0 ? (
          <div className="py-16 text-center"><Bell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" /><p className="text-sm text-gray-400">{t("No notifications", "لا توجد إشعارات")}</p></div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-[#1e2836]">
            {items.map((n) => (
              <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${!n.read ? "bg-blue-50/30 dark:bg-blue-500/5" : ""}`} onClick={() => { markAsRead(n.id); refresh(); }}>
                <div className="mt-1 flex-shrink-0">{typeIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm ${n.read ? "text-gray-700 dark:text-gray-300" : "font-semibold text-gray-900 dark:text-white"}`}>{lang === "ar" ? n.titleAr : n.title}</p>
                    {priorityBadge(n.priority)}
                    {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{lang === "ar" ? n.messageAr : n.message}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-gray-400">{timeAgo(n.createdAt)}</span>
                    <span className="text-[10px] text-gray-400">• {n.category}</span>
                    {n.actionUrl && (
                      <Link to={n.actionUrl} className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-medium hover:underline">
                        {lang === "ar" ? n.actionLabelAr : n.actionLabel} <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); dismissNotification(n.id); refresh(); }} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-white/5 flex-shrink-0" aria-label="Dismiss"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
