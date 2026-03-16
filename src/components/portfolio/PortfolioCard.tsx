"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";
import type { PortfolioWithImages } from "@/types";

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
    <Link href={`/portfolio/${portfolio.id}`}>
      <motion.article
        whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group overflow-hidden rounded-2xl bg-white shadow-sm"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {portfolio.thumbnailUrl ? (
            <Image
              src={portfolio.thumbnailUrl}
              alt={portfolio.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Category Badge */}
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
            {categoryLabel}
          </span>

          {/* Admin Edit Button */}
          {isAdmin && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/admin/portfolio/${portfolio.id}/edit`);
              }}
              className="absolute right-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              수정
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-amber-600">
            {portfolio.title}
          </h3>
          {portfolio.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {portfolio.description}
            </p>
          )}
        </div>
      </motion.article>
    </Link>
  );
}
