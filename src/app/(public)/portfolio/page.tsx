import { PortfolioListClient } from "@/components/portfolio/PortfolioListClient";
import PageHero from "@/components/ui/PageHero";

export const metadata = {
  title: "시공사례",
  description: "클레식의 인조대리석 시공사례를 확인해보세요.",
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-background">
      <PageHero
        label="Portfolio"
        title="시공사례"
        description="정성을 다해 시공한 인조대리석 작업물을 확인해보세요"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <PortfolioListClient />
      </section>
    </main>
  );
}
