import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { ThemeProvider } from "@rescui/ui-contexts";

import Header from "./components/ktl-component/Header";
import Footer from "./components/ktl-component/Footer";

import "@rescui/colors/lib/index.css"; // rescui CSS custom properties
import "@rescui/typography/lib/font-jb-sans-auto.css"; // preload JetBrains Sans & Inter
import "./app.scss";

export const meta: Route.MetaFunction = () => [{ title: "Kotlin" }];

// preload fonts as it was done in index.html
// (skipped italic version since it is not used):
export const links: Route.LinksFunction = () => [
  {
    rel: "icon",
    href: "/assets/images/favicon.ico",
  },
  {
    rel: "preload",
    href: "/assets/fonts/JetBrainsMono/JetBrainsMono-Regular.woff2",
    as: "font",
    crossOrigin: "anonymous" as const, // string literal (exact string, not any)
  },
  {
    rel: "preload",
    href: "/assets/fonts/JetBrainsMono/JetBrainsMono-Bold.woff2",
    as: "font",
    crossOrigin: "anonymous" as const,
  },
  {
    rel: "icon", //tab icon
    href: "/favicon.svg",
    type: "image/svg+xml",
  },
  {
    rel: "shortcut icon", // tab icon for older browsers
    href: "/favicon.ico",
  },
  {
    rel: "apple-touch-icon", // 'app' icon for mobile
    href: "/apple-touch-icon.png",
  },
];

// the part that wraps outlet:
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
        <ThemeProvider theme="dark">
          <Header searchConfig={{}} />
          {children}
          <Footer />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
// home and other routes (when any) are rendered here:
export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main
      style={{
        paddingTop: "4rem",
        padding: "1rem",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre style={{ width: "100%", padding: "1rem", overflowX: "auto" }}>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
