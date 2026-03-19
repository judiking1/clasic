"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { useElementScroll } from "@/lib/hooks";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: Stat[] = [
  { value: 500, suffix: "+", label: "시공 건수", description: "주방, 욕실, 카운터 등 다양한 공간" },
  { value: 30, suffix: "년+", label: "전문 경력", description: "인조대리석 가공 및 시공 전문" },
  { value: 98, suffix: "%", label: "고객 만족도", description: "재시공 의뢰 및 추천 비율" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration: 2.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

export default function StatsCounter() {
  const { ref: sectionRef, scrollYProgress } = useElementScroll<HTMLElement>({
    offset: ["start end", "end start"],
  });

  const lineWidth = useTransform(scrollYProgress, [0.2, 0.5], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-32 sm:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.04)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-20 text-center sm:mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 block text-[11px] font-medium tracking-[0.4em] uppercase text-accent"
          >
            Achievements
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl"
          >
            숫자로 보는 <span className="text-accent">클래식</span>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 h-px w-16 origin-center bg-accent"
          />
        </div>

        <motion.div
          className="mb-16 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent sm:mb-20"
          style={{ width: lineWidth }}
        />

        <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-0">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn(
                "relative text-center",
                index < stats.length - 1 && "md:border-r md:border-border/60",
                "md:px-12"
              )}
            >
              <div className="text-6xl font-black tracking-tight text-primary sm:text-7xl md:text-8xl">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-4 text-base font-semibold text-primary">
                {stat.label}
              </div>
              <div className="mt-2 text-sm text-secondary">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
