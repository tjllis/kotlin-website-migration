import type { Route } from "./+types/home";
import { HeaderSection } from "~/components/HomeSections/HeaderSection/HeaderSection";
import { LatestFromKotlinSection } from "~/components/HomeSections/LatestFromKotlinSection/LatestFromKotlinSection";
import { WhyKotlinSection } from "~/components/HomeSections/WhyKotlinSection/WhyKotlinSection";
import { UsageSection } from "~/components/HomeSections/UsageSection/UsageSection";
import { StartSection } from "~/components/HomeSections/StartSection/StartSection";

import "./home.scss";

export const meta: Route.MetaFunction = () => [
  { title: "Kotlin Programming Language" },
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
