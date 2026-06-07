import "@testing-library/jest-dom/vitest";

// Mock import.meta.env for tests
Object.defineProperty(import.meta, "env", {
  value: {
    VITE_SUPABASE_URL: "https://test.supabase.co",
    VITE_SUPABASE_PUBLISHABLE_KEY: "test-key-for-testing-only",
    VITE_SUPABASE_PROJECT_ID: "test-project-id",
    DEV: true,
    MODE: "test",
  },
  writable: true,
});
