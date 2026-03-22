"use client";

import { useRef } from "react";
import { motion, useTransform, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { useElementScroll } from "@/lib/hooks";

const milestones = [
  {
    year: "2000",
    title: "회사 설립",
    description: "인조대리석 가공 및 시공 전문 업체로 출발, 장인 정신으로 시작",
  },
  {
    year: "2005",
    title: "자체 공장 설립",
    description: "독립 가공 공장 마련, CNC 장비 도입으로 정밀 가공 체계 구축",
  },
  {
    year: "2010",
    title: "시공 10,000건 달성",
    description: "주방 싱크대, 세면대, 카운터 등 다양한 시공 경험 축적",
  },
  {
    year: "2015",
    title: "공장 확장 & 파트너십",
    description: "생산 시설 확장 및 대형 프랜차이즈 인테리어 공식 협력 업체 선정",
  },
  {
    year: "2020",
    title: "시공 30,000건 돌파",
    description: "고객 만족도 98% 달성, 지역 대표 시공 업체로 성장",
  },
  {
    year: "2026",
    title: "홈페이지 개설",
    description: "온라인 견적 시스템 도입 및 홈페이지 리뉴얼, 25년 노하우의 새로운 시작",
  },
];

export function CompanyHistory() {
  const { ref: sectionRef, scrollYProgress } = useElementScroll<HTMLElement>({
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 flex items-center gap-4">
          <div className="h-px w-12 bg-accent" />
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-accent">
            History
          </span>
        </div>
        <h2 className="mb-16 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          회사 연혁
        </h2>

        <div className="relative">
          {/* Timeline Line - scroll linked */}
          <div className="absolute left-6 top-0 h-full w-px bg-border sm:left-1/2 sm:-translate-x-px">
            <motion.div
              className="w-full bg-accent origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          {milestones.map((milestone, index) => (
            <MilestoneItem key={milestone.year} milestone={milestone} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MilestoneItem({ milestone, index }: { milestone: typeof milestones[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        "relative mb-12 flex items-start gap-6 last:mb-0",
        "sm:gap-0",
        index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
      )}
    >
      {/* Timeline Dot */}
      <div className="absolute left-6 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center sm:left-1/2">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="h-3 w-3 rounded-full bg-accent ring-4 ring-background"
        />
      </div>

      {/* Content */}
      <div
        className={cn(
          "ml-14 w-full rounded-xl border border-border bg-white p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-md sm:ml-0 sm:w-[calc(50%-2.5rem)]",
          index % 2 === 0 ? "sm:mr-auto sm:text-right" : "sm:ml-auto sm:text-left"
        )}
      >
        <span className="mb-2 inline-block text-2xl font-black text-accent">
          {milestone.year}
        </span>
        <h3 className="text-lg font-bold text-primary">
          {milestone.title}
        </h3>
        <p className="mt-1 text-sm text-secondary">
          {milestone.description}
        </p>
      </div>
    </motion.div>
  );
}
