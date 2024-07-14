import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

function createEmotionCache() {
  return createCache({ key: "css" });
}

const cache = createEmotionCache();

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <CacheProvider value={cache}>
        <RemixBrowser />
      </CacheProvider>
    </StrictMode>,
  );
});
