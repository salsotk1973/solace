import ClearYourMindClient from "./ClearYourMindClient";
import { ToolSeoContent, SeoH2, SeoDisclaimer } from "@/components/ToolSeoContent";

export const metadata = {
  title: "Clear Your Mind Online — Thought Journalling Tool | Solace",
  description:
    "When your thoughts won't stop circling, write them out. Solace helps you release, organise, and find what's actually there. Free to try.",
  openGraph: {
    title: "Clear Your Mind — Solace",
    description:
      "Release circling thoughts and find what's actually there. AI-guided thought journalling.",
    url: "https://solace.digital/tools/clear-your-mind",
  },
};

export default function ClearYourMindPage() {
  return (
    <>
      <ClearYourMindClient />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Clear Your Mind — Solace",
            description:
              "AI-guided thought journalling to release mental clutter and find clarity.",
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

      <ToolSeoContent h1="Clear your mind — untangle circling thoughts and find clarity">
        <p>
          When thoughts keep looping, clarity disappears. Writing them out is one of
          the fastest ways to lower mental load and see what is actually happening.
          Clear Your Mind helps you externalise what feels tangled, then reflect on it
          with structure.
        </p>
        <p>
          This is not about forcing positivity. It is about turning noise into
          signal, so you can identify what matters and what can be let go.
        </p>
        <SeoH2>Why thought journalling works</SeoH2>
        <p>
          Unwritten thoughts compete for attention. Once written, they become objects
          you can evaluate. That shift reduces cognitive pressure and improves
          decision quality. You move from emotional reactivity toward deliberate
          thinking.
        </p>
        <SeoH2>How to use Clear Your Mind</SeoH2>
        <p>
          Add the thoughts exactly as they appear. Keep them short and concrete. Once
          they are visible, look for themes, priorities, and what can be acted on
          next. One clear next step is better than ten vague intentions.
        </p>
        <SeoH2>When to use this tool</SeoH2>
        <p>
          Use it when your mind feels crowded, before difficult conversations, or
          when indecision is rising. Even a short session can create enough distance
          to think clearly again.
        </p>
        <SeoDisclaimer>
          This tool provides reflective support only. It is not medical or mental
          health advice. If you are in crisis, contact a qualified professional or a
          crisis service in your area.
        </SeoDisclaimer>
      </ToolSeoContent>
    </>
  );
}
