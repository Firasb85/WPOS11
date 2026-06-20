import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card, CardHeader, CardTitle } from "~/components/wpos/Card";
import { useLanguage } from "@/lib/wpos/context/LanguageContext";
import { analyzeWithAI, getOpenAIKey, setOpenAIKey, clearOpenAIKey, type AIAnalysisRequest } from "@/lib/ai/openai-client";
import { Lightbulb, Send, Loader2, TrendingUp, AlertTriangle, Users, CheckCircle, BookOpen, Shield, Settings } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/ai-assistant/")({ component: InsightsAssistantPage });

interface Message { role: "user" | "assistant"; content: string; model?: string; confidence?: number; suggestions?: string[] }

function InsightsAssistantPage() {
  const { t, lang, isRTL } = useLanguage();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(getOpenAIKey() || "");
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: t("Hello! I'm the WPOS Insights Assistant. I can help you query performance data, walk through diagnostics, and surface relevant evidence. Ask me anything!", "مرحباً! أنا مساعد الرؤى في WPOS. يمكنني مساعدتك في استعلام بيانات الأداء وشرح التشخيصات وعرض الأدلة ذات الصلة. اسألني أي شيء!"), model: "system" },
  ]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  const suggestions = [
    { icon: <TrendingUp className="w-4 h-4" />, text: t("Show declining KPIs", "اعرض المؤشرات المتراجعة"), type: "diagnose" as const },
    { icon: <AlertTriangle className="w-4 h-4" />, text: t("List at-risk employees", "اعرض الموظفين المعرضين للخطر"), type: "predict" as const },
    { icon: <Users className="w-4 h-4" />, text: t("Suggest interventions for skill gaps", "اقترح تدخلات لفجوات المهارات"), type: "recommend" as const },
    { icon: <Lightbulb className="w-4 h-4" />, text: t("Executive performance summary", "ملخص تنفيذي للأداء"), type: "summarize" as const },
    { icon: <BookOpen className="w-4 h-4" />, text: t("Walk me through Ahmad's diagnostic", "اشرح لي تشخيص أحمد"), type: "diagnose" as const },
    { icon: <Shield className="w-4 h-4" />, text: t("Root cause analysis for Operations", "تحليل الأسباب الجذرية للعمليات"), type: "diagnose" as const },
  ];

  const handleSend = async (text?: string, type?: AIAnalysisRequest["type"]) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setMessages((p) => [...p, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);

    try {
      const request: AIAnalysisRequest = {
        type: type || "chat",
        context: { employeeName: "Ahmad Khalid", kpiName: "Customer Satisfaction", currentValue: 78, targetValue: 95, gapPercentage: -17.9, trend: "declining", evidenceItems: ["Response time increased from 2h to 6h", "Missed 3 training sessions", "4 late arrivals this month"], rootCause: "skill_gap" },
        userMessage: msg,
        language: lang,
      };

      const response = await analyzeWithAI(request);
      setMessages((p) => [...p, {
        role: "assistant",
        content: response.content,
        model: response.model,
        confidence: response.confidence,
        suggestions: response.suggestions,
      }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: t("Sorry, I encountered an error. Please try again.", "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.") }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = () => {
    if (apiKey.trim()) { setOpenAIKey(apiKey.trim()); toast.success(t("API key saved", "تم حفظ المفتاح")); }
    else { clearOpenAIKey(); toast.success(t("API key removed — using built-in analysis engine", "تم حذف المفتاح — يُستخدم محرك التحليل المدمج")); }
    setShowSettings(false);
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <PageHeader title="Insights Assistant" titleAr="مساعد الرؤى" description="Structured Q&A over your WPOS performance data — explainable, evidence-backed answers" descriptionAr="استعلام منظم لبيانات أداء WPOS — إجابات قابلة للتفسير ومبنية على الأدلة" currentLang={lang} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Chat */}
        <div className="lg:col-span-3">
          <Card padding="none" className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#1e2836]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><Lightbulb className="w-4 h-4 text-white" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t("WPOS Insights", "رؤى WPOS")}</p>
                  <p className="text-[10px] text-gray-400">{getOpenAIKey() ? "OpenAI GPT-4o-mini (optional)" : t("Built-in Analysis Engine", "محرك التحليل المدمج")}</p>
                </div>
              </div>
              <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5" aria-label="Settings"><Settings className="w-4 h-4 text-gray-400" /></button>
            </div>

            {/* API Key Settings */}
            {showSettings && (
              <div className="px-4 py-3 border-b border-gray-200 dark:border-[#1e2836] bg-gray-50 dark:bg-[#0d1117]">
                <p className="text-xs font-medium text-gray-500 mb-2">{t("OpenAI API Key (optional)", "مفتاح OpenAI API (اختياري)")}</p>
                <div className="flex gap-2">
                  <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-[#1e2836] bg-white dark:bg-[#111822] focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  <button onClick={handleSaveKey} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"><CheckCircle className="w-4 h-4" /></button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{t("Without a key, the local analysis engine is used (no API calls).", "بدون مفتاح، يُستخدم محرك التحليل المحلي (بدون اتصال بـ API).")}</p>
              </div>
            )}

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] ${m.role === "user" ? "bg-blue-600 text-white rounded-2xl rounded-br-md" : "bg-gray-100 dark:bg-[#161d27] text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-md"} px-4 py-3 text-sm leading-relaxed`}>
                    {m.role === "assistant" && <Lightbulb className="w-3.5 h-3.5 inline me-1 opacity-50 -mt-0.5" />}
                    <span className="whitespace-pre-wrap">{m.content}</span>
                    {m.model && m.model !== "system" && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200/30 dark:border-white/10">
                        <span className="text-[10px] opacity-50">Model: {m.model}</span>
                        {m.confidence && <span className="text-[10px] opacity-50">• {m.confidence}% confidence</span>}
                      </div>
                    )}
                    {m.suggestions && m.suggestions.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200/30 dark:border-white/10 space-y-1">
                        {m.suggestions.map((s, j) => (
                          <p key={j} className="text-[11px] opacity-70">→ {s}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start"><div className="bg-gray-100 dark:bg-[#161d27] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-blue-500" /><span className="text-xs text-gray-400">{t("Analyzing…", "جاري التحليل…")}</span></div></div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-[#1e2836] p-3 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()} placeholder={t("Ask about performance, predictions, interventions…", "اسأل عن الأداء والتوقعات والتدخلات…")} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-[#1e2836] bg-white dark:bg-[#0d1117] text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              <button onClick={() => handleSend()} disabled={loading || !input.trim()} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition-colors" aria-label={t("Send", "إرسال")}><Send className="w-4 h-4" /></button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>{t("Quick Prompts", "اقتراحات سريعة")}</CardTitle></CardHeader>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => handleSend(s.text, s.type)} disabled={loading} className="w-full flex items-center gap-2.5 p-2.5 text-start text-sm rounded-lg bg-gray-50 dark:bg-[#0d1117] hover:bg-blue-50 dark:hover:bg-blue-500/10 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-40">
                  <span className="text-blue-500">{s.icon}</span>
                  <span className="text-xs">{s.text}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>{t("Capabilities", "الإمكانات")}</CardTitle></CardHeader>
            <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-start gap-2"><BookOpen className="w-3.5 h-3.5 text-purple-500 mt-0.5 flex-shrink-0" /><span>{t("Scored diagnostic with explainable evidence breakdown", "تشخيص مُحرَّز مع تفصيل أدلة قابل للتفسير")}</span></div>
              <div className="flex items-start gap-2"><TrendingUp className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" /><span>{t("Performance trend analysis & breach forecasting", "تحليل اتجاهات الأداء وتوقع الانتهاكات")}</span></div>
              <div className="flex items-start gap-2"><Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" /><span>{t("Targeted intervention recommendations", "توصيات بتدخلات مستهدفة")}</span></div>
              <div className="flex items-start gap-2"><Shield className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /><span>{t("Executive report summarization", "تلخيص التقارير التنفيذية")}</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
