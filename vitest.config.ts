import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/__tests__/**/*.test.{ts,tsx}"],
    exclude: ["src/e2e/**"],
    setupFiles: ["./src/__tests__/setup.ts"],
    coverage: {
      reporter: ["text", "lcov"],
      include: ["src/lib/**", "src/hooks/**", "src/components/**"],
      exclude: [
        "src/**/*.d.ts",
        "src/routeTree.gen.ts",
        "src/components/ui/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
