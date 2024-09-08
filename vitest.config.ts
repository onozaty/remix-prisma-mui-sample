/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

dotenv.config({
  path: ".env.test",
});

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/vitest.setup.ts"],
    coverage: {
      include: ["app/**/*.{ts,tsx}"],
    },
  },
});
