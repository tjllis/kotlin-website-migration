import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
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
  // process CSS from these packages through Vite during SSR (not skipped as Node externals):
  ssr: {
    noExternal: [/@rescui/, /@jetbrains\/kotlin-web-site-ui/],
  },
  // try to start on localhost:5173 by default:
  server: {
    port: 5173,
  },
});
