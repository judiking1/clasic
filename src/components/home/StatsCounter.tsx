"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: Stat[] = [
  {
    value: 500,
    suffix: "+",
    label: "시공 건수",
    description: "다양한 주거 및 상업 공간에 인조대리석을 시공한 누적 실적",
  },
  {
    value: 15,
    suffix: "년+",
    label: "경력",
    description: "인조대리석 가공 및 시공 분야에서 쌓아온 전문 경험",
  },
  {
    value: 98,
    suffix: "%",
    label: "고객 만족도",
    description: "시공 완료 후 고객 설문을 통해 확인된 만족도 비율",
  },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration: 2,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function StatsCounter() {
  return (
    <section className="relative overflow-hidden bg-stone-900 py-24 sm:py-32">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-800/50 via-stone-900 to-stone-900" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center sm:mb-20"
        >
          <span className="mb-3 inline-block text-sm font-medium tracking-widest text-stone-500">
            OUR ACHIEVEMENTS
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            숫자로 보는 클래식 스톤
          </h2>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-8 sm:gap-6 md:grid-cols-3"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className={cn(
                "group relative text-center",
                "rounded-2xl border border-stone-700/50 bg-stone-800/40 p-8 sm:p-10",
                "backdrop-blur-sm",
                "transition-all duration-500",
                "hover:border-stone-600/60 hover:bg-stone-800/60"
              )}
            >
              {/* Large number */}
              <div className="mb-3 text-5xl font-bold text-white sm:text-6xl">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <div className="mb-3 text-lg font-semibold text-stone-300">
                {stat.label}
              </div>

              {/* Divider */}
              <div className="mx-auto mb-4 h-px w-12 bg-stone-600 transition-all duration-500 group-hover:w-20 group-hover:bg-stone-500" />

              {/* Description */}
              <p className="text-sm leading-relaxed text-stone-500">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
