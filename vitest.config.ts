import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    include: [
      "lib/**/*.test.ts",
      "lib/**/*.spec.ts",
      "app/**/*.test.ts",
      "app/**/*.spec.ts",
    ],
    exclude: [
      "node_modules",
      ".next",
      "e2e",
      "playwright-report",
      "test-results",
    ],
    coverage: {
      enabled: false,
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
    },
  },
});