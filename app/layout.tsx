import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { PostHogProvider } from "@/components/PostHogProvider";
import { PostHogPageView } from "@/components/PostHogPageView";
import "./globals.css";
import "../styles/tokens.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.try-solace.app"),
  title: "Solace",
  description: "A calm digital space to step out of noise and regain clarity.",
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <PostHogProvider>
        <html lang="en" style={{ backgroundColor: "#090d14", colorScheme: "dark" }}>
          <head>
            <meta name="theme-color" content="#090d14" />
            <meta name="color-scheme" content="dark" />
            <style>{`html,body{background:#090d14 !important;}body{margin:0;}`}</style>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
              href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
              rel="stylesheet"
            />
          </head>
          <body style={{ backgroundColor: "#090d14" }}>
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
            {children}
          </body>
        </html>
      </PostHogProvider>
    </ClerkProvider>
  );
}