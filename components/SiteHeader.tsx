import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/tools", label: "Tools" },
  { href: "/principles", label: "Principles" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  return (
    <header
      style={{
        width: "min(1120px, calc(100% - 40px))",
        margin: "0 auto",
        paddingTop: 22,
        paddingBottom: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      <Link
        href="/"
        aria-label="Solace home"
        style={{
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none",
          flex: "0 0 auto",
        }}
      >
        <Image
          src="/brand/solace-logo.png"
          alt="Solace"
          width={320}
          height={92}
          priority
          style={{
            width: "220px",
            height: "auto",
            display: "block",
            filter: "drop-shadow(0 10px 22px rgba(122, 108, 221, 0.14))",
          }}
        />
      </Link>

      <nav
        aria-label="Primary"
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 44,
              padding: "0 18px",
              borderRadius: 999,
              textDecoration: "none",
              color: "#2f3852",
              fontSize: "0.98rem",
              fontWeight: 500,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(246,246,251,0.9) 100%)",
              border: "1px solid rgba(120, 128, 160, 0.14)",
              boxShadow:
                "0 12px 30px rgba(111, 118, 150, 0.08), inset 0 1px 0 rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}