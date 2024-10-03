import { MuiProvider } from "#app/mui.provider";
import { CssBaseline } from "@mui/material";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <MuiProvider>
        <CssBaseline />
        <RemixBrowser />
      </MuiProvider>
    </StrictMode>,
  );
});
