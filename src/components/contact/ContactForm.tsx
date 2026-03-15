"use client";

import { useActionState } from "react";
import { submitInquiry } from "@/actions/inquiries";
import { INQUIRY_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitInquiry, null);

  if (state?.success) {
    return (
      <div className="rounded-xl bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-800">
          문의가 접수되었습니다
        </h3>
        <p className="mt-2 text-green-700">
          빠른 시일 내에 연락드리겠습니다. 감사합니다.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Error Message */}
      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="홍길동"
          className={cn(
            "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm",
            "placeholder:text-gray-400",
            "focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20",
            "transition-colors"
          )}
        />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          연락처 <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          placeholder="010-0000-0000"
          className={cn(
            "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm",
            "placeholder:text-gray-400",
            "focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20",
            "transition-colors"
          )}
        />
      </div>

      {/* Email (optional) */}
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          이메일 <span className="text-gray-400">(선택)</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="example@email.com"
          className={cn(
            "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm",
            "placeholder:text-gray-400",
            "focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20",
            "transition-colors"
          )}
        />
      </div>

      {/* Inquiry Type */}
      <div>
        <label
          htmlFor="inquiryType"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          문의 유형 <span className="text-red-500">*</span>
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          required
          defaultValue=""
          className={cn(
            "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm",
            "focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20",
            "transition-colors"
          )}
        >
          <option value="" disabled>
            문의 유형을 선택해주세요
          </option>
          {INQUIRY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          문의 내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="문의하실 내용을 자세히 적어주세요. (시공 위치, 원하는 자재, 예산 등)"
          className={cn(
            "w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm",
            "placeholder:text-gray-400",
            "focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20",
            "transition-colors"
          )}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "w-full rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-bold text-white",
          "transition-colors hover:bg-amber-600",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {isPending ? "접수 중..." : "문의하기"}
      </button>
    </form>
  );
}
