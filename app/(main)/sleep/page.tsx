import SleepOrb    from "@/components/sleep/SleepOrb";
import { getCurrentUserId } from "@/lib/auth-user";
import PageShell from "@/components/PageShell";
import { ToolSeoContent, SeoH2, SeoDisclaimer } from "@/components/ToolSeoContent";

export const metadata = {
  title: "Sleep Better | Evening Wind-Down for Racing Minds — Solace",
  description:
    "An evening wind-down to help you sleep better when your mind won't stop. Guided bedtime support for stress, racing thoughts, and fragile sleep.",
  openGraph: {
    title: "Sleep Wind-Down — Solace",
    description:
      "Sleep better with an evening wind-down that helps shift your nervous system away from vigilance before bed.",
    url: "https://solace.digital/tools/sleep-wind-down",
  },
};

export default async function SleepPage() {
  const userId = await getCurrentUserId();

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

      <ToolSeoContent h1="Sleep better — evening wind-down when your mind won&apos;t quiet">
        <p>
          When you lie down, your mind lights up. Work deadlines, worries,
          decisions unmade, conversations replayed. Your body is
          exhausted but your brain won&apos;t stop. Sleep wind-down isn&apos;t
          about forcing sleep. It&apos;s about creating the conditions where
          sleep can arrive naturally by shifting your nervous system away from
          vigilance.
        </p>
        <p>
          Rest is a skill, not a luxury. When life is full, sleep is often the
          first thing we sacrifice. This tool is here to remind you that sleep
          is the foundation everything else rests on.
        </p>
        <SeoH2>Why sleep becomes difficult under stress and how to reclaim it</SeoH2>
        <p>
          Stress and high responsibility both fragment sleep. Your brain stays
          semi-awake, scanning for threats. A guided wind-down sequence signals
          safety, lowers stress hormones, and helps your mind release the
          day&apos;s weight before you lie down.
        </p>
        <SeoH2>How to use the sleep wind-down</SeoH2>
        <p>
          Use it in the 30 minutes before bed. Dim lights. No screens except
          Solace. Let the sequence guide you through slow breathing, body
          awareness, and mental letting-go. The goal isn&apos;t entertainment,
          it&apos;s creating a transition from doing to being.
        </p>
        <SeoH2>When to use this tool</SeoH2>
        <p>
          When you&apos;re lying awake replaying conversations. When work
          thoughts won&apos;t stop. When you know you need rest but your mind
          won&apos;t quiet. When sleep debt is building and you need tonight to
          be different. When rest feels like the most radical thing you can do.
        </p>
        <SeoDisclaimer>
          This tool provides relaxation guidance only. It is not medical advice
          for sleep disorders. If sleep problems persist for weeks despite good
          sleep habits, consult a healthcare provider. If you experience mental
          health crisis, contact a qualified professional.
        </SeoDisclaimer>
      </ToolSeoContent>
    </PageShell>
  );
}
