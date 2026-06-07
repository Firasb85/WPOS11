/**
 * Structured logger for WPOS audit trail.
 * Provides consistent log formatting for observability.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  userId?: string;
  traceId?: string;
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function getMinLevel(): LogLevel {
  if (typeof process !== "undefined" && process.env?.NODE_ENV === "production") return "info";
  return "debug";
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[getMinLevel()];
}

function formatEntry(entry: LogEntry): string {
  return JSON.stringify(entry);
}

function createEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    const entry = createEntry("debug", message, context);
    if (shouldLog("debug")) console.debug(formatEntry(entry));
    return entry;
  },

  info(message: string, context?: Record<string, unknown>) {
    const entry = createEntry("info", message, context);
    if (shouldLog("info")) console.info(formatEntry(entry));
    return entry;
  },

  warn(message: string, context?: Record<string, unknown>) {
    const entry = createEntry("warn", message, context);
    if (shouldLog("warn")) console.warn(formatEntry(entry));
    return entry;
  },

  error(message: string, context?: Record<string, unknown>) {
    const entry = createEntry("error", message, context);
    if (shouldLog("error")) console.error(formatEntry(entry));
    return entry;
  },
};
