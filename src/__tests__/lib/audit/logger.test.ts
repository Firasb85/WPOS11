import { describe, it, expect, vi } from "vitest";
import { logger } from "@/lib/audit/logger";

describe("Logger", () => {
  it("should create log entries with correct structure", () => {
    const entry = logger.info("Test message", { key: "value" });

    expect(entry).toHaveProperty("level", "info");
    expect(entry).toHaveProperty("message", "Test message");
    expect(entry).toHaveProperty("timestamp");
    expect(entry.context).toEqual({ key: "value" });
  });

  it("should include timestamp in ISO format", () => {
    const entry = logger.info("Test");

    expect(() => new Date(entry.timestamp).toISOString()).not.toThrow();
  });

  it("should support all log levels", () => {
    const debugEntry = logger.debug("debug message");
    expect(debugEntry.level).toBe("debug");

    const infoEntry = logger.info("info message");
    expect(infoEntry.level).toBe("info");

    const warnEntry = logger.warn("warn message");
    expect(warnEntry.level).toBe("warn");

    const errorEntry = logger.error("error message");
    expect(errorEntry.level).toBe("error");
  });

  it("should handle context as undefined", () => {
    const entry = logger.info("No context");
    expect(entry.context).toBeUndefined();
  });
});
