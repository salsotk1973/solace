"use client";

import { useState } from "react";

interface Props {
  hovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function BillingPortalButton({ hovered, onMouseEnter, onMouseLeave }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(true);
        setLoading(false);
      }
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  if (error) {
    return (
      <span
        style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 300,
          fontSize:   "12px",
          color:      "rgba(200,120,100,0.65)",
        }}
      >
        No billing account linked yet. Complete a purchase first.
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background:    "transparent",
        border:        "none",
        cursor:        loading ? "wait" : "pointer",
        padding:       0,
        fontFamily:    "'Jost', sans-serif",
        fontWeight:    400,
        fontSize:      "12px",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color:         hovered ? "rgba(215,200,255,0.7)" : "rgba(140,130,185,0.45)",
        transition:    "color 0.3s ease",
        opacity:       loading ? 0.6 : 1,
      }}
    >
      {loading ? "Loading..." : "Manage subscription →"}
    </button>
  );
}
