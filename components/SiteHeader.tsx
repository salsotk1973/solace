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
          <span className="text-[48px] font-medium tracking-[-0.055em] text-[rgba(150,170,240,0.94)] drop-shadow-[0_0_18px_rgba(150,170,255,0.16)] transition duration-300 group-hover:text-[rgba(196,210,255,0.98)] group-hover:drop-shadow-[0_0_34px_rgba(180,198,255,0.3)] sm:text-[58px] md:text-[64px]">
            SOLACE
          </span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative inline-flex min-h-[52px] items-center justify-center overflow-hidden rounded-full border px-5 text-[14px] font-medium text-white/92 transition duration-200 hover:-translate-y-[2px] hover:scale-[1.02] hover:text-white"
              style={{
                borderColor: "rgba(225,232,255,0.18)",
                background: `
                  linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(210,216,232,0.10) 48%, rgba(120,128,150,0.10) 100%),
                  linear-gradient(135deg, rgba(236,240,255,0.08) 0%, rgba(255,255,255,0.03) 28%, rgba(255,255,255,0.015) 52%, rgba(255,255,255,0) 76%)
                `,
                boxShadow:
                  "0 18px 40px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -10px 18px rgba(255,255,255,0.025)",
              }}
            >
              <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(205,214,255,0.18)_0%,transparent_72%)] opacity-90 transition duration-200 group-hover:opacity-100" />
              <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.07)_34%,rgba(255,255,255,0)_58%)] opacity-85 transition duration-200 group-hover:opacity-100" />
              <span className="pointer-events-none absolute inset-[1px] rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] transition duration-200 group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]" />
              <span className="pointer-events-none absolute inset-x-[18%] top-0 h-[1px] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.34)_50%,transparent_100%)] opacity-90" />
              <span className="pointer-events-none absolute inset-x-[22%] bottom-0 h-[1px] bg-[linear-gradient(90deg,transparent_0%,rgba(188,198,255,0.14)_50%,transparent_100%)] opacity-80" />
              <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 shadow-[0_0_0_1px_rgba(214,224,255,0.18)] transition duration-200 group-hover:opacity-100" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}