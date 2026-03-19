import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// In dev mode, Vite processes @rescui/ui-contexts through its SSR pipeline (due to noExternal below)
// and sees the "use client" directive in ThemeProvider, treating it as client-only — so it skips
// SSR entirely, which breaks dark theme and context. This plugin strips that directive during SSR
// transforms only, making dev behave the same as the production build.

const stripUseClientForSSR = () => ({
  name: "strip-use-client-for-ssr",
  transform(code: string, id: string, options?: { ssr?: boolean }) {
    if (
      options?.ssr &&
      id.includes("@rescui/ui-contexts") &&
      code.startsWith('"use client"')
    ) {
      return code.replace(/^"use client";\n?/, "");
    }
  },
});

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), stripUseClientForSSR()],
  css: {
    devSourcemap: true,
  },
  // to avoid "ReferenceError: global is not defined":
  define: {
    global: "globalThis",
  },
  // Force all packages to use the same React instance:
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  // process CSS from these packages through Vite during SSR (not skipped as Node externals while Node can't process CSS and throws an error):
  ssr: {
    noExternal: [/@rescui/, /@jetbrains\/kotlin-web-site-ui/],
  },
  // try to start on localhost:5173 by default:
  server: {
    port: 5173,
  },
});
