import "./globals.css"
import SiteHeader from "@/components/SiteHeader"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>

        <SiteHeader />

        {/* GLOBAL PAGE WIDTH */}
        <main
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "40px 24px",
          }}
        >
          {children}
        </main>

      </body>
    </html>
  )
}