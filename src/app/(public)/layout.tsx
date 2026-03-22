import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { VisitTracker } from "@/components/analytics/VisitTracker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <VisitTracker />
      <Header />
      {children}
      <Footer />
      <ScrollToTop />
    </>
  );
}
