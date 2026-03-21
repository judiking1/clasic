"use client";

import { useRef } from "react";
import { motion, useTransform, useInView } from "framer-motion";
import { useElementScroll } from "@/lib/hooks";
import TextReveal from "@/components/ui/TextReveal";

export default function CompanyIntro() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardsRef, { once: true, margin: "-100px" });

  const { ref: sectionRef, scrollYProgress } = useElementScroll<HTMLElement>({
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-32 sm:py-40">
      {/* Floating decorative elements */}
      <motion.div
        style={{ y: bgY }}
        className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-accent/[0.03] blur-3xl"
      />
      <motion.div
        style={{ y: bgY }}
        className="absolute -left-20 bottom-20 h-72 w-72 rounded-full bg-primary/[0.03] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial layout */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: Label + big statement */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex items-center gap-4"
            >
              <div className="h-px w-12 bg-accent" />
              <span className="text-[11px] font-medium tracking-[0.4em] uppercase text-accent">
                Why Classic
              </span>
            </motion.div>

            <div className="mb-8">
              <TextReveal
                as="h2"
                className="text-3xl font-bold leading-snug tracking-tight text-primary sm:text-4xl md:text-5xl"
              >
                최고의 품질과 합리적인 가격 그리고 전문적인 시공 서비스를 한 곳에서
              </TextReveal>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-8 h-px w-20 origin-left bg-accent/40"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="max-w-md text-base leading-relaxed text-secondary"
            >
              클레식은 인조대리석 전문 업체로서 원자재 선별부터 정밀 가공, 현장 시공까지
              모든 과정을 직접 수행합니다. 중간 유통 없이 고객에게 최상의 품질을
              합리적인 가격에 제공합니다.
            </motion.p>
          </div>

          {/* Right: Feature cards */}
          <div ref={cardsRef} className="flex flex-col gap-6">
            {[
              {
                number: "01",
                title: "직접 가공 & 시공",
                description: "자체 공장에서 직접 가공하고, 숙련된 기술자가 현장에서 직접 시공합니다. 중간 과정 없이 품질을 보장합니다.",
                icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
                  </svg>
                ),
              },
              {
                number: "02",
                title: "투명한 가격",
                description: "직접 가공과 시공으로 중간 마진을 제거했습니다. 합리적인 가격에 프리미엄 품질을 경험하세요.",
                icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                number: "03",
                title: "완벽한 마감",
                description: "30년 이상의 시공 노하우로 이음새 없는 완벽한 마감을 제공합니다. 세밀한 부분까지 놓치지 않습니다.",
                icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex gap-6 rounded-2xl border border-border/40 bg-white p-6 transition-all duration-700 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/[0.03] sm:p-8"
              >
                {/* Number + icon */}
                <div className="flex flex-col items-center gap-3">
                  <span className="font-serif text-2xl font-bold text-accent/30">
                    {feature.number}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-white">
                    {feature.icon}
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-bold text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-secondary">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
