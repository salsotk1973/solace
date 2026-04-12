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

    <ToolSeoContent h1="Choose — decision clarity when life feels too loud to think straight">
  <p>
    When you've been going back and forth for weeks, the problem isn't that you
    don't know enough. It's that everything feels equally weighted. Choose helps
    you separate what's fear, what's fact, and what actually matters to you.
  </p>
  <p>
    You don't need a perfect answer. You need a clearer one — one you can trust
    enough to take the next step.
  </p>

  <SeoH2>What to bring here</SeoH2>
  <p>
    Bring the decision that keeps you awake. Career change, relationship
    crossroads, a life chapter ending or beginning. Write it as a question:
    "Should I leave?" "Should I say yes?" Start there. You don't need to
    explain everything — just the question that won't leave you alone.
  </p>

  <SeoH2>Why you can't think your way out of this</SeoH2>
  <p>
    Hard decisions are never just logical. If they were, you'd have decided
    already. What makes them hard is that emotion and practicality are pulling
    in different directions — and most tools only address one side. Choose holds
    both at once.
  </p>

  <SeoH2>How Choose helps you move forward</SeoH2>
  <p>
    Choose won't tell you what to do. It helps you hear yourself more clearly —
    what you're afraid of, what you actually value, and what future-you will
    respect. Most people find that clarity arrives quietly: one path simply
    starts to feel more like them than the other.
  </p>

  <SeoH2>When this tool is for you</SeoH2>
  <p>
    If you're burnt out, overwhelmed, or standing at a crossroads — and the
    people around you are too close to it to help — this is the space to think
    it through. Private, calm, without judgement. Use it once and see what
    surfaces.
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
