"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Inquiry } from "@/types";

type DashboardStats = {
  portfolioCount: number;
  sampleCount: number;
  inquiryCount: number;
  unreadCount: number;
  recentInquiries: Inquiry[];
};

export function useDashboardStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => api.get<DashboardStats>("/api/admin/stats"),
    staleTime: 10 * 1000, // 10 seconds - dashboard should be fresh
  });
}
