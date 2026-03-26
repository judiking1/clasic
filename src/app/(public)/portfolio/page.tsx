import { Suspense } from "react";
import { getPortfoliosPublic } from "@/actions/portfolio";
import { checkIsAdmin } from "@/actions/auth";
import PageHero from "@/components/ui/PageHero";
import { CategoryFilter } from "@/components/portfolio/CategoryFilter";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { Pagination } from "@/components/portfolio/Pagination";

export const metadata = {
  title: "인조대리석 시공사례 - 싱크대·세면대·카운터 맞춤 시공",
  description:
    "클레식의 인조대리석 싱크대, 세면대, 카운터 시공사례를 확인해보세요. 주방 상판, 세면대 상판 등 다양한 인조대리석 맞춤 제작 및 시공 포트폴리오를 제공합니다.",
  keywords: [
    "인조대리석 시공사례",
    "싱크대 시공",
    "세면대 시공",
    "카운터 시공",
    "인조대리석 포트폴리오",
    "맞춤 시공",
  ],
  alternates: {
    canonical: "/portfolio",
  },
};

function PortfolioSkeleton() {
  return (
    <>
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-20 animate-pulse rounded-full bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border bg-white">
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

async function PortfolioContent({
  category,
  page,
}: {
  category: string;
  page: number;
}) {
  const [result, isAdmin] = await Promise.all([
    getPortfoliosPublic(category, page, 12),
    checkIsAdmin(),
  ]);

  const { data: portfolios, totalPages } = result;

  return (
    <>
      <CategoryFilter currentCategory={category} />

      {portfolios.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((portfolio, index) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                isAdmin={isAdmin}
                priority={index < 3}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            currentCategory={category}
          />
        </>
      ) : (
        <div className="py-20 text-center text-secondary">
          <p className="text-lg">등록된 시공사례가 없습니다.</p>
        </div>
      )}
    </>
  );
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || "all";
  const page = Math.max(1, Number(params.page) || 1);

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        label="Portfolio"
        title="시공사례"
        description="정성을 다해 시공한 인조대리석 작업물을 확인해보세요"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Suspense fallback={<PortfolioSkeleton />}>
          <PortfolioContent category={category} page={page} />
        </Suspense>
      </section>
    </main>
  );
}
