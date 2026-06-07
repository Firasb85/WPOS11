/**
 * LanguageContext
 * Provides a centralized language preference (ar | en) across all components.
 *
 * Usage:
 *   const { lang, setLang, isRTL, t } = useLanguage();
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Lang = "ar" | "en";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  isRTL: boolean;
  /** Inline translation helper: t('English text', 'نص عربي') */
  t: (en: string, ar: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "wpos_lang";

function getInitialLanguage(): Lang {
  if (typeof window === "undefined") return "ar";

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ar") return stored;

    const user = JSON.parse(window.localStorage.getItem("wpos_user") || "{}") as Record<
      string,
      unknown
    >;
    if (user.language === "en") return "en";
  } catch {
    // localStorage may be unavailable (SSR, private browsing)
  }

  return "ar";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start with 'ar' to match SSR; hydrate from localStorage after mount
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const initial = getInitialLanguage();
    if (initial !== "ar") setLangState(initial);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage write may fail in private browsing
      }
    }

    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", next === "ar" ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", next);
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        isRTL: lang === "ar",
        t: (en, ar) => (lang === "ar" ? ar : en),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within <LanguageProvider>");
  return ctx;
}
