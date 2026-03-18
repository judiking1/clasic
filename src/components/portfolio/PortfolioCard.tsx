"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";
import type { PortfolioWithImages } from "@/types";
import { cn } from "@/lib/utils";

interface PortfolioCardProps {
  portfolio: PortfolioWithImages;
  isAdmin?: boolean;
}

export function PortfolioCard({ portfolio, isAdmin }: PortfolioCardProps) {
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

          {/* Category */}
          <span className="absolute left-3 top-3 rounded-full bg-primary/80 px-3 py-1 text-[10px] font-medium tracking-wider uppercase text-white backdrop-blur-sm">
            {categoryLabel}
          </span>

          {/* Admin Edit */}
          {isAdmin && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/admin/portfolio/${portfolio.id}/edit`);
              }}
              className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold text-white shadow-md hover:bg-accent-light transition-colors"
            >
              수정
            </button>
          )}

          {/* Arrow on hover */}
          <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 opacity-0 -translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-bold text-primary transition-colors duration-300 group-hover:text-accent sm:text-lg">
            {portfolio.title}
          </h3>
          {portfolio.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-secondary">
              {portfolio.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
