import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function SiteLayout({ children }) {
  return (
    <div className="relative overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-wine-800 via-wine-950 to-[#24060d]" />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
