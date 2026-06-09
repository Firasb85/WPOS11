import "@testing-library/jest-dom/vitest";

// Mock import.meta.env for tests
Object.defineProperty(import.meta, "env", {
  value: {
    VITE_SUPABASE_URL: "https://nsbmrtohkdttsufxwzdi.supabase.co",
    VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_dXfF2sIngV2Z3wT-_M9t8g_GkxdnHEk",
    VITE_SUPABASE_PROJECT_ID: "nsbmrtohkdttsufxwzdi",
    DEV: true,
    MODE: "test",
  },
  writable: true,
});
