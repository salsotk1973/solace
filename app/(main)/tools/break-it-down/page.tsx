import BreakItDownClient from "./BreakItDownClient";
import { ToolSeoContent, SeoH2, SeoDisclaimer } from "@/components/ToolSeoContent";

export const metadata = {
  title: "Break It Down — Overwhelm Tool Online | Solace",
  description:
    "When something feels too large to begin, Break It Down turns it into steps you can actually take. Free for one session. No sign-up required.",
  openGraph: {
    title: "Break It Down — Solace",
    description:
      "Turn overwhelming tasks into steps you can actually take. Free AI-guided tool.",
    url: "https://solace.digital/tools/break-it-down",
  },
};

export default function BreakItDownPage() {
  return (
    <>
      <BreakItDownClient />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Break It Down — Solace",
            description:
              "AI-guided tool to turn overwhelming tasks into manageable steps.",
            applicationCategory: "HealthApplication",
            operatingSystem: "Web browser",
            offers: {
              "@type": "Offer",
              price: "9",
              priceCurrency: "AUD",
              billingPeriod: "P1M",
            },
          }),
        }}
      />

      <ToolSeoContent h1="Break It Down — from overwhelm to actionable steps">
        <p>
          Overwhelm often means the task is not actually too big, it is too
          undefined. When your brain cannot see edges, it treats the whole problem as
          immediate and urgent. Break It Down helps convert ambiguity into sequence.
        </p>
        <p>
          Once the next step is specific, momentum returns. You do not need a full
          life plan. You need the first clear move.
        </p>
        <SeoH2>Why breaking tasks down works</SeoH2>
        <p>
          Large goals overload working memory. Smaller steps reduce cognitive demand
          and resistance. Progress becomes measurable, which improves motivation and
          confidence.
        </p>
        <SeoH2>How to use Break It Down</SeoH2>
        <p>
          Describe what feels overwhelming in plain language. Let the tool structure
          it into practical steps. Keep each step small enough to complete in one
          sitting. If a step still feels heavy, split it again.
        </p>
        <SeoH2>When to use this tool</SeoH2>
        <p>
          Use Break It Down when starting projects, recovering from backlog stress,
          or returning after avoidance. It is especially useful when you know what
          matters but cannot begin.
        </p>
        <SeoDisclaimer>
          This tool provides reflective support only. It is not professional project,
          legal, or medical advice. Seek qualified support for high-risk situations.
        </SeoDisclaimer>
      </ToolSeoContent>
    </>
  );
}
