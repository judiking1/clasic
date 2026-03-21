"use client";

import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "./DataTable";
import type { PortfolioWithImages, PaginatedResult } from "@/types";
import { useDeletePortfolios } from "@/hooks/use-portfolios";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface PortfolioTableProps {
  result: PaginatedResult<PortfolioWithImages>;
}

const columns: ColumnDef<PortfolioWithImages, unknown>[] = [
  {
    id: "thumbnail",
    header: "썸네일",
    cell: ({ row }) => {
      const portfolio = row.original;
      const thumbnail = portfolio.thumbnailUrl || portfolio.images?.[0]?.imageUrl;
      return (
        <div className="w-16 h-12 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={portfolio.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No img
            </div>
          )}
        </div>
      );
    },
    size: 80,
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: "제목",
    cell: ({ row }) => (
      <Link
        href={`/admin/portfolio/${row.original.id}/edit`}
        prefetch={false}
        className="font-medium text-gray-900 hover:text-amber-600 transition-colors"
      >
        {row.original.title}
      </Link>
    ),
    enableSorting: true,
  },
  {
    id: "category",
    header: "카테고리",
    cell: ({ row }) => {
      const cat = PORTFOLIO_CATEGORIES.find(
        (c) => c.value === row.original.category
      );
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
          {cat?.label ?? row.original.category}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    id: "isFeatured",
    header: "추천",
    cell: ({ row }) =>
      row.original.isFeatured ? (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
          추천
        </span>
      ) : (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">
          일반
        </span>
      ),
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: "날짜",
    cell: ({ row }) => (
      <span className="text-gray-500">{formatDate(row.original.createdAt)}</span>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    header: "관리",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/portfolio/${row.original.id}/edit`}
          prefetch={false}
          className="inline-flex px-3 py-1.5 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
        >
          수정
        </Link>
        <Link
          href={`/portfolio/${row.original.id}`}
          prefetch={false}
          target="_blank"
          className="inline-flex px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
        >
          보기
        </Link>
      </div>
    ),
    size: 160,
    enableSorting: false,
  },
];

export function PortfolioTable({ result }: PortfolioTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const deleteMutation = useDeletePortfolios();

  const currentCategory = searchParams.get("category") ?? "";

  const handleCategoryChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set("category", value);
      } else {
        params.delete("category");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleDelete = useCallback(
    async (ids: string[]) => {
      if (!confirm(`${ids.length}개의 시공사례를 삭제하시겠습니까?`)) return;
      await deleteMutation.mutateAsync(ids);
      router.refresh();
    },
    [router, deleteMutation]
  );

  const filters = (
    <select
      value={currentCategory || "all"}
      onChange={(e) => handleCategoryChange(e.target.value)}
      className="rounded-md border border-gray-300 bg-white py-1.5 pl-2 pr-7 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
    >
      {PORTFOLIO_CATEGORIES.map((cat) => (
        <option key={cat.value} value={cat.value}>
          {cat.label}
        </option>
      ))}
    </select>
  );

  return (
    <DataTable<PortfolioWithImages>
      columns={columns}
      data={result.data}
      total={result.total}
      page={result.page}
      pageSize={result.pageSize}
      totalPages={result.totalPages}
      searchPlaceholder="시공사례 검색..."
      enableSelection
      filters={filters}
      onDelete={handleDelete}
    />
  );
}
