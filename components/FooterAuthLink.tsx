"use client";
import Link from "next/link";
import { useAuth, SignOutButton } from "@clerk/nextjs";
import type { CSSProperties } from "react";

const navLinkStyle: CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontWeight: 300,
  fontSize: "13px",
  color: "rgba(255,255,255,0.60)",
  textDecoration: "none",
  transition: "color 200ms ease",
};

const buttonStyle: CSSProperties = {
  ...navLinkStyle,
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
};

export default function FooterAuthLink() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return (
      <SignOutButton redirectUrl="/">
        <button className="footer-nav-link" style={buttonStyle}>
          Sign out
        </button>
      </SignOutButton>
    );
  }

  return (
    <Link href="/sign-in" className="footer-nav-link" style={navLinkStyle}>
      Sign in
    </Link>
  );
}
