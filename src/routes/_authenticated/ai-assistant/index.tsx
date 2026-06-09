import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { Bot, Send, Loader2, Lightbulb, TrendingUp, AlertTriangle, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ai-assistant/")({ component: AIAssistantPage });

function AIAssistantPage() {
  const { t, lang, isRTL } = useLanguage();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role:string;content:string}[]>([
    { role: "assistant", content: t("Hello! I\'m your WPOS AI Assistant. Ask me about performance trends, diagnostic insights, or workforce analytics.","مرحباً! أنا مساعد WPOS الذكي. اسألني عن اتجاهات الأداء أو رؤى التشخيص أو تحليلات القوى العاملة.") },
  ]);

  const suggestions = [
    { icon: <TrendingUp className="w-4 h-4" />, text: t("Show declining KPIs","عرض المؤشرات المتراجعة") },
    { icon: <AlertTriangle className="w-4 h-4" />, text: t("Who is at risk?","من هو في خطر؟") },
    { icon: <Users className="w-4 h-4" />, text: t("Team performance summary","ملخص أداء الفريق") },
    { icon: <Lightbulb className="w-4 h-4" />, text: t("Suggest interventions","اقتراح تدخلات") },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((p) => [...p, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setMessages((p) => [...p, { role: "assistant", content: t("Based on the current data, I can see 3 employees with declining KPIs. Ahmad Khalid shows a 3-period CSAT decline (92→85→78%). I recommend initiating a diagnostic workflow for these cases.","بناءً على البيانات الحالية، أرى 3 موظفين بمؤشرات متراجعة. أحمد خالد يظهر انخفاض CSAT لـ 3 فترات (92→85→78%). أوصي ببدء سير عمل تشخيصي لهذه الحالات.") }]);
    setLoading(false);
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <PageHeader title="AI Assistant" titleAr="المساعد الذكي" description="AI-powered workforce performance insights" descriptionAr="رؤى أداء القوى العاملة المدعومة بالذكاء الاصطناعي" currentLang={lang} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"}`}>
                    {m.role === "assistant" && <Bot className="w-4 h-4 inline me-1 opacity-60" />}
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div className="flex justify-start"><div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3"><Loader2 className="w-4 h-4 animate-spin" /></div></div>}
            </div>
            <div className="border-t p-4 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder={t("Ask about performance...","اسأل عن الأداء...")} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              <button onClick={handleSend} disabled={loading || !input.trim()} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg" aria-label={t("Send","إرسال")}><Send className="w-4 h-4" /></button>
            </div>
          </Card>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500">{t("Quick Prompts","اقتراحات سريعة")}</p>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => { setInput(s.text); }} className="w-full flex items-center gap-2 p-3 text-sm text-start bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              {s.icon}<span>{s.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
