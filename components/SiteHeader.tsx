"use client";

import Link from "next/link";

const navItems = [
  { label: "Tools", href: "/tools" },
  { label: "Principles", href: "/principles" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
];

export default function SiteHeader() {
  return (
    <header className="relative z-40 w-full">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 pt-6 sm:px-8 lg:px-10">
        <Link href="/" className="group inline-flex" aria-label="Solace home">
          <span
            className="
              text-[48px] font-medium tracking-[-0.06em] sm:text-[58px] md:text-[64px]
              text-[rgba(136,166,255,0.98)]
              drop-shadow-[0_0_18px_rgba(116,146,255,0.20)]
              transition-all duration-300
              group-hover:-translate-y-[1px]
              group-hover:text-[rgba(168,194,255,1)]
              group-hover:drop-shadow-[0_0_30px_rgba(132,166,255,0.36)]
            "
          >
            SOLACE
          </span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="
                group relative inline-flex min-h-[52px] items-center justify-center overflow-hidden rounded-full
                px-5 text-[14px] font-medium text-white/94
                transition duration-200
                hover:-translate-y-[2px] hover:scale-[1.02] hover:text-white
              "
              style={{
                border: "1px solid rgba(190,210,255,0.16)",
                background: `
                  linear-gradient(180deg,
                    rgba(232,238,255,0.16) 0%,
                    rgba(156,176,232,0.10) 36%,
                    rgba(74,82,124,0.20) 100%
                  ),
                  radial-gradient(circle at 22% 18%,
                    rgba(126,162,255,0.22) 0%,
                    transparent 34%
                  ),
                  radial-gradient(circle at 80% 84%,
                    rgba(124,108,248,0.16) 0%,
                    transparent 36%
                  ),
                  linear-gradient(180deg,
                    rgba(116,148,255,0.08) 0%,
                    rgba(116,148,255,0.04) 46%,
                    rgba(108,94,206,0.07) 100%
                  )
                `,
                boxShadow:
                  "0 14px 30px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -10px 20px rgba(255,255,255,0.012)",
              }}
            >
              <span
                className="pointer-events-none absolute inset-0 rounded-full opacity-90 transition duration-200 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 24%, rgba(255,255,255,0.02) 42%, rgba(255,255,255,0) 62%)",
                }}
              />
              <span
                className="pointer-events-none absolute left-[16%] right-[16%] top-0 h-px opacity-90 transition duration-200 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.26) 50%, transparent 100%)",
                }}
              />
              <span
                className="pointer-events-none absolute inset-0 rounded-full transition duration-200"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.035)",
                }}
              />
              <span
                className="pointer-events-none absolute left-1/2 bottom-[-14px] h-6 w-[74%] -translate-x-1/2 rounded-full opacity-90 blur-[14px] transition duration-200 group-hover:opacity-100 group-hover:scale-[1.03]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(136,166,255,0.26) 0%, rgba(136,166,255,0.08) 42%, transparent 74%)",
                }}
              />
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}