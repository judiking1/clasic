import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QueryProvider from "@/lib/query-provider";
import { ViewTracker } from "@/components/analytics/ViewTracker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <ViewTracker />
      <Header />
      {children}
      <Footer />
    </QueryProvider>
  );
}
