"use client";

import Container from "@/components/Container";
import SiteHeader from "@/components/SiteHeader";

type Props = {
  children: React.ReactNode;
};

export default function SiteShell({ children }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <SiteHeader />

      {/* Main page content */}
      <main
        style={{
          width: "100%",
          flex: 1,
        }}
      >
        <Container>{children}</Container>
      </main>
    </div>
  );
}