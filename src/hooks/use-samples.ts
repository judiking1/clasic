"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { PaginatedResult, Sample } from "@/types";
import { toast } from "sonner";

type SampleFilters = {
  page?: number;
  pageSize?: number;
  search?: string;
  colorCategory?: string;
  patternType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

function buildQueryString(filters: SampleFilters) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.search) params.set("search", filters.search);
  if (filters.colorCategory) params.set("colorCategory", filters.colorCategory);
  if (filters.patternType) params.set("patternType", filters.patternType);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  return params.toString();
}

export function useSamples(filters: SampleFilters = {}) {
  return useQuery({
    queryKey: ["samples", filters],
    queryFn: () =>
      api.get<PaginatedResult<Sample>>(
        `/api/admin/samples?${buildQueryString(filters)}`
      ),
  });
}

export function useSample(id: string) {
  return useQuery({
    queryKey: ["sample", id],
    queryFn: () => api.get<Sample>(`/api/admin/samples/${id}`),
    enabled: !!id,
  });
}

export function useCreateSample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<{ success: boolean; data: { id: string } }>(
        "/api/admin/samples",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samples"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("샘플이 등록되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "샘플 등록에 실패했습니다");
    },
  });
}

export function useUpdateSample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.put(`/api/admin/samples/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["samples"] });
      queryClient.invalidateQueries({ queryKey: ["sample", variables.id] });
      toast.success("샘플이 수정되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "샘플 수정에 실패했습니다");
    },
  });
}

export function useDeleteSamples() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      api.delete("/api/admin/samples", { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samples"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("샘플이 삭제되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "샘플 삭제에 실패했습니다");
    },
  });
}
