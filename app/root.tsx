import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Container>
        <Box>
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{ color: "inherit", textDecoration: "none" }}
              >
                Remix + Prisma Sample App
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Box sx={{ p: 2 }}>
          <Outlet />
        </Box>
      </Container>
    </>
  );
}
