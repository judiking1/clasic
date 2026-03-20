"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { PaginatedResult, ActivityLog } from "@/types";

type ActivityLogFilters = {
  page?: number;
  pageSize?: number;
  resource?: string;
  action?: string;
  search?: string;
};

function buildQueryString(filters: ActivityLogFilters) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.resource) params.set("resource", filters.resource);
  if (filters.action) params.set("action", filters.action);
  if (filters.search) params.set("search", filters.search);
  return params.toString();
}

export function useActivityLogs(filters: ActivityLogFilters = {}) {
  return useQuery({
    queryKey: ["activityLogs", filters],
    queryFn: () =>
      api.get<PaginatedResult<ActivityLog>>(
        `/api/admin/activity-logs?${buildQueryString(filters)}`
      ),
  });
}
