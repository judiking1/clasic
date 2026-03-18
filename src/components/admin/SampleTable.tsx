"use client";

import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "./DataTable";
import type { Sample, PaginatedResult } from "@/types";
import { deleteSamples } from "@/actions/samples";
import { SAMPLE_COLORS, SAMPLE_PATTERNS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface SampleTableProps {
  result: PaginatedResult<Sample>;
}

const columns: ColumnDef<Sample, unknown>[] = [
  {
    id: "image",
    header: "이미지",
    cell: ({ row }) => {
      const sample = row.original;
      return (
        <div className="w-12 h-12 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
          {sample.imageUrl ? (
            <Image
              src={sample.imageUrl}
              alt={sample.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No img
            </div>
          )}
        </div>
      );
    },
    size: 64,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "이름",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">{row.original.name}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "brand",
    header: "브랜드",
    cell: ({ row }) => (
      <span className="text-gray-600">{row.original.brand || "-"}</span>
    ),
    enableSorting: false,
  },
  {
    id: "colorCategory",
    header: "색상",
    cell: ({ row }) => {
      const color = SAMPLE_COLORS.find(
        (c) => c.value === row.original.colorCategory
      );
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
          {color?.label ?? row.original.colorCategory}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    id: "patternType",
    header: "패턴",
    cell: ({ row }) => {
      const pattern = SAMPLE_PATTERNS.find(
        (p) => p.value === row.original.patternType
      );
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
          {pattern?.label ?? row.original.patternType}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: "관리",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/samples/${row.original.id}/edit`}
          className="inline-flex px-3 py-1.5 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
        >
          수정
        </Link>
      </div>
    ),
    size: 100,
    enableSorting: false,
  },
];

export function SampleTable({ result }: SampleTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentColor = searchParams.get("colorCategory") ?? "";
  const currentPattern = searchParams.get("patternType") ?? "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleDelete = useCallback(
    async (ids: string[]) => {
      if (!confirm(`${ids.length}개의 샘플을 삭제하시겠습니까?`)) return;
      await deleteSamples(ids);
      router.refresh();
    },
    [router]
  );

  const filters = (
    <>
      <select
        value={currentColor || "all"}
        onChange={(e) => updateFilter("colorCategory", e.target.value)}
        className="rounded-md border border-gray-300 bg-white py-1.5 pl-2 pr-7 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      >
        <option value="all">전체 색상</option>
        {SAMPLE_COLORS.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <select
        value={currentPattern || "all"}
        onChange={(e) => updateFilter("patternType", e.target.value)}
        className="rounded-md border border-gray-300 bg-white py-1.5 pl-2 pr-7 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      >
        <option value="all">전체 패턴</option>
        {SAMPLE_PATTERNS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
    </>
  );

  return (
    <DataTable<Sample>
      columns={columns}
      data={result.data}
      total={result.total}
      page={result.page}
      pageSize={result.pageSize}
      totalPages={result.totalPages}
      searchPlaceholder="샘플 검색..."
      enableSelection
      filters={filters}
      onDelete={handleDelete}
    />
  );
}
