// @jetbrains/kotlin-web-site-ui ships no TypeScript types.
// Without these, TypeScript refuses to compile ("module not found").
// These declarations tell TypeScript to trust that the modules exist.
declare module "@jetbrains/kotlin-web-site-ui/out/components/header/index.js";
declare module "@jetbrains/kotlin-web-site-ui/out/components/footer/index.js";

// TypeScript only understands .ts/.tsx files natively.
// These declarations tell it that importing an image file returns a string (the URL),
// so `import logo from "./logo.svg"` doesn't cause a type error.
declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}
