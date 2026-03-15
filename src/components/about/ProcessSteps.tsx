"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: 1,
    title: "상담",
    description: "고객님의 요구사항과 공간을 파악합니다",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    step: 2,
    title: "실측",
    description: "현장 방문하여 정확한 치수를 측정합니다",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    step: 3,
    title: "제작",
    description: "최고급 인조대리석으로 정밀하게 제작합니다",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.658-3.163c-.418-.235-.418-.826 0-1.06L11.42 7.83a1 1 0 011.16 0l5.658 3.163c.418.235.418.826 0 1.06l-5.658 3.164a1 1 0 01-1.16 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.762 12.008L11.42 15.17a1 1 0 001.16 0l5.658-3.163M5.762 16.008l5.658 3.163a1 1 0 001.16 0l5.658-3.163" />
      </svg>
    ),
  },
  {
    step: 4,
    title: "시공",
    description: "전문 기술진이 깔끔하게 설치합니다",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    step: 5,
    title: "A/S",
    description: "시공 후에도 책임지고 관리해드립니다",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function ProcessSteps() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          시공 프로세스
        </h2>
        <p className="mb-12 text-center text-gray-600">
          체계적인 과정을 통해 최상의 결과물을 만들어냅니다
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-0"
        >
          {/* Connecting Line (desktop) */}
          <div className="absolute left-[10%] right-[10%] top-12 hidden h-0.5 bg-amber-200 md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              variants={itemVariants}
              className="relative z-10 flex w-full flex-row items-center gap-4 md:w-auto md:flex-col md:items-center"
            >
              {/* Icon Circle */}
              <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-4 ring-white">
                {step.icon}
                <span className="mt-0.5 text-[10px] font-bold text-amber-500">
                  STEP {step.step}
                </span>
              </div>

              {/* Text */}
              <div className="md:mt-4 md:text-center">
                <h3 className="text-lg font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 md:max-w-[140px]">
                  {step.description}
                </p>
              </div>

              {/* Arrow between steps (desktop) */}
              {index < steps.length - 1 && (
                <div className="absolute -right-3 top-12 hidden -translate-y-1/2 text-amber-300 md:block">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
