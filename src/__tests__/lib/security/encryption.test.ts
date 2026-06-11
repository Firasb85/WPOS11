import { describe, it, expect } from "vitest";
import { encryptField, decryptField, hashField, SECURITY_CONFIG } from "@/lib/security/encryption";

describe("Data Encryption (AES-GCM)", () => {
  const passphrase = "test-key-2026-wpos";

  it("should encrypt and decrypt a string", async () => {
    const original = "Employee salary: 15000 SAR";
    const encrypted = await encryptField(original, passphrase);
    expect(encrypted).not.toBe(original);
    expect(encrypted.length).toBeGreaterThan(original.length);
    const decrypted = await decryptField(encrypted, passphrase);
    expect(decrypted).toBe(original);
  });

  it("should produce different ciphertexts for same input (random IV)", async () => {
    const text = "Sensitive data";
    const e1 = await encryptField(text, passphrase);
    const e2 = await encryptField(text, passphrase);
    expect(e1).not.toBe(e2); // Different IVs
    expect(await decryptField(e1, passphrase)).toBe(text);
    expect(await decryptField(e2, passphrase)).toBe(text);
  });

  it("should fail decryption with wrong passphrase", async () => {
    const encrypted = await encryptField("secret", passphrase);
    await expect(decryptField(encrypted, "wrong-key")).rejects.toThrow();
  });

  it("should produce consistent hash for same input", async () => {
    const h1 = await hashField("test@email.com");
    const h2 = await hashField("test@email.com");
    expect(h1).toBe(h2);
    expect(h1).toHaveLength(64); // SHA-256 hex
  });

  it("should produce different hashes for different inputs", async () => {
    const h1 = await hashField("user-a");
    const h2 = await hashField("user-b");
    expect(h1).not.toBe(h2);
  });

  it("should have correct security configuration", () => {
    expect(SECURITY_CONFIG.encryption.algorithm).toBe("AES-GCM");
    expect(SECURITY_CONFIG.encryption.keyLength).toBe(256);
    expect(SECURITY_CONFIG.passwords.minLength).toBeGreaterThanOrEqual(8);
    expect(SECURITY_CONFIG.sessions.maxConcurrent).toBeGreaterThanOrEqual(1);
    expect(SECURITY_CONFIG.rateLimit.loginAttempts).toBeLessThanOrEqual(10);
    expect(SECURITY_CONFIG.audit.retentionDays).toBeGreaterThanOrEqual(365);
  });
});
