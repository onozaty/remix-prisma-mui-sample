import { vitePlugin as remix } from "@remix-run/dev";
import { createRequire } from "module";
import path from "path";
import { flatRoutes } from "remix-flat-routes";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://github.com/prisma/prisma/issues/12504#issuecomment-1599452566
const { resolve } = createRequire(import.meta.url);
const prismaClient = `prisma${path.sep}client`;
const prismaClientIndexBrowser = resolve(
  "@prisma/client/index-browser",
).replace(`@${prismaClient}`, `.${prismaClient}`);

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
    hmr: {
      port: 24678,
    },
    warmup: {
      clientFiles: [
        "./app/entry.client.tsx",
        "./app/root.tsx",
        "./app/routes/**/*",
        "!./app/routes/**/*.test.{ts,tsx}",
      ],
    },
  },
  resolve: {
    alias: {
      ".prisma/client/index-browser": path.relative(
        __dirname,
        prismaClientIndexBrowser,
      ),
    },
  },
});
