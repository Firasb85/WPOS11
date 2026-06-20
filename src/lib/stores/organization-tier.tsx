/**
 * Organization tier context.
 *
 * Reads the current org's tier + pilot expiry from the active session/Supabase
 * `companies` row. Exposed via React context so the sidebar, layout, and
 * page-level guards can show / hide the Advanced section.
 *
 * For the Pilot repositioning we don't yet wire to Supabase auth.users — we
 * keep a localStorage-backed default so the demo experience can be exercised
 * before the migration is run. Production should hydrate from
 * `useOrganization()` once the Pilot fields are live.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type OrgTier = "pilot" | "starter" | "professional" | "enterprise" | "unlimited";

export interface OrgTierInfo {
  tier: OrgTier;
  scopeDepartmentId: string | null;
  pilotExpiresAt: string | null; // ISO date
  isPilot: boolean;
  pilotDaysRemaining: number | null;
  /** True when pilot expiry is within 14 days — drives the warning banner */
  pilotExpiringSoon: boolean;
}

const STORAGE_KEY = "wpos_org_tier";

const DEFAULTS: Record<string, OrgTierInfo> = {
  pilot: {
    tier: "pilot",
    scopeDepartmentId: "dept-customer-success",
    pilotExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    isPilot: true,
    pilotDaysRemaining: 90,
    pilotExpiringSoon: false,
  },
  enterprise: {
    tier: "enterprise",
    scopeDepartmentId: null,
    pilotExpiresAt: null,
    isPilot: false,
    pilotDaysRemaining: null,
    pilotExpiringSoon: false,
  },
};

interface OrgTierContextValue {
  current: OrgTierInfo;
  setTier: (tier: OrgTier) => void;
}

const OrgTierContext = createContext<OrgTierContextValue | null>(null);

export function OrgTierProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<OrgTierInfo>(DEFAULTS.pilot);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as OrgTierInfo;
        setCurrent(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setTier = (tier: OrgTier) => {
    const base = DEFAULTS[tier] ?? DEFAULTS.pilot;
    const next: OrgTierInfo = { ...base, tier };
    setCurrent(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent("wpos:org-tier-changed"));
  };

  return (
    <OrgTierContext.Provider value={{ current, setTier }}>{children}</OrgTierContext.Provider>
  );
}

export function useOrgTier(): OrgTierContextValue {
  const ctx = useContext(OrgTierContext);
  if (!ctx) {
    // Safe default so isolated components don't crash.
    return {
      current: DEFAULTS.pilot,
      setTier: () => undefined,
    };
  }
  return ctx;
}

/**
 * Pure helper — useful from non-component code (e.g. route guards).
 */
export function isAdvancedVisible(tierInfo: OrgTierInfo, flagEnabled: boolean): boolean {
  if (tierInfo.isPilot) return false; // Pilot tier never shows Advanced
  return flagEnabled;
}
