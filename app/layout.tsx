import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />

        <main
          style={{
            width: "100%",
            minHeight: "100vh",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}