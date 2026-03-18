"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

const steps = [
  {
    step: 1,
    title: "상담",
    description: "고객님의 요구사항과 공간을 파악합니다",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    step: 2,
    title: "실측",
    description: "현장 방문하여 정확한 치수를 측정합니다",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    step: 3,
    title: "제작",
    description: "최고급 인조대리석으로 정밀하게 제작합니다",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
      </svg>
    ),
  },
  {
    step: 4,
    title: "시공",
    description: "전문 기술진이 깔끔하게 설치합니다",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.658-3.163c-.418-.235-.418-.826 0-1.06L11.42 7.83a1 1 0 011.16 0l5.658 3.163c.418.235.418.826 0 1.06l-5.658 3.164a1 1 0 01-1.16 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.762 12.008L11.42 15.17a1 1 0 001.16 0l5.658-3.163M5.762 16.008l5.658 3.163a1 1 0 001.16 0l5.658-3.163" />
      </svg>
    ),
  },
  {
    step: 5,
    title: "A/S",
    description: "시공 후에도 책임지고 관리해드립니다",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export function ProcessSteps() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-primary py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px w-12 bg-accent" />
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-accent">
            Process
          </span>
        </div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          시공 프로세스
        </h2>
        <p className="mb-16 text-base text-white/40">
          체계적인 과정을 통해 최상의 결과물을 만들어냅니다
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-5 md:gap-0">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className={cn(
                "group relative p-6 md:p-8 text-center",
                index < steps.length - 1 && "md:border-r md:border-white/10"
              )}
            >
              {/* Step number */}
              <span className="mb-4 block text-[10px] font-medium tracking-[0.3em] text-accent">
                STEP {String(step.step).padStart(2, "0")}
              </span>

              {/* Icon */}
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-accent transition-all duration-500 group-hover:border-accent/30 group-hover:bg-accent/10">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="mb-2 text-lg font-bold text-white">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-white/40 md:max-w-[160px] md:mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
