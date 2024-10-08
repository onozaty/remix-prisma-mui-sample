// entry.server.tsx

import { logger } from "#app/utils/logger.server";
import { PassThrough } from "node:stream";

import { MuiProvider } from "#app/mui.provider";
import { CssBaseline } from "@mui/material";
import type {
  ActionFunctionArgs,
  AppLoadContext,
  EntryContext,
  HandleDataRequestFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext,
) {
  const { method, url } = request;
  logger.info(`Started ${method} ${url}`);
  const start = Date.now();

  const userAgent = request.headers.get("user-agent") || "";
  const isBotRequest = isbot(userAgent);

  const handlePromise = isBotRequest
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      );

  return handlePromise
    .then((response) => {
      const duration = Date.now() - start;
      const statusCode = response.status;
      logger.info(
        `Completed ${method} ${url} with status ${statusCode} in ${duration}ms`,
      );
      return response;
    })
    .catch((error) => {
      const duration = Date.now() - start;
      logger.error(`Error on ${method} ${url} after ${duration}ms: ${error}`);
      throw error;
    });
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell. Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            logger.error(`Streaming error in handleBotRequest: ${error}`);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <MuiProvider>
        <CssBaseline />
        <RemixServer
          context={remixContext}
          url={request.url}
          abortDelay={ABORT_DELAY}
        />
      </MuiProvider>,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell. Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            logger.error(`Streaming error in handleBrowserRequest: ${error}`);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
// 新しく追加：handleDataRequest の実装
export const handleDataRequest: HandleDataRequestFunction = async (
  response: Response | Promise<Response>,
  { request },
) => {
  const { method, url } = request;
  logger.info(`Data request started ${method} ${url}`);
  const start = Date.now();

  try {
    const res = await response;
    const duration = Date.now() - start;
    const statusCode = res.status;
    logger.info(
      `Data request completed ${method} ${url} with status ${statusCode} in ${duration}ms`,
    );
    return res;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(
      `Data request error on ${method} ${url} after ${duration}ms: ${error}`,
    );
    throw error;
  }
};

export function handleError(
  error: unknown,
  { request }: LoaderFunctionArgs | ActionFunctionArgs,
) {
  const { method, url } = request;
  logger.error(`handleError on ${method} ${url} : ${error}`);
}
