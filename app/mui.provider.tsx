import { theme } from "#app/theme";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material";
import React from "react";

const createEmotionCache = () => {
  return createCache({ key: "css" });
};

export function MuiProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const cache = createEmotionCache();

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}
