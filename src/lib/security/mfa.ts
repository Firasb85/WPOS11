/**
 * Multi-Factor Authentication (MFA) Module.
 * Supports TOTP via Supabase Auth MFA.
 *
 * Setup flow:
 * 1. User calls enrollMFA() → gets QR code URI
 * 2. User scans with authenticator app
 * 3. User enters TOTP code → calls verifyMFA()
 * 4. On login, if MFA enrolled → challengeMFA() + verifyChallenge()
 */
import { supabase } from "@/integrations/supabase/client";

export interface MFAEnrollment {
  id: string;
  qrCodeUri: string;
  secret: string;
  backupCodes: string[];
}

/**
 * Enroll user in TOTP MFA.
 * Returns QR code URI for authenticator app.
 */
export async function enrollMFA(): Promise<MFAEnrollment> {
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "WPOS Authenticator",
  });

  if (error) throw new Error(`MFA enrollment failed: ${error.message}`);

  // Generate backup recovery codes
  const backupCodes = Array.from({ length: 8 }, () =>
    Math.random().toString(36).substring(2, 8).toUpperCase(),
  );

  return {
    id: data.id,
    qrCodeUri: data.totp.uri,
    secret: data.totp.secret,
    backupCodes,
  };
}

/**
 * Verify TOTP code during MFA enrollment.
 */
export async function verifyMFAEnrollment(factorId: string, code: string): Promise<boolean> {
  const { data: challenge } = await supabase.auth.mfa.challenge({
    factorId,
  });

  if (!challenge) return false;

  const { error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code,
  });

  return !error;
}

/**
 * Create MFA challenge for login verification.
 */
export async function challengeMFA(factorId: string): Promise<string | null> {
  const { data, error } = await supabase.auth.mfa.challenge({ factorId });
  if (error) return null;
  return data.id;
}

/**
 * Verify MFA challenge during login.
 */
export async function verifyMFAChallenge(
  factorId: string,
  challengeId: string,
  code: string,
): Promise<boolean> {
  const { error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId,
    code,
  });
  return !error;
}

/**
 * Get user's MFA factors.
 */
export async function getMFAFactors() {
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) return [];
  return data.all ?? [];
}

/**
 * Unenroll a MFA factor.
 */
export async function unenrollMFA(factorId: string): Promise<boolean> {
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  return !error;
}
