import { createRequestHandler } from "@remix-run/express";
import { ServerBuild } from "@remix-run/node";
import compression from "compression";
import express from "express";
import { logger } from "./app/utils/logger.server.js";

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      );

const BUILD_PATH = "../server/index.js";

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () =>
        viteDevServer.ssrLoadModule(
          "virtual:remix/server-build",
        ) as Promise<ServerBuild>
    : ((await import(BUILD_PATH)) as unknown as () => Promise<ServerBuild>),
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

//app.use(morgan("tiny"));
app.use((req, res, next) => {
  const { method, url } = req;
  logger.info(`Started ${method} ${url}`);

  const start = Date.now();

  // レスポンス終了時のイベントでログを出力
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    logger.info(
      `Completed ${method} ${url} with status ${statusCode} in ${duration}ms`,
    );
  });

  next();
});

// handle SSR requests
app.all("*", remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`),
);
