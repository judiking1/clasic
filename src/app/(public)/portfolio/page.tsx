import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPortfolios } from "@/actions/portfolio";
import { CategoryFilter } from "@/components/portfolio/CategoryFilter";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";

export const metadata = {
  title: "시공사례",
  description: "클래식 스톤의 인조대리석 시공사례를 확인해보세요.",
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
      <main className="min-h-screen bg-gray-50 pt-20 lg:pt-24">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              시공사례
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              정성을 다해 시공한 인조대리석 작업물을 확인해보세요
            </p>
          </div>

          <CategoryFilter currentCategory={category} />

          {portfolios.length > 0 ? (
            <PortfolioGrid portfolios={portfolios} />
          ) : (
            <div className="py-20 text-center text-gray-500">
              <p className="text-lg">등록된 시공사례가 없습니다.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
