import SleepOrb    from "@/components/sleep/SleepOrb";
import { getCurrentUser } from "@/lib/auth";
import PageShell from "@/components/PageShell";
import { ToolSeoContent, SeoH2, SeoDisclaimer } from "@/components/ToolSeoContent";

export const metadata = {
  title: "Sleep Wind-Down Routine Online | Bedtime Relaxation — Solace",
  description: "A guided sleep wind-down routine to calm your mind before bed. Free bedtime relaxation tool. Better sleep starts with a better evening.",
  openGraph: {
    title: "Sleep Wind-Down — Solace",
    description: "Guided bedtime routine to quiet your mind for sleep.",
    url: "https://solace.digital/tools/sleep-wind-down",
  },
};

export default async function SleepPage() {
  const { userId } = await getCurrentUser();

  return (
    <PageShell>
      <SleepOrb userId={userId ?? null} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Sleep Wind-Down — Solace",
            applicationCategory: "HealthApplication",
            operatingSystem: "Web browser",
            offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
          }),
        }}
      />

      <ToolSeoContent h1="Sleep wind-down routine — calm your mind before bed">
        <p>Most sleep problems are not sleep problems. They are evening problems. What happens in the hour before bed — what you look at, what you think about, what you leave unresolved — lands in the bedroom with you. A wind-down routine gives your nervous system permission to stop.</p>
        <SeoH2>Why your mind races at bedtime</SeoH2>
        <p>The prefrontal cortex does not have an off switch. During the day, activity keeps it occupied. At night, in the silence, it surfaces everything it has been holding. The solution is not to fight the thoughts — it is to create conditions where they lose their urgency. Slower breathing and a deliberate transition signal to the brain that the day is done.</p>
        <SeoH2>How the wind-down routine works</SeoH2>
        <p>This tool walks you through a sequence: a short breathing exercise, a brief body scan, and an intention-setting moment to close the day. The full sequence takes about ten minutes. Most people notice a difference within three to four nights of consistency.</p>
        <SeoH2>Building a sleep routine that lasts</SeoH2>
        <p>The most effective sleep routines are predictable. When your brain recognises a familiar sequence, it begins preparing for sleep before you have finished the routine. Start at the same time each night — even if you do not feel tired. Your body will learn.</p>
        <SeoDisclaimer>This tool provides reflective support only. Persistent sleep difficulties may have underlying causes — please speak with a healthcare professional if sleep problems significantly affect your life.</SeoDisclaimer>
      </ToolSeoContent>
    </PageShell>
  );
}
