import type { Route } from "./+types/home";
import { HeaderSection } from "~/components/HomeSections/HeaderSection/HeaderSection";
import { LatestFromKotlinSection } from "~/components/HomeSections/LatestFromKotlinSection/LatestFromKotlinSection";
import { WhyKotlinSection } from "~/components/HomeSections/WhyKotlinSection/WhyKotlinSection";
import { UsageSection } from "~/components/HomeSections/UsageSection/UsageSection";
import { StartSection } from "~/components/HomeSections/StartSection/StartSection";

import "./home.scss";

// data from head.html & base.html:
export const meta: Route.MetaFunction = () => [
  { title: "Kotlin Programming Language" },
  // Open Graph - used by Facebook, LinkedIn, Slack, Telegram, WhatsApp, Discord
  // to render a link preview card in a post etc.
  { property: "og:title", content: "Kotlin Programming Language" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://kotlinlang.org/" },
  {
    property: "og:image",
    content: "https://kotlinlang.org/assets/images/open-graph/general.png",
  },
  {
    property: "og:description",
    content:
      "Kotlin is a modern programming language that makes developers happier.",
  },
  { property: "og:site_name", content: "Kotlin" },
  // Twitter - same
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:site", content: "@kotlin" },
  { name: "twitter:title", content: "Kotlin Programming Language" },
  {
    name: "twitter:description",
    content:
      "Kotlin is a modern programming language that makes developers happier.",
  },
  {
    name: "twitter:image:src",
    content: "https://kotlinlang.org/assets/images/twitter/general.png",
  },
];

export default function Home() {
  return (
    <div className="overview-page">
      <HeaderSection />
      <LatestFromKotlinSection />
      <WhyKotlinSection />
      <UsageSection />
      <StartSection />
    </div>
  );
}

// default export can be only one per file
// import as Home (no {})

// export (no default) - can be multiple in one file
// import {ReusableComponent}
