import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  currentCategory: string;
}

function buildHref(page: number, category: string) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/portfolio?${query}` : "/portfolio";
}

export function Pagination({ currentPage, totalPages, currentCategory }: PaginationProps) {
  if (totalPages <= 1) return null;

  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="mt-12 flex items-center justify-center gap-1" aria-label="페이지네이션">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1, currentCategory)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-secondary transition-colors hover:border-primary/30 hover:text-primary"
          aria-label="이전 페이지"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full text-border">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </span>
      )}

      {start > 1 && (
        <>
          <Link href={buildHref(1, currentCategory)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm text-secondary transition-colors hover:border-primary/30 hover:text-primary">
            1
          </Link>
          {start > 2 && <span className="px-1 text-secondary">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page, currentCategory)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors",
            page === currentPage
              ? "bg-primary text-white"
              : "border border-border text-secondary hover:border-primary/30 hover:text-primary"
          )}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Link>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-secondary">...</span>}
          <Link href={buildHref(totalPages, currentCategory)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm text-secondary transition-colors hover:border-primary/30 hover:text-primary">
            {totalPages}
          </Link>
        </>
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1, currentCategory)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-secondary transition-colors hover:border-primary/30 hover:text-primary"
          aria-label="다음 페이지"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full text-border">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </nav>
  );
}
