"use client";

import { useState, useEffect } from "react";

export default function UpgradeBanner({ show }: { show: boolean }) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div
      style={{
        display:        "flex",
        justifyContent: "center",
        marginBottom:   "40px",
      }}
    >
      <p
        style={{
          fontFamily:    "'Jost', sans-serif",
          fontWeight:    400,
          fontSize:      "13px",
          letterSpacing: "0.02em",
          color:         "rgba(195,178,255,0.88)",
          background:    "rgba(100,80,180,0.12)",
          border:        "0.5px solid rgba(140,120,220,0.22)",
          borderRadius:  "100px",
          padding:       "10px 24px",
          margin:        0,
          textAlign:     "center",
        }}
      >
        You&apos;re now on Solace Pro. Welcome.
      </p>
    </div>
  );
}
