export function HeroSection() {
  return (
    <section
      className="relative min-h-[80vh] md:min-h-[82vh] flex items-center justify-center overflow-hidden px-6"
    >
      <h1 className="sr-only">
        Mental clarity tools for anxiety, focus, and overwhelm
      </h1>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="overflow-hidden">
          <div
            className="h-l1 text-[45px] md:text-[72px] font-light leading-[0.95] text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            When your mind won’t settle,
          </div>
        </div>

        <div className="mt-1 overflow-hidden md:mt-2">
          <div
            className="h-l2 text-[45px] md:text-[72px] italic font-light leading-[0.95] text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            it’s hard to think clearly.
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
