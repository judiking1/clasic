import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPortfolio } from "@/actions/portfolio";
import { ImageCarousel } from "@/components/portfolio/ImageCarousel";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

interface PortfolioDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PortfolioDetailPageProps) {
  const { id } = await params;
  const portfolio = await getPortfolio(id);

  if (!portfolio) {
    return { title: "시공사례를 찾을 수 없습니다" };
  }

  return {
    title: `${portfolio.title} | 시공사례`,
    description: portfolio.description || `${portfolio.title} 시공사례 상세 페이지`,
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { id } = await params;
  const portfolio = await getPortfolio(id);

  if (!portfolio) {
    notFound();
  }

  const categoryLabel =
    PORTFOLIO_CATEGORIES.find((c) => c.value === portfolio.category)?.label ||
    portfolio.category;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 lg:pt-24">
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/portfolio"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            시공사례 목록으로
          </Link>

          {/* Title & Meta */}
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                {categoryLabel}
              </span>
              <span className="text-sm text-gray-400">
                {formatDate(portfolio.createdAt)}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {portfolio.title}
            </h1>
          </div>

          {/* Image Carousel */}
          {portfolio.images.length > 0 && (
            <div className="mb-10">
              <ImageCarousel images={portfolio.images} />
            </div>
          )}

          {/* Description */}
          {portfolio.description && (
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                상세 설명
              </h2>
              <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                {portfolio.description}
              </p>
            </div>
          )}

          {/* Back Link Bottom */}
          <div className="mt-10 text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
