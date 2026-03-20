"use client";

import { useState } from "react";
import {
  useAdminUsers,
  useRegisterAdmin,
  useUpdateAdminUser,
  useDeleteAdminUser,
  useResetAdminPassword,
} from "@/hooks/use-admin-users";
import { formatDate } from "@/lib/utils";
import type { AdminUser } from "@/types";

export default function AdminSettingsPage() {
  const { data, isLoading, error } = useAdminUsers();
  const registerMutation = useRegisterAdmin();
  const updateMutation = useUpdateAdminUser();
  const deleteMutation = useDeleteAdminUser();
  const resetPasswordMutation = useResetAdminPassword();

  const [showRegister, setShowRegister] = useState(false);
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    role: "admin" as "admin" | "superadmin",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerMutation.mutateAsync(form);
    setForm({ email: "", name: "", password: "", role: "admin" });
    setShowRegister(false);
  };

  const handleToggleActive = (user: AdminUser) => {
    updateMutation.mutate({
      id: user.id,
      data: { isActive: !user.isActive },
    });
  };

  const handleDelete = (user: AdminUser) => {
    if (!confirm(`${user.name} (${user.email})을(를) 삭제하시겠습니까?`)) return;
    deleteMutation.mutate(user.id);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordUserId || !newPassword) return;
    await resetPasswordMutation.mutateAsync({ id: resetPasswordUserId, password: newPassword });
    setResetPasswordUserId(null);
    setNewPassword("");
  };

  const users = data?.data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
      </div>

      {/* Admin User Management */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">관리자 계정 관리</h2>
          <button
            type="button"
            onClick={() => setShowRegister(!showRegister)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            {showRegister ? "취소" : "새 관리자 추가"}
          </button>
        </div>

        {/* Registration Form */}
        {showRegister && (
          <form onSubmit={handleRegister} className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="관리자 이름"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="8자 이상"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  권한
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        role: e.target.value as "admin" | "superadmin",
                      }))
                    }
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="admin">관리자</option>
                    <option value="superadmin">최고관리자</option>
                  </select>
                  <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50 transition whitespace-nowrap"
                  >
                    {registerMutation.isPending ? "등록 중..." : "등록"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Users List */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="px-6 py-12 text-center text-gray-500">로딩 중...</div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-gray-500">
              관리자 목록을 불러올 수 없습니다. 최고관리자 권한이 필요합니다.
            </div>
          ) : users.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              등록된 관리자가 없습니다. 현재 환경변수 기반 인증을 사용 중입니다.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    권한
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    마지막 로그인
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === "superadmin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role === "superadmin" ? "최고관리자" : "관리자"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "활성" : "비활성"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.lastLoginAt ? formatDate(user.lastLoginAt) : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setResetPasswordUserId(user.id);
                            setNewPassword("");
                          }}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition"
                        >
                          비밀번호
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(user)}
                          disabled={updateMutation.isPending}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                            user.isActive
                              ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {user.isActive ? "비활성화" : "활성화"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={deleteMutation.isPending}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Password Reset Modal */}
      {resetPasswordUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setResetPasswordUserId(null)}
          />
          <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              비밀번호 변경
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {users.find((u) => u.id === resetPasswordUserId)?.name} ({users.find((u) => u.id === resetPasswordUserId)?.email})
            </p>
            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호 (8자 이상)"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mb-4 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                autoFocus
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setResetPasswordUserId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 rounded-lg transition"
                >
                  {resetPasswordMutation.isPending ? "변경 중..." : "비밀번호 변경"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* System Info */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">시스템 정보</h2>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">프레임워크</span>
            <span className="text-sm font-medium text-gray-900">Next.js 16</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">데이터베이스</span>
            <span className="text-sm font-medium text-gray-900">Turso (SQLite)</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">ORM</span>
            <span className="text-sm font-medium text-gray-900">Drizzle ORM</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">이미지 저장소</span>
            <span className="text-sm font-medium text-gray-900">Vercel Blob</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">인증</span>
            <span className="text-sm font-medium text-gray-900">JWT (jose)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
