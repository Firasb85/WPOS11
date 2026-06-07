import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { Bell, CheckCircle, AlertTriangle, Info, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/notifications/")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { t, lang: l } = useLanguage();

  const notifications = [
    {
      id: "1",
      type: "alert",
      titleEn: "KPI Target Missed",
      titleAr: "تجاوز هدف المؤشر",
      bodyEn: "Customer Satisfaction dropped below threshold",
      bodyAr: "انخفض رضا العملاء دون الحد",
      time: "2h ago",
      read: false,
    },
    {
      id: "2",
      type: "success",
      titleEn: "Diagnostic Approved",
      titleAr: "تم اعتماد التشخيص",
      bodyEn: "Report DR-2024-045 was approved by manager",
      bodyAr: "تمت الموافقة على التقرير DR-2024-045",
      time: "5h ago",
      read: false,
    },
    {
      id: "3",
      type: "info",
      titleEn: "New Case Assigned",
      titleAr: "تم تعيين حالة جديدة",
      bodyEn: "Case CAS-012 has been assigned to your team",
      bodyAr: "تم تعيين الحالة CAS-012 لفريقك",
      time: "1d ago",
      read: true,
    },
    {
      id: "4",
      type: "warning",
      titleEn: "Action Plan Overdue",
      titleAr: "خطة عمل متأخرة",
      bodyEn: "Action plan for CAS-008 is past due date",
      bodyAr: "خطة العمل للحالة CAS-008 تجاوزت الموعد",
      time: "2d ago",
      read: true,
    },
    {
      id: "5",
      type: "info",
      titleEn: "System Maintenance",
      titleAr: "صيانة النظام",
      bodyEn: "Scheduled maintenance this weekend",
      bodyAr: "صيانة مجدولة نهاية الأسبوع",
      time: "3d ago",
      read: true,
    },
  ];

  const iconMap = {
    alert: <AlertTriangle className="w-5 h-5 text-red-500" />,
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <Clock className="w-5 h-5 text-orange-500" />,
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        titleAr="الإشعارات"
        description="Stay updated on system events and alerts"
        descriptionAr="ابق على اطلاع بأحداث وتنبيهات النظام"
        currentLang={l}
      />
      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className={`${!n.read ? "border-l-4 border-l-blue-500" : ""}`}>
            <div className="flex items-start gap-3">
              {iconMap[n.type as keyof typeof iconMap]}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-sm font-medium ${!n.read ? "text-gray-900 dark:text-white" : "text-gray-600"}`}
                  >
                    {l === "ar" ? n.titleAr : n.titleEn}
                  </h3>
                  <span className="text-xs text-gray-400">{n.time}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{l === "ar" ? n.bodyAr : n.bodyEn}</p>
              </div>
              {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
