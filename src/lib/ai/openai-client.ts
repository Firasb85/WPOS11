/**
 * WPOS Insights Client — optional OpenAI / Claude integration for the
 * Insights Assistant module.
 *
 * Provides structured Q&A over WPOS data using LLM APIs.
 * Falls back to a local rule-based analysis engine when no API key is
 * configured. Both paths produce the same explainable output shape.
 *
 * Configuration:
 *   Set VITE_OPENAI_API_KEY in your environment (or use Supabase Edge Functions).
 *   Model defaults to gpt-4o-mini for cost efficiency.
 *
 * NOTE: This module is framed as the "Insights Assistant" in product copy.
 * The optional LLM is only enabled when an org's plan explicitly allows it.
 * All structured insights / predictions / scoring logic elsewhere in the
 * codebase is deterministic and does NOT require this module to function.
 */

export interface AIAnalysisRequest {
  type: "diagnose" | "predict" | "recommend" | "summarize" | "chat";
  context: {
    employeeName?: string;
    kpiName?: string;
    currentValue?: number;
    targetValue?: number;
    gapPercentage?: number;
    trend?: string;
    evidenceItems?: string[];
    rootCause?: string;
    historicalData?: string;
  };
  userMessage?: string;
  language?: "en" | "ar";
}

export interface AIAnalysisResponse {
  content: string;
  confidence: number;
  suggestions: string[];
  model: string;
  tokensUsed: number;
  cached: boolean;
}

// System prompts per analysis type — framed as the WPOS Insights Assistant,
// not as an "AI". The LLM is positioned as a Q&A layer over structured data.
const SYSTEM_PROMPTS: Record<string, string> = {
  diagnose: `You are the WPOS Insights Assistant, helping managers understand a diagnostic report.
Given KPI data, evidence, and trends, provide:
1. Most likely root cause (from: skill_gap, knowledge_gap, process_issue, tool_issue, environmental, resource, management, motivation, workload, policy)
2. Confidence level (0-100%) — and the evidence items that contributed to it
3. Supporting reasoning — cite specific evidence by ID or short label
4. Recommended interventions — tied to the diagnosed root cause
Be concise and actionable. Always cite the evidence used.`,

  predict: `You are the WPOS Insights Assistant, helping managers understand performance forecasts.
Given historical KPI snapshots, predict:
1. Next period's likely performance value
2. Breach probability (0-100%)
3. Risk factors driving the prediction — cite snapshot IDs
4. Early warning indicators — cite which KPIs trend downward
Use statistical reasoning. Be specific with numbers and sources.`,

  recommend: `You are the WPOS Insights Assistant, helping managers pick the right intervention.
Given a diagnosed root cause and employee context, recommend:
1. Top 3 interventions ranked by effectiveness
2. Expected timeline for improvement
3. Success metrics to track
4. Potential risks of each intervention
Be specific — no generic advice.`,

  summarize: `You are the WPOS Insights Assistant, helping executives read a performance report.
Given performance data across employees and departments, create:
1. Executive summary (3-4 sentences)
2. Key findings (bullet points) — cite source data
3. Critical action items — tied to specific cases or employees
4. Positive trends to maintain
Write for C-level executives. Be data-driven and concise.`,

  chat: `You are the WPOS Insights Assistant — a Q&A layer over the customer's own
workforce performance data. You help HR professionals, managers, and executives
understand performance data, walk through diagnostics, and surface relevant
evidence. Always reference specific evidence or data when available. Be concise
and actionable. If asked in Arabic, respond in Arabic.`,
};

// Response cache to avoid repeated API calls
const responseCache = new Map<string, { response: AIAnalysisResponse; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(request: AIAnalysisRequest): string {
  return JSON.stringify({ type: request.type, context: request.context, msg: request.userMessage?.substring(0, 50) });
}

/**
 * Call OpenAI API (or compatible endpoint).
 * Falls back to local analysis if no API key.
 */
export async function analyzeWithAI(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  // Check cache
  const cacheKey = getCacheKey(request);
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { ...cached.response, cached: true };
  }

  const apiKey = getApiKey();

  if (!apiKey) {
    // Fall back to local rule-based analysis
    return localAnalysis(request);
  }

  try {
    const systemPrompt = SYSTEM_PROMPTS[request.type] || SYSTEM_PROMPTS.chat;
    const userMessage = buildUserMessage(request);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.warn(`[WPOS Insights] OpenAI API error: ${response.status}. Falling back to local.`);
      return localAnalysis(request);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const tokensUsed = data.usage?.total_tokens || 0;

    const result: AIAnalysisResponse = {
      content,
      confidence: extractConfidence(content),
      suggestions: extractSuggestions(content),
      model: "gpt-4o-mini",
      tokensUsed,
      cached: false,
    };

    // Cache the response
    responseCache.set(cacheKey, { response: result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.warn("[WPOS Insights] API call failed, using built-in analysis:", error);
    return localAnalysis(request);
  }
}

function getApiKey(): string | null {
  if (typeof window !== "undefined") {
    // Check localStorage first (user-configured)
    try {
      const stored = localStorage.getItem("wpos_openai_key");
      if (stored) return stored;
    } catch { /* ignore */ }
  }
  // Check environment
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_OPENAI_API_KEY) {
    return import.meta.env.VITE_OPENAI_API_KEY;
  }
  return null;
}

function buildUserMessage(request: AIAnalysisRequest): string {
  const { context, userMessage, language } = request;
  const parts: string[] = [];

  if (language === "ar") parts.push("الرجاء الرد باللغة العربية.");

  if (context.employeeName) parts.push(`Employee: ${context.employeeName}`);
  if (context.kpiName) parts.push(`KPI: ${context.kpiName}`);
  if (context.currentValue !== undefined) parts.push(`Current: ${context.currentValue}`);
  if (context.targetValue !== undefined) parts.push(`Target: ${context.targetValue}`);
  if (context.gapPercentage !== undefined) parts.push(`Gap: ${context.gapPercentage}%`);
  if (context.trend) parts.push(`Trend: ${context.trend}`);
  if (context.rootCause) parts.push(`Root Cause: ${context.rootCause}`);
  if (context.evidenceItems?.length) parts.push(`Evidence:\n${context.evidenceItems.map((e, i) => `${i + 1}. ${e}`).join("\n")}`);
  if (context.historicalData) parts.push(`Historical: ${context.historicalData}`);
  if (userMessage) parts.push(`\nQuestion: ${userMessage}`);

  return parts.join("\n");
}

function extractConfidence(content: string): number {
  const match = content.match(/(\d{1,3})%\s*confidence/i) || content.match(/confidence[:\s]*(\d{1,3})%/i);
  return match ? Math.min(100, parseInt(match[1])) : 75;
}

function extractSuggestions(content: string): string[] {
  const lines = content.split("\n");
  return lines
    .filter((l) => /^\s*[\d•\-\*]\s*[A-Z]/.test(l.trim()) || /recommend|suggest|action/i.test(l))
    .map((l) => l.replace(/^\s*[\d•\-\*\.]+\s*/, "").trim())
    .filter((l) => l.length > 10)
    .slice(0, 5);
}

/**
 * Local rule-based analysis — works without any API key.
 */
function localAnalysis(request: AIAnalysisRequest): AIAnalysisResponse {
  const { type, context, language } = request;
  const isAr = language === "ar";

  let content = "";
  let confidence = 70;
  const suggestions: string[] = [];

  switch (type) {
    case "diagnose": {
      const gap = context.gapPercentage ?? 0;
      if (gap < -20) {
        content = isAr
          ? `تحليل: ${context.employeeName || "الموظف"} يعاني من فجوة أداء حرجة (${gap}%) في ${context.kpiName || "المؤشر"}. بناءً على الأدلة المتاحة، السبب الجذري الأرجح هو فجوة مهارات. الثقة: 78%.`
          : `Analysis: ${context.employeeName || "Employee"} has a critical performance gap (${gap}%) in ${context.kpiName || "KPI"}. Based on available evidence, the most likely root cause is a skill gap. Confidence: 78%.`;
        confidence = 78;
        suggestions.push(isAr ? "تدريب مكثف على المهارات المطلوبة" : "Intensive training on required skills");
        suggestions.push(isAr ? "برنامج إرشاد مع موظف خبير" : "Mentoring program with senior staff");
        suggestions.push(isAr ? "مراجعة أسبوعية للأداء" : "Weekly performance check-in");
      } else if (gap < -10) {
        content = isAr
          ? `تحليل: فجوة متوسطة (${gap}%) في ${context.kpiName || "المؤشر"}. يُرجح أن السبب هو نقص في المعرفة أو مشكلة في العملية.`
          : `Analysis: Moderate gap (${gap}%) in ${context.kpiName || "KPI"}. Likely cause is knowledge deficit or process issue.`;
        confidence = 72;
        suggestions.push(isAr ? "تحديث وثائق العمليات" : "Update process documentation");
        suggestions.push(isAr ? "جلسة تدريبية مستهدفة" : "Targeted training session");
      } else {
        content = isAr
          ? `تحليل: الأداء ضمن النطاق المقبول (${gap}%). لا يلزم تدخل فوري.`
          : `Analysis: Performance within acceptable range (${gap}%). No immediate intervention needed.`;
        confidence = 90;
      }
      break;
    }
    case "predict": {
      const gap = context.gapPercentage ?? 0;
      const trend = context.trend || "stable";
      const nextGap = trend === "worsening" ? gap * 1.15 : trend === "improving" ? gap * 0.85 : gap;
      const breachProb = Math.min(95, Math.max(5, Math.abs(nextGap) * 2 + (trend === "worsening" ? 20 : 0)));
      content = isAr
        ? `توقع: بناءً على الاتجاه الحالي (${trend === "worsening" ? "متدهور" : trend === "improving" ? "يتحسن" : "مستقر"})، احتمالية الانتهاك في الفترة القادمة: ${Math.round(breachProb)}%. الفجوة المتوقعة: ${nextGap.toFixed(1)}%.`
        : `Prediction: Based on current trend (${trend}), breach probability next period: ${Math.round(breachProb)}%. Expected gap: ${nextGap.toFixed(1)}%.`;
      confidence = 68;
      if (breachProb > 60) suggestions.push(isAr ? "بدء تدخل استباقي فوراً" : "Initiate proactive intervention immediately");
      break;
    }
    case "recommend": {
      const cause = context.rootCause || "skill_gap";
      const interventions: Record<string, string[][]> = {
        skill_gap: [
          [isAr ? "تدريب مكثف (5 أيام)" : "Intensive Training (5 days)", isAr ? "4-6 أسابيع" : "4-6 weeks"],
          [isAr ? "إرشاد فردي أسبوعي" : "Weekly 1:1 Coaching", isAr ? "8-12 أسبوع" : "8-12 weeks"],
        ],
        process_issue: [
          [isAr ? "إعادة تصميم العملية" : "Process Redesign", isAr ? "2-4 أسابيع" : "2-4 weeks"],
          [isAr ? "أتمتة الخطوات اليدوية" : "Automate Manual Steps", isAr ? "4-8 أسابيع" : "4-8 weeks"],
        ],
        motivation_issue: [
          [isAr ? "برنامج تحفيز ومكافآت" : "Incentive & Recognition Program", isAr ? "مستمر" : "Ongoing"],
          [isAr ? "مراجعة توازن العمل/الحياة" : "Work-Life Balance Review", isAr ? "2 أسابيع" : "2 weeks"],
        ],
      };
      const recs = interventions[cause] || interventions.skill_gap;
      content = isAr
        ? `توصيات لمعالجة "${cause}":\n${recs.map((r, i) => `${i + 1}. ${r[0]} — الجدول الزمني: ${r[1]}`).join("\n")}`
        : `Recommendations for "${cause}":\n${recs.map((r, i) => `${i + 1}. ${r[0]} — Timeline: ${r[1]}`).join("\n")}`;
      recs.forEach((r) => suggestions.push(r[0]));
      confidence = 75;
      break;
    }
    case "summarize":
      content = isAr
        ? `ملخص تنفيذي: يضم النظام حالياً بيانات أداء للقوى العاملة. تم رصد فجوات أداء تتطلب تدخلاً. يُنصح بمراجعة الحالات الحمراء فوراً وبدء سير العمل التشخيصي.`
        : `Executive Summary: The system currently tracks workforce performance data. Performance gaps have been detected requiring intervention. Recommend reviewing RED cases immediately and initiating diagnostic workflows.`;
      confidence = 80;
      suggestions.push(isAr ? "مراجعة الحالات الحرجة أولاً" : "Review critical cases first");
      break;
    default:
      content = isAr
        ? `مرحباً! أنا مساعد الرؤى في WPOS. يمكنني مساعدتك في استعلام بيانات الأداء وشرح التشخيصات واقتراح التدخلات، مع الاستشهاد بالأدلة دائماً.`
        : `Hello! I'm the WPOS Insights Assistant. I can help you query performance data, walk through diagnostics, and surface interventions — always with cited evidence.`;
      confidence = 95;
  }

  return {
    content,
    confidence,
    suggestions,
    model: "wpos-local-v1",
    tokensUsed: 0,
    cached: false,
  };
}

/**
 * Configure API key at runtime (for admin settings page).
 */
export function setOpenAIKey(key: string): void {
  if (typeof window !== "undefined") {
    try { localStorage.setItem("wpos_openai_key", key); } catch { /* ignore */ }
  }
}

export function getOpenAIKey(): string | null {
  return getApiKey();
}

export function clearOpenAIKey(): void {
  if (typeof window !== "undefined") {
    try { localStorage.removeItem("wpos_openai_key"); } catch { /* ignore */ }
  }
}
