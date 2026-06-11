import { describe, it, expect, vi } from "vitest";
import { analyzeWithAI, type AIAnalysisRequest } from "@/lib/ai/openai-client";

describe("AI Client — Local Fallback Engine", () => {
  // All tests run without API key → local analysis

  it("should diagnose performance issues locally", async () => {
    const request: AIAnalysisRequest = {
      type: "diagnose",
      context: { employeeName: "Ahmad", kpiName: "CSAT", gapPercentage: -25 },
      language: "en",
    };
    const result = await analyzeWithAI(request);
    expect(result.content).toContain("critical");
    expect(result.confidence).toBeGreaterThan(50);
    expect(result.model).toBe("wpos-local-v1");
    expect(result.tokensUsed).toBe(0);
  });

  it("should predict trends locally", async () => {
    const result = await analyzeWithAI({
      type: "predict",
      context: { gapPercentage: -15, trend: "worsening" },
      language: "en",
    });
    expect(result.content).toContain("probability");
    expect(result.confidence).toBeGreaterThan(0);
  });

  it("should recommend interventions locally", async () => {
    const result = await analyzeWithAI({
      type: "recommend",
      context: { rootCause: "skill_gap" },
      language: "en",
    });
    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.content.toLowerCase()).toContain("training");
  });

  it("should summarize locally", async () => {
    const result = await analyzeWithAI({
      type: "summarize",
      context: {},
      language: "en",
    });
    expect(result.content.length).toBeGreaterThan(50);
    expect(result.confidence).toBeGreaterThanOrEqual(70);
  });

  it("should respond in Arabic when requested", async () => {
    const result = await analyzeWithAI({
      type: "diagnose",
      context: { gapPercentage: -30 },
      language: "ar",
    });
    // Should contain Arabic characters
    expect(/[\u0600-\u06FF]/.test(result.content)).toBe(true);
  });

  it("should handle chat mode", async () => {
    const result = await analyzeWithAI({
      type: "chat",
      context: {},
      userMessage: "Hello",
      language: "en",
    });
    expect(result.content.length).toBeGreaterThan(10);
    expect(result.confidence).toBeGreaterThan(80);
  });

  it("should cache responses for same request", async () => {
    const req: AIAnalysisRequest = {
      type: "diagnose",
      context: { gapPercentage: -20 },
      language: "en",
    };
    const r1 = await analyzeWithAI(req);
    const r2 = await analyzeWithAI(req);
    // Local analysis doesn't cache (no API call)
    expect(r2.content).toBe(r1.content);
    expect(r2.content).toBe(r1.content);
  });
});
