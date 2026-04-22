export function HeroSection() {
  return (
    <section
      className="relative min-h-[62vh] md:min-h-[82vh] flex items-center justify-center overflow-hidden px-6"
    >
      <h1 className="sr-only">
        Mental clarity tools for anxiety, focus, and overwhelm
      </h1>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="overflow-hidden">
          <div
            className="h-l1 text-[40px] md:text-[72px] font-light leading-[1.0] text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            When your mind won’t settle,
          </div>
        </div>

        <div className="mt-1 overflow-hidden md:mt-2">
          <div
            className="h-l2 text-[40px] md:text-[72px] italic font-light leading-[1.0] text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            it’s hard to think clearly.
          </div>
        </div>

        <p className="h-sub mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/70 [font-family:var(--font-jost)] md:text-lg">
          Solace helps you find the next right step —
          through thought, not noise.
        </p>
        <a
          href="/tools/breathing"
          className="hero-cta group mt-10 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] [font-family:var(--font-jost)] font-normal transition-all duration-200 ease-out"
          style={{ color: "rgba(60,192,212,0.85)" }}
        >
          Begin with Breathing
          <span
            aria-hidden="true"
            className="transition-transform duration-200 ease-out group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </div>
    </section>
  );
}
