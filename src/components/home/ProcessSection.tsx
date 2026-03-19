"use client";

import { useRef } from "react";
import { motion, useInView, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useElementScroll } from "@/lib/hooks";

const steps = [
  {
    number: "01",
    title: "상담 & 견적",
    description: "고객의 공간과 니즈를 파악하여 최적의 소재와 디자인을 제안하고, 투명한 견적을 제공합니다.",
    detail: "무료 방문 상담",
  },
  {
    number: "02",
    title: "실측 & 설계",
    description: "전문 기술자가 직접 현장을 방문하여 정밀 실측을 진행하고, 맞춤 설계 도면을 작성합니다.",
    detail: "mm 단위 정밀 측정",
  },
  {
    number: "03",
    title: "가공 & 제작",
    description: "자체 공장에서 최신 장비를 이용한 정밀 가공으로 완벽한 인조대리석 제품을 제작합니다.",
    detail: "자체 공장 보유",
  },
  {
    number: "04",
    title: "시공 & 마감",
    description: "숙련된 전문 기술자가 직접 시공하여 이음새 없는 완벽한 마감을 제공합니다.",
    detail: "A/S 보장",
  },
];

export default function ProcessSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  const { ref: sectionRef, scrollYProgress } = useElementScroll<HTMLElement>({
    offset: ["start end", "end start"],
  });

  const lineProgress = useTransform(scrollYProgress, [0.1, 0.7], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-primary py-32 sm:py-40">
      {/* Ambient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(184,149,106,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(184,149,106,0.06)_0%,transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="mb-20 text-center sm:mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 block text-[11px] font-medium tracking-[0.4em] uppercase text-accent"
          >
            Our Process
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            시공 프로세스
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 h-px w-16 origin-center bg-accent"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mx-auto mt-6 max-w-lg text-base text-white/40"
          >
            상담부터 시공까지, 체계적인 4단계 프로세스로 완벽한 결과를 보장합니다
          </motion.p>
        </div>

        {/* Process steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-[3.5rem] hidden h-px bg-white/[0.06] lg:block">
            <motion.div
              className="h-full bg-accent/40 origin-left"
              style={{ width: lineProgress }}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative"
              >
                {/* Step number circle */}
                <div className="relative z-10 mb-8 flex items-center gap-4 lg:justify-center">
                  <div className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full",
                    "border border-white/10 bg-white/[0.03] backdrop-blur-sm",
                    "transition-all duration-700",
                    "group-hover:border-accent/40 group-hover:bg-accent/10"
                  )}>
                    <span className="font-serif text-lg font-bold text-accent">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:text-center">
                  <h3 className="mb-3 text-xl font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="mb-4 text-sm leading-relaxed text-white/40">
                    {step.description}
                  </p>

                  {/* Detail tag */}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-3 py-1">
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    <span className="text-[10px] font-medium tracking-wider text-accent/80">
                      {step.detail}
                    </span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
