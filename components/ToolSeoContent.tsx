import type { ReactNode } from "react";

export function ToolSeoContent({
  h1,
  children,
}: {
  h1: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[680px] px-6 pb-24 pt-16">
      <h1
        className="mb-8 font-light leading-snug text-white/90"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
          letterSpacing: "-0.01em",
        }}
      >
        {h1}
      </h1>
      <div
        className="space-y-5 text-base leading-relaxed text-white/60"
        style={{ fontFamily: "Jost, system-ui, sans-serif" }}
      >
        {children}
      </div>
    </section>
  );
}

export function SeoH2({ children }: { children: ReactNode }) {
  return (
    <h2
      className="mb-3 mt-10 font-light text-white/80"
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "1.5rem",
      }}
    >
      {children}
    </h2>
  );
}

export function SeoDisclaimer({ children }: { children: ReactNode }) {
  return (
    <p
      className="mt-12 border-t pt-6 text-xs text-white/65"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      {children}
    </p>
  );
}
