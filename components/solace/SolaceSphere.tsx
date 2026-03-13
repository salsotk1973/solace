"use client"

export default function SolaceSphere() {
  return (
    <div className="relative flex h-[420px] w-full items-center justify-center overflow-visible">
      {/* Overall soft ambient field */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="h-[260px] w-[260px] rounded-full blur-[90px] opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(190,160,255,0.35) 0%, rgba(190,160,255,0.18) 38%, rgba(190,160,255,0.06) 62%, transparent 78%)",
          }}
        />
      </div>

      {/* Sphere wrap */}
      <div className="relative h-[190px] w-[190px] md:h-[220px] md:w-[220px] lg:h-[250px] lg:w-[250px]">
        {/* Outer halo */}
        <div
          className="absolute inset-[-10%] rounded-full blur-[28px] opacity-80"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(234,224,255,0.36) 0%, rgba(202,176,255,0.18) 42%, rgba(186,160,255,0.08) 62%, transparent 78%)",
          }}
        />

        {/* Main sphere body */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(circle at 34% 28%,
                rgba(255,248,255,0.92) 0%,
                rgba(244,232,255,0.78) 10%,
                rgba(227,205,255,0.62) 22%,
                rgba(208,180,252,0.42) 34%,
                rgba(191,162,245,0.30) 48%,
                rgba(175,145,236,0.22) 62%,
                rgba(162,132,228,0.18) 76%,
                rgba(152,122,223,0.18) 100%
              )
            `,
            filter: "saturate(0.96)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -16px 30px rgba(148,120,220,0.12)",
          }}
        />

        {/* Subsurface volumetric veil */}
        <div
          className="absolute inset-[3%] rounded-full blur-[8px] opacity-85"
          style={{
            background: `
              radial-gradient(circle at 48% 44%,
                rgba(248,238,255,0.26) 0%,
                rgba(233,214,255,0.22) 20%,
                rgba(210,184,247,0.14) 38%,
                rgba(182,152,235,0.08) 58%,
                transparent 74%
              )
            `,
          }}
        />

        {/* Central nebula cluster */}
        <div
          className="absolute left-[27%] top-[27%] h-[46%] w-[46%] rounded-full blur-[14px] opacity-80"
          style={{
            background: `
              radial-gradient(circle at 50% 50%,
                rgba(255,249,255,0.82) 0%,
                rgba(247,231,255,0.55) 18%,
                rgba(228,203,255,0.30) 40%,
                rgba(197,166,245,0.14) 62%,
                transparent 78%
              )
            `,
          }}
        />

        {/* Secondary soft nebula bloom */}
        <div
          className="absolute left-[42%] top-[40%] h-[24%] w-[24%] rounded-full blur-[10px] opacity-70"
          style={{
            background: `
              radial-gradient(circle,
                rgba(255,250,255,0.62) 0%,
                rgba(239,220,255,0.30) 44%,
                transparent 76%
              )
            `,
          }}
        />

        {/* Faint particles */}
        <div className="absolute inset-0 overflow-hidden rounded-full opacity-70">
          <span className="absolute left-[40%] top-[38%] h-[2px] w-[2px] rounded-full bg-white/70 blur-[0.4px]" />
          <span className="absolute left-[47%] top-[45%] h-[2px] w-[2px] rounded-full bg-white/60 blur-[0.4px]" />
          <span className="absolute left-[52%] top-[42%] h-[1.5px] w-[1.5px] rounded-full bg-white/55 blur-[0.3px]" />
          <span className="absolute left-[57%] top-[48%] h-[2px] w-[2px] rounded-full bg-violet-50/70 blur-[0.4px]" />
          <span className="absolute left-[45%] top-[52%] h-[1.5px] w-[1.5px] rounded-full bg-white/50 blur-[0.3px]" />
          <span className="absolute left-[54%] top-[55%] h-[2px] w-[2px] rounded-full bg-violet-100/55 blur-[0.4px]" />
          <span className="absolute left-[36%] top-[49%] h-[1.5px] w-[1.5px] rounded-full bg-white/40 blur-[0.3px]" />
          <span className="absolute left-[61%] top-[39%] h-[1.5px] w-[1.5px] rounded-full bg-white/45 blur-[0.3px]" />
          <span className="absolute left-[50%] top-[34%] h-[1.5px] w-[1.5px] rounded-full bg-violet-50/45 blur-[0.3px]" />
        </div>

        {/* Soft edge bloom */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.08), inset 0 0 22px rgba(255,255,255,0.10), 0 0 28px rgba(212,186,255,0.16)",
          }}
        />

        {/* Bottom underside tint */}
        <div
          className="absolute bottom-[2%] left-[18%] h-[18%] w-[64%] rounded-full blur-[14px] opacity-55"
          style={{
            background:
              "radial-gradient(circle, rgba(155,121,226,0.34) 0%, rgba(155,121,226,0.12) 48%, transparent 78%)",
          }}
        />
      </div>
    </div>
  )
}