"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";
import type { PortfolioWithImages } from "@/types";

interface PortfolioCardProps {
  portfolio: PortfolioWithImages & { imageCount?: number; viewCount?: number };
  isAdmin?: boolean;
  priority?: boolean;
}

export function PortfolioCard({ portfolio, isAdmin, priority }: PortfolioCardProps) {
  const router = useRouter();
  const categoryLabel =
    PORTFOLIO_CATEGORIES.find((c) => c.value === portfolio.category)?.label ||
    portfolio.category;

  return (
    <Link href={`/portfolio/${portfolio.id}`} className="group block">
      <article className="overflow-hidden rounded-xl border border-border bg-white transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:shadow-primary/5">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {portfolio.thumbnailUrl ? (
            <Image
              src={portfolio.thumbnailUrl}
              alt={portfolio.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-all duration-[1.2s] group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <svg className="h-12 w-12 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Top-left badges */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <span className="rounded-full bg-primary/80 px-3 py-1 text-[10px] font-medium tracking-wider uppercase text-white backdrop-blur-sm">
              {categoryLabel}
            </span>
            {(portfolio.viewCount ?? 0) > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {portfolio.viewCount?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Top-right badges group */}
          <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
            {(portfolio.imageCount ?? 0) > 1 && (
              <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {portfolio.imageCount}
              </span>
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/admin/portfolio/${portfolio.id}/edit`);
                }}
                className="rounded-full bg-accent px-3 py-1 text-[10px] font-semibold text-white shadow-md hover:bg-accent-light transition-colors"
              >
                수정
              </button>
            )}
          </div>

          {/* Description overlay (always visible) */}
          {portfolio.description && (
            <div className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-10 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
              <p className="text-[13px] leading-snug text-white/90 line-clamp-1">
                {portfolio.description}
              </p>
            </div>
          )}

          {/* Arrow on hover */}
          <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 opacity-0 -translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-base font-bold text-primary transition-colors duration-300 group-hover:text-accent sm:text-lg line-clamp-1">
            {portfolio.title}
          </h3>
        </div>
      </article>
    </Link>
  );
}
