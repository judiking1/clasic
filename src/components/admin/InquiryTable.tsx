"use client";

import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "./DataTable";
import type { Inquiry, PaginatedResult } from "@/types";
import { deleteInquiries, markInquiriesAsRead } from "@/actions/inquiries";
import { INQUIRY_TYPES } from "@/lib/constants";
import { formatDate, formatPhone } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface InquiryTableProps {
  result: PaginatedResult<Inquiry>;
}

const columns: ColumnDef<Inquiry, unknown>[] = [
  {
    id: "isRead",
    header: "상태",
    cell: ({ row }) =>
      row.original.isRead ? (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
          읽음
        </span>
      ) : (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
          새 문의
        </span>
      ),
    size: 80,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "이름",
    cell: ({ row }) => (
      <Link
        href={`/admin/inquiries/${row.original.id}`}
        className="font-medium text-gray-900 hover:text-amber-600 transition"
      >
        {row.original.name}
      </Link>
    ),
    enableSorting: true,
  },
  {
    id: "phone",
    header: "연락처",
    cell: ({ row }) => (
      <span className="text-gray-600">{formatPhone(row.original.phone)}</span>
    ),
    enableSorting: false,
  },
  {
    id: "inquiryType",
    header: "유형",
    cell: ({ row }) => {
      const type = INQUIRY_TYPES.find(
        (t) => t.value === row.original.inquiryType
      );
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
          {type?.label ?? row.original.inquiryType}
        </span>
      );
    },
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
          href={`/admin/inquiries/${row.original.id}`}
          className="inline-flex px-3 py-1.5 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
        >
          보기
        </Link>
      </div>
    ),
    size: 100,
    enableSorting: false,
  },
];

export function InquiryTable({ result }: InquiryTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentType = searchParams.get("inquiryType") ?? "";
  const currentIsRead = searchParams.get("isRead") ?? "";

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
      if (!confirm(`${ids.length}개의 문의를 삭제하시겠습니까?`)) return;
      await deleteInquiries(ids);
      router.refresh();
    },
    [router]
  );

  const handleAction = useCallback(
    async (action: string, ids: string[]) => {
      if (action === "markAsRead") {
        await markInquiriesAsRead(ids);
        router.refresh();
      }
    },
    [router]
  );

  const filters = (
    <>
      <select
        value={currentType || "all"}
        onChange={(e) => updateFilter("inquiryType", e.target.value)}
        className="rounded-md border border-gray-300 bg-white py-1.5 pl-2 pr-7 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      >
        <option value="all">전체 유형</option>
        {INQUIRY_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <select
        value={currentIsRead || "all"}
        onChange={(e) => updateFilter("isRead", e.target.value)}
        className="rounded-md border border-gray-300 bg-white py-1.5 pl-2 pr-7 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      >
        <option value="all">전체</option>
        <option value="false">읽지않음</option>
        <option value="true">읽음</option>
      </select>
    </>
  );

  return (
    <DataTable<Inquiry>
      columns={columns}
      data={result.data}
      total={result.total}
      page={result.page}
      pageSize={result.pageSize}
      totalPages={result.totalPages}
      searchPlaceholder="문의 검색..."
      enableSelection
      filters={filters}
      onDelete={handleDelete}
      onAction={handleAction}
      bulkActions={[
        { label: "읽음 처리", value: "markAsRead" },
      ]}
    />
  );
}
