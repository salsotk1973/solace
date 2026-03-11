export default function AboutPage() {
  return (
    <main className="solace-page-shell">
      <section className="space-y-5">
        <div className="solace-page-pill">About Solace</div>

        <h1 className="solace-hero-title max-w-5xl">
          A calmer way to design digital help.
        </h1>

        <p className="solace-body">
          Solace exists to create simple digital environments that reduce noise
          and guide people toward clarity. Each tool is designed to feel
          supportive, spacious, and human.
        </p>
      </section>

      <section className="mt-12">
        <div
          className="
            rounded-[28px]
            border
            border-[rgba(214,214,214,0.82)]
            bg-[rgba(255,255,255,0.9)]
            p-8
            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
          "
        >
          <div className="grid gap-4 max-w-3xl">
            <h2 className="text-[1.85rem] font-semibold leading-[1.06] tracking-[-0.04em] text-neutral-900">
              What makes Solace different
            </h2>

            <p className="text-[1.03rem] leading-8 text-neutral-600">
              It is not built like a productivity dashboard. It is not trying to
              overwhelm people with inputs, numbers, and noise. It focuses on
              one calm question at a time.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}