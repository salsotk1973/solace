import Link from "next/link";

import StateEntryCard from "@/components/discovery/StateEntryCard";
import { getDiscoveryEntries } from "@/lib/tools/tool-discovery";
import { getToolDefinition } from "@/lib/tools/tool-registry";

export default function HomePage() {
  const entries = getDiscoveryEntries();

  return (
    <main className="solace-page-shell">
      <section className="space-y-6">
        <h1 className="solace-hero-title max-w-4xl">
          A calm place to clear your mind
        </h1>

        <p className="solace-body">Quiet tools for clearer thinking.</p>

        <div className="flex flex-wrap gap-4 pt-1">
          <Link href="/tools" className="solace-page-pill">
            Explore the tools
          </Link>

          <Link href="/principles" className="solace-page-pill">
            Read the principles
          </Link>
        </div>
      </section>

      <section className="mt-20">
        <div className="space-y-4">
          <h2 className="solace-section-title max-w-4xl">
            Start from how it feels
          </h2>

          <p className="solace-body">
            Begin with the state that feels closest.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => {
            const tool = getToolDefinition(entry.toolSlug);

            return (
              <StateEntryCard
                key={entry.id}
                href={`/tools/${entry.toolSlug}`}
                stateLabel={entry.stateLabel}
                supportingText={entry.supportingText}
                colorToken={tool.colorToken}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}