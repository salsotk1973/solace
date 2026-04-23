"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import SiteHeaderAuthControls from "@/components/SiteHeaderAuthControls";

type NavItem = {
  label: string;
  href: string;
};

export default function SiteHeaderMobileMenu({
  navItems,
  isSignedIn,
}: {
  navItems: NavItem[];
  isSignedIn: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const drawer = (
    <div
      className="md:hidden"
      style={{
        position: "fixed",
        top: "80px",
        left: 0,
        right: 0,
        zIndex: 79,
        overflow: "hidden",
        maxHeight: menuOpen ? "480px" : "0",
        transition: "max-height 0.42s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: menuOpen ? "auto" : "none",
        background: "rgba(9,13,20,0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "8px 24px 28px",
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
        }}
      >
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className="site-header-mobile-link"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              letterSpacing: "0.02em",
              color: "rgba(215,210,240,0.82)",
              textDecoration: "none",
              padding: "14px 0",
              borderBottom: "0.5px solid rgba(255,255,255,0.05)",
              transition: "color 200ms ease",
            }}
          >
            {item.label}
          </Link>
        ))}

        <div
          style={{
            height: "0.5px",
            background: "rgba(255,255,255,0.08)",
            margin: "16px 0",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <SiteHeaderAuthControls
            mobile
            isSignedIn={isSignedIn}
            onNavigate={() => setMenuOpen(false)}
          />
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Hamburger — mobile only, absolutely positioned, same element in both states */}
      <button
        className="flex items-center justify-center md:hidden"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        style={{
          position: "absolute",
          right: "16px",
          top: "40px",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px",
          width: "48px",
          height: "48px",
          zIndex: 3,
          fontSize: "30px",
          lineHeight: 1,
          color: "rgba(220,215,245,0.85)",
          transition: "color 200ms ease",
          pointerEvents: "auto",
        }}
      >
        {menuOpen ? "×" : "≡"}
      </button>

      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
