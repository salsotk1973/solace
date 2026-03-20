import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solace",
  description: "A calm digital space to step out of noise and regain clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}