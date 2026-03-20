"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { AdminUser } from "@/types";
import { toast } from "sonner";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => api.get<{ data: AdminUser[] }>("/api/admin/users"),
  });
}

export function useRegisterAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      email: string;
      name: string;
      password: string;
      role?: string;
    }) => api.post("/api/admin/auth/register", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("관리자가 등록되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "관리자 등록에 실패했습니다");
    },
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => api.patch(`/api/admin/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("관리자 정보가 수정되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "관리자 수정에 실패했습니다");
    },
  });
}

export function useResetAdminPassword() {
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      api.patch(`/api/admin/users/${id}`, { password }),
    onSuccess: () => {
      toast.success("비밀번호가 변경되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "비밀번호 변경에 실패했습니다");
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("관리자가 삭제되었습니다");
    },
    onError: (error: Error) => {
      toast.error(error.message || "관리자 삭제에 실패했습니다");
    },
  });
}
