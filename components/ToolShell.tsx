"use client";

import type { ReactNode } from "react";
import SiteHeader from "./SiteHeader";

export default function ToolShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", width: "100%" }}>
      <SiteHeader />
      {children}
    </div>
  );
}