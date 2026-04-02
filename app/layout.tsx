import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";
import "../styles/tokens.css";

export const metadata: Metadata = {
  title: "Solace",
  description: "A calm digital space to step out of noise and regain clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const shell = (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {clerkConfigured ? <ClerkProvider>{shell}</ClerkProvider> : shell}
      </body>
    </html>
  );
}
