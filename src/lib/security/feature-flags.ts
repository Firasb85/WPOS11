/**
 * Feature Flags — control feature rollout without deployment.
 * Supports canary releases and gradual rollout.
 */

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
  rolloutPercentage: number; // 0-100
  allowedRoles?: string[];
}

const FLAGS: Record<string, FeatureFlag> = {
  mfa_enabled: {
    key: "mfa_enabled",
    enabled: true,
    description: "Multi-Factor Authentication",
    rolloutPercentage: 100,
  },
  ai_insights: {
    key: "ai_insights",
    enabled: true,
    description: "AI Insights Engine on CEO Dashboard",
    rolloutPercentage: 100,
  },
  realtime_dashboard: {
    key: "realtime_dashboard",
    enabled: true,
    description: "Real-time Supabase subscriptions on dashboards",
    rolloutPercentage: 100,
  },
  bulk_export: {
    key: "bulk_export",
    enabled: true,
    description: "Bulk PDF export for diagnostic reports",
    rolloutPercentage: 100,
  },
  guided_wizard: {
    key: "guided_wizard",
    enabled: true,
    description: "Guided Diagnostic Wizard modal",
    rolloutPercentage: 100,
  },
  risk_prediction: {
    key: "risk_prediction",
    enabled: true,
    description: "Proactive risk prediction badges on dashboards",
    rolloutPercentage: 100,
  },
  gdpr_tools: {
    key: "gdpr_tools",
    enabled: true,
    description: "GDPR data export and deletion tools",
    rolloutPercentage: 100,
    allowedRoles: ["ADMIN"],
  },
};

/**
 * Check if a feature is enabled for the current user.
 */
export function isFeatureEnabled(key: string, userRole?: string): boolean {
  const flag = FLAGS[key];
  if (!flag) return false;
  if (!flag.enabled) return false;

  // Role check
  if (flag.allowedRoles && userRole) {
    if (!flag.allowedRoles.includes(userRole)) return false;
  }

  // Rollout percentage (deterministic by key hash)
  if (flag.rolloutPercentage < 100) {
    const hash = key.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 100;
    if (hash >= flag.rolloutPercentage) return false;
  }

  return true;
}

/**
 * Get all feature flags.
 */
export function getAllFlags(): FeatureFlag[] {
  return Object.values(FLAGS);
}
