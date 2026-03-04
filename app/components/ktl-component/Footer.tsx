import GlobalFooter from "@jetbrains/kotlin-web-site-ui/out/components/footer/index.js";

interface FooterProps {
  [props: string]: unknown;
}

export default function Footer(props: FooterProps) {
  return <GlobalFooter {...props} />;
}
