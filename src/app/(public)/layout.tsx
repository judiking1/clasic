import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QueryProvider from "@/lib/query-provider";
import { VisitTracker } from "@/components/analytics/VisitTracker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <VisitTracker />
      <Header />
      {children}
      <Footer />
    </QueryProvider>
  );
}
