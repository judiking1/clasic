import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPortfolios } from "@/actions/portfolio";
import { CategoryFilter } from "@/components/portfolio/CategoryFilter";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import PageHero from "@/components/ui/PageHero";

export const metadata = {
  title: "시공사례",
  description: "클래식의 인조대리석 시공사례를 확인해보세요.",
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || "all";
  const portfolios = await getPortfolios(category);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <PageHero
          label="Portfolio"
          title="시공사례"
          description="정성을 다해 시공한 인조대리석 작업물을 확인해보세요"
        />

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <CategoryFilter currentCategory={category} />

          {portfolios.length > 0 ? (
            <PortfolioGrid portfolios={portfolios} />
          ) : (
            <div className="py-20 text-center text-secondary">
              <p className="text-lg">등록된 시공사례가 없습니다.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
