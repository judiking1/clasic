"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { submitInquiry } from "@/actions/inquiries";
import { INQUIRY_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const inputStyles = cn(
  "w-full rounded-lg border border-border bg-background px-4 py-3.5 text-sm text-primary",
  "placeholder:text-secondary/50",
  "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10",
  "transition-all duration-300"
);

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitInquiry, null);

  if (state?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-success/20 bg-success/5 p-10 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-primary">
          문의가 접수되었습니다
        </h3>
        <p className="mt-2 text-sm text-secondary">
          빠른 시일 내에 연락드리겠습니다. 감사합니다.
        </p>
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-secondary">
          이름 <span className="text-destructive">*</span>
        </label>
        <input type="text" id="name" name="name" required placeholder="홍길동" className={inputStyles} />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-secondary">
          연락처 <span className="text-destructive">*</span>
        </label>
        <input type="tel" id="phone" name="phone" required placeholder="010-0000-0000" className={inputStyles} />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-secondary">
          이메일 <span className="text-secondary/40">(선택)</span>
        </label>
        <input type="email" id="email" name="email" placeholder="example@email.com" className={inputStyles} />
      </div>

      <div>
        <label htmlFor="inquiryType" className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-secondary">
          문의 유형 <span className="text-destructive">*</span>
        </label>
        <select id="inquiryType" name="inquiryType" required defaultValue="" className={inputStyles}>
          <option value="" disabled>문의 유형을 선택해주세요</option>
          {INQUIRY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-secondary">
          문의 내용 <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="문의하실 내용을 자세히 적어주세요. (시공 위치, 원하는 자재, 예산 등)"
          className={cn(inputStyles, "resize-none")}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "group relative w-full overflow-hidden rounded-lg bg-primary px-6 py-4 text-sm font-semibold text-white",
          "transition-all duration-500",
          "hover:shadow-xl hover:shadow-primary/20",
          "focus:outline-none focus:ring-2 focus:ring-accent/50",
          "disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        <span className="relative z-10">
          {isPending ? "접수 중..." : "문의하기"}
        </span>
        {/* Hover fill effect */}
        <div className="absolute inset-0 bg-accent scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
      </button>
    </form>
  );
}
