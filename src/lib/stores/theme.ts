/**
 * Theme Store — manages dark/light mode.
 *
 * Reads preference in order:
 *   1. localStorage (user's explicit choice)
 *   2. System preference (prefers-color-scheme)
 *   3. Default: light
 *
 * Applies the `dark` class on <html> and dispatches a custom event
 * so any component can react to changes.
 */

const STORAGE_KEY = "wpos_dark_mode";

export type Theme = "light" | "dark" | "system";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light" || stored === "system") return stored;
  } catch {}
  return "system";
}

export function getResolvedTheme(theme: Theme = getStoredTheme()): "light" | "dark" {
  if (theme === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

export function setTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent("wpos:theme-changed", { detail: theme }));
}

export function applyTheme(theme: Theme = getStoredTheme()): void {
  if (typeof document === "undefined") return;
  const resolved = getResolvedTheme(theme);
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

/** Initialize on app start — call once in layout */
export function initTheme(): void {
  applyTheme();
  // Listen for system preference changes
  if (typeof window !== "undefined") {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (getStoredTheme() === "system") applyTheme("system");
    });
  }
}
