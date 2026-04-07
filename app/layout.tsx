import type { Metadata } from "next";
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
  return (
    <html lang="en" style={{ backgroundColor: "#090d14", colorScheme: "dark" }}>
      <head>
        <meta name="theme-color" content="#090d14" />
        <meta name="color-scheme" content="dark" />
        <style>{`html,body{background:#090d14 !important;}body{margin:0;}`}</style>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.style.backgroundColor='#090d14';document.documentElement.style.colorScheme='dark';if(document.body){document.body.style.backgroundColor='#090d14';}",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: "#090d14" }}>
        <div style={{ minHeight: "100vh", backgroundColor: "#090d14" }}>
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
