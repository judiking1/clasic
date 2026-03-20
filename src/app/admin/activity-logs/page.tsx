"use client";

import { useState } from "react";
import { useActivityLogs } from "@/hooks/use-activity-logs";
import { formatDate } from "@/lib/utils";
import Pagination from "@/components/admin/Pagination";

const ACTION_LABELS: Record<string, string> = {
  create: "생성",
  update: "수정",
  delete: "삭제",
  login: "로그인",
  logout: "로그아웃",
};

const RESOURCE_LABELS: Record<string, string> = {
  portfolio: "시공사례",
  sample: "샘플",
  inquiry: "문의",
  user: "사용자",
  auth: "인증",
};

const ACTION_COLORS: Record<string, string> = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  login: "bg-purple-100 text-purple-700",
  logout: "bg-gray-100 text-gray-700",
};

export default function ActivityLogsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [resource, setResource] = useState("");
  const [action, setAction] = useState("");

  const { data, isLoading } = useActivityLogs({
    page,
    pageSize,
    resource: resource || undefined,
    action: action || undefined,
  });

  const logs = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">활동 로그</h1>

      <div className="bg-white rounded-lg shadow">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-4 py-3">
          <select
            value={resource}
            onChange={(e) => {
              setResource(e.target.value);
              setPage(1);
            }}
            className="rounded-md border border-gray-300 bg-white py-1.5 pl-2 pr-7 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="">전체 리소스</option>
            <option value="portfolio">시공사례</option>
            <option value="sample">샘플</option>
            <option value="inquiry">문의</option>
            <option value="user">사용자</option>
            <option value="auth">인증</option>
          </select>

          <select
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1);
            }}
            className="rounded-md border border-gray-300 bg-white py-1.5 pl-2 pr-7 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="">전체 동작</option>
            <option value="create">생성</option>
            <option value="update">수정</option>
            <option value="delete">삭제</option>
            <option value="login">로그인</option>
            <option value="logout">로그아웃</option>
          </select>

          <span className="text-sm text-gray-500 ml-auto">
            총 {total.toLocaleString()}건
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="px-6 py-12 text-center text-gray-500">로딩 중...</div>
          ) : logs.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              활동 로그가 없습니다.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="px-4 py-3">시간</th>
                  <th className="px-4 py-3">사용자</th>
                  <th className="px-4 py-3">동작</th>
                  <th className="px-4 py-3">리소스</th>
                  <th className="px-4 py-3">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {log.userName}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          ACTION_COLORS[log.action] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {RESOURCE_LABELS[log.resource] || log.resource}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                      {log.details ? (() => {
                        try {
                          const parsed = JSON.parse(log.details);
                          return Object.entries(parsed)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(", ");
                        } catch {
                          return log.details;
                        }
                      })() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="border-t border-gray-200 px-2">
            <Pagination
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
