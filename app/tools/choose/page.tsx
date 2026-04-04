import ChooseClient from "./ChooseClient";
import { ToolSeoContent, SeoH2, SeoDisclaimer } from "@/components/ToolSeoContent";

export const metadata = {
  title: "Decision-Making Tool Online — Can't Decide? Try Choose | Solace",
  description:
    "Stuck on a decision? Choose helps you see your options clearly, cut through noise, and find what you actually want. Free to use.",
  openGraph: {
    title: "Choose — Decision-Making Tool | Solace",
    description:
      "When you can't decide, Choose helps you see clearly. Free AI-guided decision tool.",
    url: "https://solace.digital/tools/choose",
  },
};

export default function ChoosePage() {
  return (
    <>
      <ChooseClient />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Choose — Solace",
            description:
              "AI-guided decision-making tool to find clarity when you are stuck.",
            applicationCategory: "HealthApplication",
            operatingSystem: "Web browser",
            offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
          }),
        }}
      />

      <ToolSeoContent h1="Choose — decision clarity when you feel stuck">
        <p>
          Decision paralysis is usually not a lack of intelligence. It is a lack of
          signal. When both options feel loaded, your mind keeps simulating outcomes
          without landing. Choose helps you separate facts, fears, and priorities.
        </p>
        <p>
          The goal is not a perfect answer. The goal is a clearer answer you can
          trust enough to act on.
        </p>
        <SeoH2>Why decision tools help</SeoH2>
        <p>
          Most difficult decisions are emotional plus practical. If you only analyse
          logic, you miss what matters. If you only follow emotion, you may miss
          consequences. A structured reflection lets both sides be seen at the same
          time.
        </p>
        <SeoH2>How to use Choose</SeoH2>
        <p>
          State the decision in one sentence. Name the options clearly. Then test
          each option against your values, likely outcomes, and what future-you would
          most respect. Clarity often arrives as reduction: one option starts to feel
          cleaner.
        </p>
        <SeoH2>When to use this tool</SeoH2>
        <p>
          Use Choose for career moves, relationship crossroads, financial decisions,
          and any moment where indecision is draining your energy. Decide, then
          commit to a next step.
        </p>
        <SeoDisclaimer>
          This tool provides reflective support only. It is not legal, financial, or
          medical advice. For high-stakes decisions, consult an appropriate
          professional.
        </SeoDisclaimer>
      </ToolSeoContent>
    </>
  );
}
