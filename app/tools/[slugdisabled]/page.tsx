import { notFound } from "next/navigation";

import ToolIntro from "@/components/tool-interface/ToolIntro";
import ThreadContainer from "@/components/tool-interface/ThreadContainer";
import { getToolDefinition, TOOL_REGISTRY } from "@/lib/tools/tool-registry";
import PageShell from "@/components/PageShell";
import BgFlat from "@/components/backgrounds/BgFlat";

type ToolPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const TOOL_ALIASES: Record<string, keyof typeof TOOL_REGISTRY> = {
  "overthinking-breaker": "overthinking-reset",
  "clear-your-mind": "overthinking-reset",
  "i-cant-decide": "clarity",
  "everything-feels-noisy": "decision-filter",
};

function resolveToolSlug(slug: string): keyof typeof TOOL_REGISTRY | null {
  if (slug in TOOL_REGISTRY) {
    return slug as keyof typeof TOOL_REGISTRY;
  }

  if (slug in TOOL_ALIASES) {
    return TOOL_ALIASES[slug];
  }

  return null;
}

function getToolAccentClasses(
  colorToken: "clarity" | "overthinking" | "decision",
) {
  switch (colorToken) {
    case "clarity":
      return "border-[rgba(154,188,235,0.55)] bg-[rgba(232,241,255,0.45)]";
    case "overthinking":
      return "border-[rgba(166,199,177,0.55)] bg-[rgba(236,245,239,0.5)]";
    case "decision":
      return "border-[rgba(186,172,230,0.58)] bg-[rgba(241,237,252,0.52)]";
    default:
      return "border-neutral-200 bg-white/80";
  }
}

export async function generateStaticParams() {
  return [
    ...Object.keys(TOOL_REGISTRY).map((slug) => ({ slug })),
    ...Object.keys(TOOL_ALIASES).map((slug) => ({ slug })),
  ];
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const resolvedSlug = resolveToolSlug(slug);

  if (!resolvedSlug) {
    notFound();
  }

  const tool = getToolDefinition(resolvedSlug);
  const accentClasses = getToolAccentClasses(tool.colorToken);

  return (
    <PageShell particles={false}>
      <BgFlat>
        <div className="solace-page-shell">
          <div className={`rounded-[32px] border p-6 md:p-8 ${accentClasses}`}>
            <ToolIntro title={tool.title} subtitle={tool.subtitle} />
            <ThreadContainer toolSlug={tool.slug} />
          </div>
        </div>
      </BgFlat>
    </PageShell>
  );
}
