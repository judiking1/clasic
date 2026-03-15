"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import type { ActionResult } from "@/types";

const initialState: ActionResult = {
  success: false,
  error: "",
};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">관리자 로그인</h1>
            <p className="text-gray-400 mt-2">
              관리자 페이지에 접근하려면 로그인하세요.
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {state.error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg px-4 py-3">
                <p className="text-sm text-red-300">{state.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {isPending ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
