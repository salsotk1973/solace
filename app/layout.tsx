import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/solace/SiteShell";
import SolaceStyles from "@/components/solace/SolaceStyles";

export const metadata: Metadata = {
  title: "Solace",
  description: "Calm digital tools designed to reduce noise and guide people toward clarity.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SolaceStyles />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}