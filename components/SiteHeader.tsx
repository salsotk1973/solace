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
              className="group relative inline-flex min-h-[52px] items-center justify-center overflow-hidden rounded-full border px-5 text-[14px] font-medium text-white/92 backdrop-blur-[26px] transition duration-200 hover:-translate-y-[2px] hover:scale-[1.02] hover:text-white"
              style={{
                borderColor: "rgba(225,232,255,0.18)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.055))",
                boxShadow:
                  "0 18px 40px rgba(0,0,0,0.26), 0 0 28px rgba(160,176,255,0.10), inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -12px 24px rgba(255,255,255,0.03)",
              }}
            >
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(205,214,255,0.22)_0%,transparent_74%)] opacity-90 transition duration-200 group-hover:opacity-100" />
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.36)_0%,rgba(255,255,255,0.08)_34%,rgba(255,255,255,0)_58%)] opacity-85 transition duration-200 group-hover:opacity-100" />
              <span className="pointer-events-none absolute inset-[1px] rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] transition duration-200 group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]" />
              <span className="pointer-events-none absolute -bottom-7 left-1/2 h-14 w-[76%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(178,194,255,0.32)_0%,transparent_72%)] blur-2xl opacity-80 transition duration-200 group-hover:opacity-100" />
              <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 shadow-[0_0_0_1px_rgba(214,224,255,0.18),0_0_18px_rgba(184,198,255,0.22)] transition duration-200 group-hover:opacity-100" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}