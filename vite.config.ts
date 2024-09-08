import { vitePlugin as remix } from "@remix-run/dev";
import { flatRoutes } from "remix-flat-routes";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      ignoredRouteFiles: ["**/*"],
      routes: async (defineRoutes) =>
        flatRoutes("routes", defineRoutes, {
          ignoredRouteFiles: ["**/*.test.{ts,tsx}"],
        }),
    }),
    tsconfigPaths(),
  ],
  server: {
    host: "127.0.0.1",
    warmup: {
      clientFiles: [
        "./app/entry.client.tsx",
        "./app/root.tsx",
        "./app/routes/**/*",
        "!./app/routes/**/*.test.{ts,tsx}",
      ],
    },
  },
});
