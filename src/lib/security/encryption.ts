/**
 * WPOS Data Encryption Module.
 *
 * Provides field-level encryption for sensitive data using AES-GCM.
 * Uses Web Crypto API (available in browsers + Node 15+).
 *
 * Compliance: GDPR Art 32, ISO 27001 A.10.1
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

function toCryptoBytes(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy;
}

/** Derive encryption key from passphrase using PBKDF2 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", toCryptoBytes(encoder.encode(passphrase)), "PBKDF2", false, ["deriveBits", "deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt: toCryptoBytes(salt), iterations: 310000, hash: "SHA-256" }, keyMaterial, { name: ALGORITHM, length: KEY_LENGTH }, false, ["encrypt", "decrypt"]);
}

/** Encrypt plaintext → Base64 string (IV + salt + ciphertext) */
export async function encryptField(plaintext: string, passphrase: string): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(passphrase, salt);
  const ciphertext = await crypto.subtle.encrypt({ name: ALGORITHM, iv: toCryptoBytes(iv) }, key, toCryptoBytes(encoder.encode(plaintext)));
  const combined = new Uint8Array(salt.length + iv.length + new Uint8Array(ciphertext).length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);
  return btoa(String.fromCharCode(...combined));
}

/** Decrypt Base64 string → plaintext */
export async function decryptField(encrypted: string, passphrase: string): Promise<string> {
  const decoder = new TextDecoder();
  const data = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 16 + IV_LENGTH);
  const ciphertext = data.slice(16 + IV_LENGTH);
  const key = await deriveKey(passphrase, salt);
  const plaintext = await crypto.subtle.decrypt({ name: ALGORITHM, iv: toCryptoBytes(iv) }, key, toCryptoBytes(ciphertext));
  return decoder.decode(plaintext);
}

/** Hash sensitive data for comparison (one-way) */
export async function hashField(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-256", toCryptoBytes(encoder.encode(value)));
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Security configuration */
export const SECURITY_CONFIG = {
  encryption: { algorithm: ALGORITHM, keyLength: KEY_LENGTH, pbkdf2Iterations: 310000 },
  passwords: { minLength: 8, requireUppercase: true, requireNumber: true, requireSpecial: true, maxAge: 90 },
  sessions: { maxConcurrent: 3, idleTimeout: 30, absoluteTimeout: 480 },
  rateLimit: { loginAttempts: 5, lockoutDuration: 15, apiRatePerMinute: 100 },
  audit: { retentionDays: 365, sensitiveFields: ["password", "ssn", "salary", "api_key"] },
};
