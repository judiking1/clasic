"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { PaginatedResult, PortfolioWithImages } from "@/types";
import { toast } from "sonner";

type PortfolioFilters = {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

function buildQueryString(filters: PortfolioFilters) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  return params.toString();
}

export function usePortfolios(filters: PortfolioFilters = {}) {
  return useQuery({
    queryKey: ["portfolios", filters],
    queryFn: () =>
      api.get<PaginatedResult<PortfolioWithImages>>(
        `/api/admin/portfolios?${buildQueryString(filters)}`
      ),
  });
}

export function usePortfolio(id: string) {
  return useQuery({
    queryKey: ["portfolio", id],
    queryFn: () =>
      api.get<PortfolioWithImages>(`/api/admin/portfolios/${id}`),
    enabled: !!id,
  });
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<{ success: boolean; data: { id: string } }>(
        "/api/admin/portfolios",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("시공사례가 등록되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "시공사례 등록에 실패했습니다");
    },
  });
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.put(`/api/admin/portfolios/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({
        queryKey: ["portfolio", variables.id],
      });
      toast.success("시공사례가 수정되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "시공사례 수정에 실패했습니다");
    },
  });
}

export function useDeletePortfolios() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      api.delete("/api/admin/portfolios", { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("시공사례가 삭제되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "시공사례 삭제에 실패했습니다");
    },
  });
}
