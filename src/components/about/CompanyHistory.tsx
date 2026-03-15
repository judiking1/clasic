"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const milestones = [
  {
    year: "2010",
    title: "회사 설립",
    description: "인조대리석 가공 및 시공 전문 업체로 출발",
  },
  {
    year: "2013",
    title: "공장 확장",
    description: "최신 CNC 장비 도입 및 생산 시설 확장",
  },
  {
    year: "2016",
    title: "시공 500건 달성",
    description: "주방 싱크대, 세면대, 카운터 등 다양한 시공 경험 축적",
  },
  {
    year: "2019",
    title: "프랜차이즈 파트너십",
    description: "대형 프랜차이즈 인테리어 공식 협력 업체 선정",
  },
  {
    year: "2022",
    title: "시공 1,500건 돌파",
    description: "고객 만족도 98% 달성, 지역 대표 시공 업체로 성장",
  },
  {
    year: "2024",
    title: "디지털 전환",
    description: "온라인 견적 시스템 도입 및 홈페이지 리뉴얼",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function CompanyHistory() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          회사 연혁
        </h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 h-full w-0.5 bg-amber-200 sm:left-1/2 sm:-translate-x-px" />

          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              variants={itemVariants}
              className={cn(
                "relative mb-10 flex items-start gap-6 last:mb-0",
                "sm:gap-0",
                index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
              )}
            >
              {/* Timeline Dot */}
              <div className="absolute left-6 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center sm:left-1/2">
                <div className="h-3 w-3 rounded-full bg-amber-500 ring-4 ring-amber-100" />
              </div>

              {/* Content */}
              <div
                className={cn(
                  "ml-12 w-full rounded-xl bg-white p-5 shadow-sm sm:ml-0 sm:w-[calc(50%-2rem)]",
                  index % 2 === 0 ? "sm:mr-auto sm:text-right" : "sm:ml-auto sm:text-left"
                )}
              >
                <span className="mb-1 inline-block rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-700">
                  {milestone.year}
                </span>
                <h3 className="mt-2 text-lg font-bold text-gray-900">
                  {milestone.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
