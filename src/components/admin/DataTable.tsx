"use client";

import {
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Pagination from "./Pagination";
import BulkActionBar from "./BulkActionBar";

interface DataTableProps<T extends { id: string }> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  searchPlaceholder?: string;
  enableSelection?: boolean;
  filters?: ReactNode;
  onDelete?: (ids: string[]) => void | Promise<void>;
  onAction?: (action: string, ids: string[]) => void | Promise<void>;
  bulkActions?: { label: string; value: string; variant?: "default" | "danger" | "warning" }[];
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  total,
  page,
  pageSize,
  totalPages,
  searchPlaceholder = "검색...",
  enableSelection = true,
  filters,
  onDelete,
  onAction,
  bulkActions = [],
}: DataTableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- URL state ---
  const currentSearch = searchParams.get("search") ?? "";
  const currentSortId = searchParams.get("sortId") ?? "";
  const currentSortDesc = searchParams.get("sortDesc") === "true";

  // --- Local state ---
  const [searchValue, setSearchValue] = useState(currentSearch);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>(
    currentSortId ? [{ id: currentSortId, desc: currentSortDesc }] : []
  );

  // --- URL sync helper ---
  const updateUrl = useCallback(
    (params: Record<string, string | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      }
      router.push(`${pathname}?${newParams.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // --- Debounced search ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentSearch) {
        updateUrl({ search: searchValue || undefined, page: "1" });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external search param back to local state
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  // --- Sort sync ---
  useEffect(() => {
    const sort = sorting[0];
    if (sort) {
      updateUrl({ sortId: sort.id, sortDesc: String(sort.desc), page: "1" });
    } else if (currentSortId) {
      updateUrl({ sortId: undefined, sortDesc: undefined, page: "1" });
    }
  }, [sorting]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Page / pageSize handlers ---
  const handlePageChange = useCallback(
    (newPage: number) => {
      updateUrl({ page: String(newPage) });
    },
    [updateUrl]
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      updateUrl({ pageSize: String(newSize), page: "1" });
    },
    [updateUrl]
  );

  // --- Selection helpers ---
  const selectedIds = useMemo(() => {
    return Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => {
        const row = data[Number(key)];
        return row?.id;
      })
      .filter(Boolean) as string[];
  }, [rowSelection, data]);

  const handleDeselect = useCallback(() => {
    setRowSelection({});
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (onDelete) {
      await onDelete(selectedIds);
      setRowSelection({});
    }
  }, [onDelete, selectedIds]);

  const handleBulkAction = useCallback(
    async (action: string) => {
      if (onAction) {
        await onAction(action, selectedIds);
        setRowSelection({});
      }
    },
    [onAction, selectedIds]
  );

  // --- Checkbox column ---
  const allColumns = useMemo(() => {
    if (!enableSelection) return columns;

    const selectionColumn: ColumnDef<T, unknown> = {
      id: "_select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 accent-amber-500"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          aria-label="전체 선택"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 accent-amber-500"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
          aria-label="행 선택"
        />
      ),
      size: 40,
      enableSorting: false,
    };

    return [selectionColumn, ...columns];
  }, [columns, enableSelection]);

  // --- Table instance ---
  const table = useReactTable({
    data,
    columns: allColumns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    enableRowSelection: enableSelection,
  });

  return (
    <div className="flex flex-col gap-0 rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-gray-200 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3">
        {/* Search */}
        <div className="relative w-full sm:w-60 lg:w-72">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Custom filters */}
          {filters}

          {/* Page size selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="hidden text-sm text-gray-600 whitespace-nowrap sm:block">
              표시 개수
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="rounded-md border border-gray-300 bg-white py-1.5 pl-2 pr-7 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="sticky top-0 z-[1] border-b border-gray-200 bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      className={`px-3 py-2.5 sm:px-4 sm:py-3 ${canSort ? "cursor-pointer select-none hover:bg-gray-200" : ""}`}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <span className="ml-1 inline-flex flex-col text-gray-400">
                            <svg
                              className={`h-3 w-3 ${sorted === "asc" ? "text-amber-500" : ""}`}
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M7 14l5-5 5 5z" />
                            </svg>
                            <svg
                              className={`-mt-1 h-3 w-3 ${sorted === "desc" ? "text-amber-500" : ""}`}
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M7 10l5 5 5-5z" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={allColumns.length}
                  className="py-10 sm:py-16 text-center text-sm text-gray-500"
                >
                  데이터가 없습니다
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`transition-colors hover:bg-amber-50 ${
                    row.getIsSelected()
                      ? "bg-amber-50"
                      : row.index % 2 === 1
                        ? "bg-gray-50"
                        : "bg-white"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2.5 sm:px-4 sm:py-3 text-gray-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-gray-200 px-1 sm:px-2">
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {/* Bulk action bar */}
      {enableSelection && (
        <BulkActionBar
          selectedCount={selectedIds.length}
          onDelete={handleBulkDelete}
          onDeselect={handleDeselect}
          onAction={handleBulkAction}
          actions={bulkActions}
        />
      )}
    </div>
  );
}
