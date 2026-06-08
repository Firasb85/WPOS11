/**
 * Security Headers Configuration.
 * Apply these in your deployment platform (Vercel/Cloudflare/Nginx).
 *
 * For Vercel: add to vercel.json
 * For Cloudflare: add to _headers file
 * For Nginx: add to server block
 */

export const SECURITY_HEADERS = {
  // Content Security Policy — prevent XSS
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: blob: https://*.supabase.co; " +
    "font-src 'self'; " +
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';",

  // HTTP Strict Transport Security — force HTTPS
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

  // Prevent clickjacking
  "X-Frame-Options": "DENY",

  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // Control referrer information
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Permissions Policy — disable unnecessary browser features
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",

  // XSS Protection (legacy browsers)
  "X-XSS-Protection": "1; mode=block",
} as const;

/**
 * Generate Vercel-compatible headers config.
 */
export function generateVercelHeaders() {
  return {
    headers: [
      {
        source: "/(.*)",
        headers: Object.entries(SECURITY_HEADERS).map(([key, value]) => ({
          key,
          value,
        })),
      },
    ],
  };
}
