import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "~": path.resolve(__dirname, "./src"),
      },
    },
    environments: {
      client: {
        build: {
          rollupOptions: {
            output: {
              manualChunks: {
                "vendor-react": ["react", "react-dom"],
                "vendor-router": [
                  "@tanstack/react-router",
                  "@tanstack/react-query",
                ],
                "vendor-supabase": ["@supabase/supabase-js"],
                "vendor-ui": ["lucide-react", "clsx", "tailwind-merge"],
              },
            },
          },
        },
      },
    },
  },
});
