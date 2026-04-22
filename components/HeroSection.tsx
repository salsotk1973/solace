export function HeroSection() {
  return (
    <section
      className="relative flex items-start justify-center overflow-hidden px-6 pt-[12vh] pb-12 md:pt-[200px] md:pb-16"
    >
      <h1 className="sr-only">
        Mental clarity tools for anxiety, focus, and overwhelm
      </h1>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="overflow-visible md:overflow-visible pt-1 md:pt-0 md:pb-1">
          <div
            className="h-l1 text-[36px] md:text-[64px] font-light leading-[1.08] md:leading-[1.0] text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            When your mind won't{" "}settle,
          </div>
        </div>

        <div className="mt-1 overflow-visible md:overflow-visible md:mt-2 pt-1 md:pt-0 md:pb-2">
          <div
            className="h-l2 text-[36px] md:text-[64px] italic font-light leading-[1.08] md:leading-[1.0] text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            it's hard to think clearly.
          </div>
        </div>

        <p className="h-sub mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/70 [font-family:var(--font-jost)] md:text-lg">
          Solace helps you find the next right step —
          through thought, not noise.
        </p>
      </div>
    </section>
  );
}
