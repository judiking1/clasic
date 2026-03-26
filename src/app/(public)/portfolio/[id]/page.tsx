import { notFound } from "next/navigation";
import Link from "next/link";
import { getPortfolio } from "@/actions/portfolio";
import { checkIsAdmin } from "@/actions/auth";
import { ImageCarousel } from "@/components/portfolio/ImageCarousel";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { PortfolioViewCount } from "@/components/portfolio/PortfolioViewCount";
import { ViewTracker } from "@/components/analytics/ViewTracker";

interface PortfolioDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PortfolioDetailPageProps) {
  const { id } = await params;
  const portfolio = await getPortfolio(id);

  if (!portfolio) {
    return { title: "시공사례를 찾을 수 없습니다" };
  }

  const categoryLabel =
    PORTFOLIO_CATEGORIES.find((c) => c.value === portfolio.category)?.label ||
    portfolio.category;

  const description =
    portfolio.description ||
    `클레식 인조대리석 ${categoryLabel} 시공사례 - ${portfolio.title}. 맞춤 제작부터 시공까지 전문 업체의 작업 과정을 확인하세요.`;

  const ogImage = portfolio.images?.[0]?.imageUrl;

  return {
    title: `${portfolio.title} - 인조대리석 ${categoryLabel} 시공사례`,
    description,
    keywords: [
      "인조대리석",
      "인조대리석 시공",
      `인조대리석 ${categoryLabel}`,
      categoryLabel,
      "시공사례",
      "맞춤제작",
      "클레식",
    ],
    openGraph: {
      title: `${portfolio.title} - 인조대리석 ${categoryLabel} 시공사례 | 클레식`,
      description,
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: portfolio.title,
          },
        ],
      }),
      type: "article",
    },
    alternates: {
      canonical: `/portfolio/${id}`,
    },
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { id } = await params;
  const [portfolio, isAdmin] = await Promise.all([getPortfolio(id), checkIsAdmin()]);

  if (!portfolio) {
    notFound();
  }

  const categoryLabel =
    PORTFOLIO_CATEGORIES.find((c) => c.value === portfolio.category)?.label ||
    portfolio.category;

  // Preserve category filter when navigating back to list
  const backHref = portfolio.category && portfolio.category !== "all"
    ? `/portfolio?category=${portfolio.category}`
    : "/portfolio";

  return (
    <main className="min-h-screen bg-background pt-20 lg:pt-24">
      <ViewTracker portfolioId={portfolio.id} />
      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href={backHref}
          className="group mb-10 inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-primary"
        >
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          시공사례 목록으로
        </Link>

        {/* Title & Meta */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-[10px] font-medium tracking-wider uppercase text-accent">
              {categoryLabel}
            </span>
            <span className="text-xs text-secondary">
              {formatDate(portfolio.createdAt)}
            </span>
            <PortfolioViewCount portfolioId={portfolio.id} />
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl">
              {portfolio.title}
            </h1>
            {isAdmin && (
              <Link
                href={`/admin/portfolio/${portfolio.id}/edit`}
                className="shrink-0 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white hover:bg-accent-light transition-colors"
              >
                수정
              </Link>
            )}
          </div>
        </div>

        {/* Image Carousel */}
        {portfolio.images.length > 0 && (
          <div className="mb-12">
            <ImageCarousel images={portfolio.images} />
          </div>
        )}

        {/* Description */}
        {portfolio.description && (
          <div className="rounded-2xl border border-border bg-white p-8 sm:p-10">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-secondary">
              상세 설명
            </h2>
            <div className="h-px w-12 bg-accent mb-6" />
            <p className="whitespace-pre-wrap leading-relaxed text-primary/80">
              {portfolio.description}
            </p>
          </div>
        )}

        {/* Back Link Bottom */}
        <div className="mt-12 text-center">
          <Link
            href={backHref}
            className="group inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-primary transition-all duration-300 hover:border-accent/30 hover:bg-accent/5"
          >
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            목록으로 돌아가기
          </Link>
        </div>
      </article>
    </main>
  );
}
