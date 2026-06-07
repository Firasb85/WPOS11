import { describe, it, expect } from "vitest";
import { tr, getTranslationGroup, translations } from "@/lib/i18n/translations";

describe("i18n translations", () => {
  it("should return English text for en locale", () => {
    expect(tr("action.create", "en")).toBe("Create");
    expect(tr("status.active", "en")).toBe("Active");
    expect(tr("kpi.green", "en")).toBe("Good");
  });

  it("should return Arabic text for ar locale", () => {
    expect(tr("action.create", "ar")).toBe("إنشاء");
    expect(tr("status.active", "ar")).toBe("نشط");
    expect(tr("kpi.green", "ar")).toBe("جيد");
  });

  it("should return key if translation not found", () => {
    expect(tr("nonexistent.key", "en")).toBe("nonexistent.key");
  });

  it("getTranslationGroup should return grouped translations", () => {
    const statuses = getTranslationGroup("status.", "en");
    expect(statuses).toHaveProperty("active", "Active");
    expect(statuses).toHaveProperty("draft", "Draft");
    expect(statuses).toHaveProperty("resolved", "Resolved");
  });

  it("every translation should have both en and ar values", () => {
    for (const [key, val] of Object.entries(translations)) {
      expect(val.en, `${key} missing English`).toBeTruthy();
      expect(val.ar, `${key} missing Arabic`).toBeTruthy();
    }
  });

  it("should have all root cause categories translated", () => {
    const causes = getTranslationGroup("cause.", "ar");
    expect(Object.keys(causes).length).toBeGreaterThanOrEqual(10);
    expect(causes["skill_gap"]).toBe("فجوة مهارية");
  });

  it("should have all evidence types translated", () => {
    const types = getTranslationGroup("evidence.", "en");
    expect(types).toHaveProperty("quantitative");
    expect(types).toHaveProperty("qualitative");
    expect(types).toHaveProperty("behavioral");
  });
});
