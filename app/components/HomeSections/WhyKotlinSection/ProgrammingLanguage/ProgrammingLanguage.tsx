import { useState } from "react";
import cn from "clsx";
import { Button } from "@rescui/button";
import { useTextStyles } from "@rescui/typography";
import hljs from "highlight.js/lib/core";
import kotlin from "highlight.js/lib/languages/kotlin";
import { TabList, Tab, TabSeparator } from "@rescui/tab-list";

import { tabs } from "./data";
import "highlight.js/styles/github.css";
import "./styles.scss";

hljs.registerLanguage("kotlin", kotlin);

// removed Math.random() - it will be called twice - on server and on client
// this may cause inconsistency
const initialIndex = 0;

export function ProgrammingLanguage() {
  const textCn = useTextStyles();
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // return a colored <span> without a temp DOM element
  // or can also be done with useEffect (using a temp element):
  const highlighted = hljs.highlight(tabs[activeIndex].code, {
    language: "kotlin",
  }).value;

  return (
    <div className="kto-grid kto-grid-gap-32 kto-offset-top-96 kto-offset-top-md-48">
      <div className="kto-col-4 kto-col-md-12">
        <h3 className={textCn("rs-h2")}>
          Modern, concise and safe programming language
        </h3>
        <p className={cn(textCn("rs-text-2"), "kto-offset-top-32")}>
          Easy to pick up, so you can create powerful applications immediately.
        </p>
        <div className="kto-offset-top-32">
          <Button mode="outline" size="l" href="/docs/getting-started.html">
            Get started
          </Button>
        </div>
      </div>

      <div className="kto-col-8 kto-col-md-12">
        <TabList
          value={activeIndex}
          onChange={(v: number) => setActiveIndex(v)}
        >
          {tabs.map((tab, i) => (
            <Tab key={i}>{tab.title}</Tab>
          ))}
        </TabList>
        <TabSeparator />
        <pre className="programming-language__code kto-offset-top-16">
          <code
            className="hljs"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  );
}

// dangerouslySetInnerHTML injects a raw HTML string into the DOM, like el.innerHTML.
// "Dangerous" because React normally escapes HTML to prevent injecting malicious scripts —
// this skips that. Safe here since the string comes from hljs, not user input.
