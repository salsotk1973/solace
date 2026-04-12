import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#090d14" }}>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
