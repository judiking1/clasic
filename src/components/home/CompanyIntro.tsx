"use client";

import { useRef } from "react";
import { motion, useTransform, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { useElementScroll } from "@/lib/hooks";
import TextReveal from "@/components/ui/TextReveal";

const features = [
  {
    number: "01",
    title: "맞춤 제작",
    description:
      "고객의 공간과 요구에 맞는 정밀한 맞춤 설계와 가공으로 완벽한 인조대리석 제품을 제작합니다.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "직접 시공",
    description:
      "숙련된 전문 기술자가 직접 시공하여 마감 품질을 보장합니다. 중간 과정 없이 신속하고 정확하게 완성합니다.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "합리적인 가격",
    description:
      "직접 가공과 시공으로 중간 마진을 줄여 합리적인 가격에 최고 품질의 인조대리석을 제공합니다.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};

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
        className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-accent/5 blur-3xl"
      />
      <motion.div
        style={{ y: bgY }}
        className="absolute -left-20 bottom-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center gap-4"
        >
          <div className="h-px w-12 bg-accent" />
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-accent">
            Why Classic
          </span>
        </motion.div>

        {/* Big statement text with scroll-linked word reveal */}
        <div className="mb-20 max-w-4xl sm:mb-28">
          <TextReveal
            as="h2"
            className="text-3xl font-bold leading-snug tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl"
          >
            최고의 품질과 합리적인 가격 그리고 전문적인 시공 서비스를 한 곳에서
          </TextReveal>
        </div>

        {/* Feature cards - horizontal layout */}
        <div ref={cardsRef} className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className={cn(
                "group relative p-8 sm:p-10 md:p-12",
                index < features.length - 1 && "md:border-r md:border-border"
              )}
            >
              {/* Number */}
              <span className="mb-8 block text-[5rem] font-black leading-none text-primary/[0.04] sm:text-[6rem]">
                {feature.number}
              </span>

              {/* Icon with accent background */}
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-all duration-500 group-hover:bg-accent group-hover:text-white">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mb-4 text-xl font-bold text-primary sm:text-2xl">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-secondary sm:text-base">
                {feature.description}
              </p>

              {/* Bottom accent line on hover */}
              <div className="absolute bottom-0 left-8 right-8 h-[2px] scale-x-0 bg-accent transition-transform duration-700 origin-left group-hover:scale-x-100 md:left-12 md:right-12" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
