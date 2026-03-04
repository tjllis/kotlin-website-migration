import { useEffect, useState } from "react";
import GlobalHeader from "@jetbrains/kotlin-web-site-ui/out/components/header/index.js";

// this object can have any number of props, where each prop is a string
// what's in those strings, is unknown
interface HeaderProps {
  [prop: string]: unknown;
}

// Header accesses `window` at render time and cannot be server-side rendered.
// This wrapper renders nothing on the server and mounts the component in the browser.
export default function Header(props: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <GlobalHeader {...props} onClick={() => {}} />;
}
