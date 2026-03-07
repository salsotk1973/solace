import Link from "next/link";

export default function SiteHeader() {
  return (
    <header
      style={{
        width: "min(1120px, calc(100% - 32px))",
        margin: "0 auto",
        paddingTop: 18,
        paddingBottom: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          padding: "18px 28px",
          borderRadius: 999,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,249,255,0.94) 100%)",
          border: "1px solid rgba(255,255,255,0.98)",
          boxShadow:
            "0 28px 70px rgba(90,100,160,0.20), 0 8px 22px rgba(90,100,160,0.12), inset 0 1px 0 rgba(255,255,255,1)",
          textDecoration: "none",
          color: "#4a5876",
          backdropFilter: "blur(14px)",
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            background:
              "linear-gradient(135deg, #8d8cff 0%, #b29df6 100%)",
            boxShadow:
              "0 0 0 6px rgba(141,140,255,0.12), 0 8px 18px rgba(125,141,255,0.34)",
            flex: "0 0 auto",
          }}
        />

        <span
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          Solace
        </span>
      </Link>

      <nav
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Link href="/tools" className="solace-nav-link">
          Tools
        </Link>

        <Link href="/principles" className="solace-nav-link">
          Principles
        </Link>

        <Link href="/lab" className="solace-nav-link">
          Lab
        </Link>

        <Link href="/about" className="solace-nav-link">
          About
        </Link>
      </nav>
    </header>
  );
}