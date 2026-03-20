"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { PaginatedResult, Inquiry } from "@/types";
import { toast } from "sonner";

type InquiryFilters = {
  page?: number;
  pageSize?: number;
  search?: string;
  inquiryType?: string;
  isRead?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

function buildQueryString(filters: InquiryFilters) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.search) params.set("search", filters.search);
  if (filters.inquiryType) params.set("inquiryType", filters.inquiryType);
  if (filters.isRead !== undefined && filters.isRead !== "") params.set("isRead", filters.isRead);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  return params.toString();
}

export function useInquiries(filters: InquiryFilters = {}) {
  return useQuery({
    queryKey: ["inquiries", filters],
    queryFn: () =>
      api.get<PaginatedResult<Inquiry>>(
        `/api/admin/inquiries?${buildQueryString(filters)}`
      ),
  });
}

export function useInquiry(id: string) {
  return useQuery({
    queryKey: ["inquiry", id],
    queryFn: () => api.get<Inquiry>(`/api/admin/inquiries/${id}`),
    enabled: !!id,
  });
}

export function useMarkInquiriesAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      api.patch("/api/admin/inquiries", { action: "markAsRead", ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("읽음 처리되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "읽음 처리에 실패했습니다");
    },
  });
}

export function useDeleteInquiries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      api.delete("/api/admin/inquiries", { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("문의가 삭제되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "문의 삭제에 실패했습니다");
    },
  });
}

export function useMarkInquiryAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.patch(`/api/admin/inquiries/${id}`, { isRead: true }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["inquiry", id] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/admin/inquiries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("문의가 삭제되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "문의 삭제에 실패했습니다");
    },
  });
}
