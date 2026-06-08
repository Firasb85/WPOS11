/**
 * Session Security Module.
 * Manages session lifecycle, rotation, expiration, and device tracking.
 */
import { supabase } from "@/integrations/supabase/client";

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const SESSION_KEY = "wpos_session_activity";

/**
 * Track session activity — call on user interactions.
 */
export function trackActivity(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, Date.now().toString());
}

/**
 * Check if session has timed out due to inactivity.
 */
export function isSessionExpired(timeoutMs = SESSION_TIMEOUT_MS): boolean {
  if (typeof window === "undefined") return false;
  const last = window.localStorage.getItem(SESSION_KEY);
  if (!last) return false;
  return Date.now() - Number(last) > timeoutMs;
}

/**
 * Force logout — clears session and redirects to login.
 */
export async function forceLogout(reason?: string): Promise<void> {
  await supabase.auth.signOut();
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SESSION_KEY);
    window.location.href = `/login${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`;
  }
}

/**
 * Rotate session — refresh the JWT token.
 */
export async function rotateSession(): Promise<boolean> {
  const { error } = await supabase.auth.refreshSession();
  return !error;
}

/**
 * Get current session info.
 */
export async function getSessionInfo() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;

  return {
    userId: session.user.id,
    email: session.user.email,
    expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
    role: session.user.user_metadata?.role ?? "USER",
    lastSignIn: session.user.last_sign_in_at,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
  };
}

/**
 * Session monitor — checks for expiration every minute.
 * Call once at app startup.
 */
export function startSessionMonitor(onExpired?: () => void): () => void {
  const interval = setInterval(() => {
    if (isSessionExpired()) {
      clearInterval(interval);
      if (onExpired) onExpired();
      else forceLogout("Session expired due to inactivity");
    }
  }, 60_000);

  // Track initial activity
  trackActivity();

  // Track on user interaction
  const handler = () => trackActivity();
  if (typeof window !== "undefined") {
    window.addEventListener("click", handler, { passive: true });
    window.addEventListener("keydown", handler, { passive: true });
  }

  return () => {
    clearInterval(interval);
    if (typeof window !== "undefined") {
      window.removeEventListener("click", handler);
      window.removeEventListener("keydown", handler);
    }
  };
}
