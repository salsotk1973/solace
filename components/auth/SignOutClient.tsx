"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignOutClient() {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    void signOut({ redirectUrl: "/" }).catch(() => {
      router.replace("/");
    });
  }, [router, signOut]);

  return (
    <section
      style={{
        width: "100%",
        maxWidth: "520px",
        padding: "40px 36px",
        borderRadius: "24px",
        border: "0.5px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 400,
          fontSize: "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(185,175,220,0.55)",
          margin: "0 0 14px",
        }}
      >
        Sign out
      </p>
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: "clamp(34px, 4.5vw, 46px)",
          lineHeight: 1.1,
          color: "rgba(240,234,255,0.94)",
          margin: "0 0 12px",
        }}
      >
        Signing you out
      </h1>
      <p
        style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 300,
          fontSize: "15px",
          lineHeight: 1.7,
          color: "rgba(195,188,230,0.78)",
          margin: 0,
        }}
      >
        One moment while we close your session.
      </p>
    </section>
  );
}
