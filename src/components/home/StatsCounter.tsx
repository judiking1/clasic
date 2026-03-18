"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { useElementScroll } from "@/lib/hooks";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 500, suffix: "+", label: "시공 건수" },
  { value: 15, suffix: "년+", label: "경력" },
  { value: 98, suffix: "%", label: "고객 만족도" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration: 2.5,
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
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.04)_0%,transparent_70%)]" />

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
            Achievements
          </span>
        </motion.div>

        {/* Section title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-20 text-3xl font-bold tracking-tight text-primary sm:mb-24 sm:text-4xl"
        >
          숫자로 보는 클래식
        </motion.h2>

        {/* Animated horizontal line */}
        <motion.div
          className="mb-16 h-px bg-accent/30 sm:mb-20"
          style={{ width: lineWidth }}
        />

        {/* Stats - large typography */}
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
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className={cn(
                "relative text-center md:text-left",
                index < stats.length - 1 && "md:border-r md:border-border",
                "md:px-12 first:md:pl-0 last:md:pr-0"
              )}
            >
              {/* Large number */}
              <div className="text-6xl font-black tracking-tight text-primary sm:text-7xl md:text-8xl">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <div className="mt-4 text-base font-medium uppercase tracking-[0.2em] text-secondary">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
