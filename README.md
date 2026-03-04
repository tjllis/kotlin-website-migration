# Kotlin Website — React Router 7 Rebuild

A rebuild of the Kotlin website homepage using **React Router 7**, **Vite**, and the
JetBrains `@rescui` and `@jetbrains/kotlin-web-site-ui` libraries.

---

## Running the project

### Development

```bash
npm install
npm run dev
```

Starts Vite's dev server at `http://localhost:5173` with HMR (hot module replacement) —
changes in source files reflect in the browser instantly without a full reload. Used this
during development.

Docker is not suitable for active development: every code change requires rebuilding the
entire image, which takes ~25 seconds. There's no HMR, no CSS sourcemaps in the browser.

### Production (Docker)

```bash
docker compose up
```

Builds the image (if not already built) and starts the app at **http://localhost:3000**.

```bash
docker compose up --build   # force rebuild after code changes
docker compose up -d        # run in background, freeing the terminal
docker compose down         # stop and remove the container
```

The `Dockerfile` uses a **multi-stage build**
(set by default upon RR7 project creation in Framework mode - default template):

1. Installs all dependencies (including devDependencies) and builds the app with `react-router build`
2. Installs only production dependencies in a separate layer
3. Final image copies only the `build/` output — no source files, no dev tools

---

## What was changed from the original

### Removed

| What                                                                                | Why                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_fonts.scss` + unused fonts (GraublauSans, GraublauSlab, LiberationMono, OpenSans) | Not used anywhere in the project                                                                                                                                                                                                                                                                                                                                                |
| `public/assets/socials/` and `public/assets/logos/` folders                         | Not referenced by any component                                                                                                                                                                                                                                                                                                                                                 |
| `styles/base.scss` as a separate file                                               | Deprecated — contents merged into `app.scss` to keep global styles in one place. Variables in `base.scss` that referenced non-existent tokens were replaced with the correct class names, verified against the rendered output in DevTools                                                                                                                                      |
| Component images moved out of `public/assets/images/` into `app/assets/images/`     | Images used inside components (`import img from "..."`) belong in `app/`, not `public/`. Vite then processes them, adds a content hash to the filename (e.g. `multiplatform-DDx4WxAq.svg`), and handles cache-busting automatically. Images that stay in `public/` (open-graph, twitter previews, favicons) need a stable, hardcoded URL and are intentionally left unprocessed |

### Added / configured

| What                                                                                 | Why                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.npmrc` with `legacy-peer-deps=true`                                                | `@rescui/*` packages declare peer deps up to React 18; React 19 is used here. This flag bypasses the peer dep conflict without downgrading React                                                                                                                                                                                                        |
| `vite.config.ts`: `define: { global: "globalThis" }`                                 | `@jetbrains/kotlin-web-site-ui` uses `global` (a Node.js-only variable) in its code. Browsers don't have `global`, so after SSR the page would crash during hydration. Vite replaces every occurrence of `global` with `globalThis` in the browser bundle at build time — `globalThis` is a standard equivalent that works in both Node.js and browsers |
| `vite.config.ts`: `resolve.dedupe: ["react", "react-dom"]`                           | Some packages bundle their own copy of React. If two copies are loaded simultaneously, they each have separate internal state — so a context created in one is invisible to the other, and `useContext` silently returns `null`. This setting forces all packages to use the single React copy in the root `node_modules`                               |
| `vite.config.ts`: `ssr.noExternal` for `@rescui` and `@jetbrains/kotlin-web-site-ui` | Forces Vite to process these packages' CSS through its pipeline during SSR, instead of skipping them                                                                                                                                                                                                                                                    |
| SSR guard in `Header.tsx`                                                            | `Header` from `@jetbrains/kotlin-web-site-ui` accesses `window` at render time, which crashes SSR. The wrapper uses `useState`/`useEffect` to render nothing on the server and mount the component in the browser. `Footer` has no such issue and renders on the server normally                                                                        |
| `ThemeProvider` wrapping entire page with `theme="dark"`                             | The site uses a dark theme globally. Wrapping the root layout once avoids repeating the theme prop on every section — only `UsageSection` and `WhyKotlinSection` override it locally with a light theme                                                                                                                                                 |

### SSR compatibility tweaks in components

| Component             | Change                                                       | Why                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `HeaderSection`       | Removed `window.innerWidth` check for card layout            | Layout is handled by CSS grid — no JS measurement needed, and `window` is unavailable during SSR                                                             |
| `UsageSection`        | `localStorage.getItem` call moved into `useEffect`           | `localStorage` doesn't exist on the server; `useEffect` only runs in the browser after hydration                                                             |
| `ProgrammingLanguage` | Initial tab index fixed at `0` instead of `Math.random()`    | Random values differ between server and client render, causing a React hydration mismatch warning                                                            |
| `ProgrammingLanguage` | `hljs.highlight()` used instead of `hljs.highlightElement()` | `highlightElement()` mutates a real DOM node, which doesn't exist during SSR. `highlight()` returns a plain HTML string that works on both server and client |

### Style changes in @rescui and @jetbrains/kotlin-web-site-ui

- Button "Get started": colour shifted from blue to purple
- Button text size: 19px → 20px
- Link hover animation: gradient → brighter underline
- Code block (`.hljs`) background: grey → white
- `hljs` token colours and font weights updated
- Header & footer: header does not show a current Kotlin release number; footer is rendered in new height and with a changed structure

### Fonts

Fonts remain **self-hosted** (files in `public/assets/fonts/`) rather than loaded from
Google Fonts, for privacy (no third-party requests) and performance (preloaded with
`<link rel="preload">`). Unused font families were removed (see above).

## Verifying SSR works

### 1. View page source

In Chrome: right-click → **View Page Source** (not DevTools Inspect).  
If SSR is working, the raw HTML will contain actual page content — headings, text, footer markup.
If SSR is broken, you'll see an almost-empty `<body>` with just `<script>` tags.

### 2. Disable JavaScript

In Chrome DevTools → three-dot menu → **Run command** → type `Disable JavaScript`.  
Reload the page. If content still appears, it was server-rendered.  
The Header will be missing (expected — it's client-only), but everything else should remain visible.

> **Note:** In dev mode, styles will appear broken with JS disabled. In this mode, Vite injects CSS via JavaScript (`<script>` tags), so disabling JS also strips all styles. This is a dev-mode limitation only — in a production build, CSS is extracted into separate `.css` files and loads independently of JS.

### 3. Check the network response

In DevTools → **Network** tab → reload → click the first document request (the HTML file) → **Response** tab.  
Look at the raw response body — it should contain rendered HTML, not just a script loader.

---

## Known limitations

### Header is client-only (no SSR)

The `Header` component from `@jetbrains/kotlin-web-site-ui` cannot be server-side rendered
because it accesses `window` directly in multiple places:

| File                                  | Usage                         |
| ------------------------------------- | ----------------------------- |
| `header/is-macos.js`                  | `window.navigator.appVersion` |
| `header/search-wrapper/use-search.js` | `window.setTimeout` (×2)      |
| `header/full-search/full-search.js`   | `window.innerWidth`           |

**Workaround:** The `Header` wrapper component uses `useState`/`useEffect` to suppress
SSR internally — it renders `null` on the server and mounts `GlobalHeader` only after the
page hydrates in the browser. This means the header is absent from the initial HTML and
appears after hydration — a minor trade-off for compatibility with a library not designed
for SSR. `Footer` has no `window` dependencies and renders on the server normally.

---

## Project structure

### Original (starting point)

A **Python + Jinja2 + Webpack** application with server-side HTML templating.

```
assets/            # fonts, images
data/              # YAML data files (nav, news, releases, testimonials)
scripts/           # React SSR compile scripts
src/               # Python backend (Flask/Jinja helpers, markdown processors)
static/
  css/             # SCSS global styles
  js/
    ktl-component/ # Header/Footer JSX wrappers
    page/index/    # homepage section components (JS + SCSS)
templates/         # Jinja2 HTML templates
kotlin-website.py  # Python entry point
webpack.config.js
requirements.txt
```

### Current

A **React Router 7 + Vite + TypeScript** Single Page Application with SSR.

```
app/
  root.tsx                  # root layout (ThemeProvider, Header, Footer, Outlet)
  routes.ts                 # route definitions
  app.scss                  # global styles entry point
  assets/images/            # images imported by components (Vite hashes these for cache-busting)
  components/
    ktl-component/          # Header/Footer wrappers
    Layout/                 # shared Section + Container primitives
    HomeSections/           # one folder per homepage section (TSX + data + SCSS)
  routes/                   # page-level route components
  styles/                   # global SCSS partials (reset, grid, fonts, base)
  types/                    # TypeScript module declarations
public/
  assets/fonts/             # self-hosted Inter + JetBrains Mono
  assets/images/            # images with stable URLs: open-graph, twitter previews, JetBrains logo
.npmrc                      # legacy-peer-deps=true
Dockerfile
vite.config.ts
```

---

## Dependency notes

The following packages are **unlisted runtime dependencies** of `@jetbrains/kotlin-web-site-ui` —
they are missing from the library's own `package.json`, so npm would not pull them in.
They have been added explicitly to this project's `package.json` and are downloaded automatically by `npm install`:

`prop-types`, `@rescui/focus-manager`, `@react-hook/resize-observer`, `algoliasearch@4`,
`formik`, `react-outside-click-handler`, `react-remove-scroll-bar`, `react-scrollbar-size`,
`sha.js`, `@rescui/switcher`, `bem-cn-fast`, `body-scroll-lock`, `query-string`,
`react-modal`, `react-swipeable-views-react-18-fix`, `the-platform`

---

## Known warnings while running in dev mode (non-issues)

### `Sourcemap for "@rescui/icons/lib/index.css" points to missing source files`

`@rescui/icons` includes a `sourceMappingURL` comment in its published CSS but did not
include the `.map` file in the npm package. The CSS works correctly. Safe to ignore.

### `No route matches URL "/.well-known/appspecific/com.chrome.devtools.json"`

Chrome silently requests `/.well-known/appspecific/com.chrome.devtools.json` on every
local dev server looking for debugging config. React Router has no route for it and logs
an error. Safe to ignore.
