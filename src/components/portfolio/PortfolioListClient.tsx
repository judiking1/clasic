"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";
import { PortfolioCard } from "./PortfolioCard";
import { checkIsAdmin } from "@/actions/auth";

const PAGE_SIZE = 12;

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  isFeatured: boolean;
  createdAt: string;
}

interface PortfolioResponse {
  data: PortfolioItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function fetchPortfolios(category: string, page: number): Promise<PortfolioResponse> {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  params.set("page", String(page));
  params.set("pageSize", String(PAGE_SIZE));
  const res = await fetch(`/api/portfolios?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function PortfolioListClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkIsAdmin().then(setIsAdmin);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["public-portfolios", currentCategory, currentPage],
    queryFn: () => fetchPortfolios(currentCategory, currentPage),
    staleTime: Infinity, // Never refetch unless manually invalidated
    gcTime: 30 * 60 * 1000, // Keep in cache 30 minutes
  });

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams();
    if (value !== "all") params.set("category", value);
    const query = params.toString();
    router.push(query ? `/portfolio?${query}` : "/portfolio", { scroll: false });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const query = params.toString();
    router.push(query ? `/portfolio?${query}` : "/portfolio", { scroll: false });
  };

  const portfolios = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <>
      {/* Category Filter */}
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        {PORTFOLIO_CATEGORIES.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryChange(category.value)}
            className={cn(
              "relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
              currentCategory === category.value
                ? "bg-primary text-white"
                : "bg-transparent text-secondary hover:text-primary border border-border hover:border-primary/30"
            )}
          >
            {currentCategory === category.value && (
              <motion.div
                layoutId="filter-bg"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      {isLoading ? (
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
      ) : portfolios.length > 0 ? (
        <>
          <motion.div
            key={`${currentCategory}-${currentPage}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={{ ...portfolio, images: [], updatedAt: portfolio.createdAt }}
                isAdmin={isAdmin}
              />
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-12 flex items-center justify-center gap-1" aria-label="페이지네이션">
              {currentPage > 1 ? (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-secondary transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full text-border">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors",
                    page === currentPage
                      ? "bg-primary text-white"
                      : "border border-border text-secondary hover:border-primary/30 hover:text-primary"
                  )}
                >
                  {page}
                </button>
              ))}

              {currentPage < totalPages ? (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-secondary transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full text-border">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </nav>
          )}
        </>
      ) : (
        <div className="py-20 text-center text-secondary">
          <p className="text-lg">등록된 시공사례가 없습니다.</p>
        </div>
      )}
    </>
  );
}
