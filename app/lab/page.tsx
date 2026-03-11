export default function LabPage() {
  return (
    <main className="solace-page-shell">
      <section className="space-y-5">
        <div className="solace-page-pill">Human Behaviour Lab</div>

        <h1 className="solace-hero-title max-w-5xl">
          Patterns behind the questions people ask online.
        </h1>

        <p className="solace-body">
          One interesting behaviour that keeps appearing online is how often
          people do not search for information alone. They search for relief,
          permission, and a way to reduce internal noise.
        </p>
      </section>

      <section className="mt-12">
        <div className="solace-surface-neutral p-8">
          <div className="grid max-w-3xl gap-4">
            <h2 className="text-[1.85rem] font-semibold leading-[1.06] tracking-[-0.04em] text-neutral-900">
              What Solace is studying
            </h2>

            <p className="text-[1.03rem] leading-8 text-neutral-600">
              Decision fatigue. Overthinking loops. Competing priorities.
              Emotional friction. Solace turns those patterns into calm digital
              environments that help people think more clearly.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}