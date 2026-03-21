"use client";

import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useElementScroll } from "@/lib/hooks";
import MagneticButton from "@/components/ui/MagneticButton";
import TextScramble from "@/components/ui/TextScramble";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 1,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const lineExpand = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      delay: 1.2,
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export default function HeroSection() {
  const { ref: sectionRef, scrollYProgress } = useElementScroll<HTMLElement>({
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);

  return (
    <section
      ref={sectionRef}
      className="relative z-20 min-h-screen w-full overflow-hidden"
    >
      {/* Subtle ambient glow (no solid bg — starlit shows through) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_30%_20%,rgba(184,149,106,0.08)_0%,transparent_50%)]" />
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_70%_80%,rgba(184,149,106,0.05)_0%,transparent_50%)]" />
      </div>

      {/* Content container */}
      <motion.div
        className="relative z-30 flex min-h-screen items-center"
        style={{ opacity, scale }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-screen grid-cols-1 items-center gap-8 py-20 sm:py-24 lg:grid-cols-5">
            {/* Left: Text content - takes 3 cols */}
            <motion.div style={{ y }} className="relative z-10 pt-4 lg:col-span-3 lg:pt-0">
              {/* Badge */}
              <motion.div
                custom={0.3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mb-8"
              >
                <span className="glass-premium inline-flex items-center gap-3 rounded-full px-5 py-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
                  <span className="text-[11px] font-medium tracking-[0.3em] text-white/70 uppercase">
                    Premium Artificial Marble
                  </span>
                </span>
              </motion.div>

              {/* Main heading with scramble effect */}
              <motion.div
                custom={0.5}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  <TextScramble
                    text="공간의 품격을"
                    as="span"
                    className="block"
                    delay={800}
                    speed={40}
                  />
                  <span className="block mt-2">
                    <TextScramble
                      text="완성하는 대리석"
                      as="span"
                      className="text-accent-gradient"
                      delay={1200}
                      speed={40}
                    />
                  </span>
                </h1>
              </motion.div>

              {/* Accent line */}
              <motion.div
                className="my-8 h-px w-20 origin-left bg-accent sm:w-28"
                variants={lineExpand}
                initial="hidden"
                animate="visible"
              />

              {/* Subtitle */}
              <motion.p
                custom={0.9}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mb-10 max-w-lg text-base leading-relaxed text-white/50 sm:text-lg"
              >
                30년 경력의 장인이 직접 가공하고 시공합니다.
                <br className="hidden sm:block" />
                정밀한 맞춤 제작으로 고객의 공간에 프리미엄 가치를 더합니다.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                custom={1.2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4 sm:flex-row sm:gap-5"
              >
                <MagneticButton strength={0.15}>
                  <Link
                    href="/contact"
                    className={cn(
                      "group relative inline-flex items-center justify-center gap-3",
                      "rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white",
                      "overflow-hidden transition-all duration-700",
                      "hover:shadow-2xl hover:shadow-accent/25"
                    )}
                  >
                    <span className="relative z-10">무료 견적 상담</span>
                    <svg
                      className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent-light to-accent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  </Link>
                </MagneticButton>

                <MagneticButton strength={0.15}>
                  <Link
                    href="/portfolio"
                    className={cn(
                      "group inline-flex items-center justify-center gap-3",
                      "glass-premium rounded-full px-8 py-4",
                      "text-sm font-semibold text-white/80",
                      "transition-all duration-700",
                      "hover:border-accent/40 hover:text-white hover:bg-white/[0.08]"
                    )}
                  >
                    시공사례 보기
                    <svg
                      className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </MagneticButton>
              </motion.div>
            </motion.div>

            {/* Right: Glass info panel - takes 2 cols */}
            <motion.div
              custom={1.5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="relative z-10 hidden lg:col-span-2 lg:flex lg:flex-col lg:gap-5"
            >
              {/* Trust stats in glass panels */}
              {[
                { value: "500+", label: "시공 완료", desc: "주방, 욕실, 카운터 등" },
                { value: "30년+", label: "전문 경력", desc: "인조대리석 가공 및 시공" },
                { value: "98%", label: "고객 만족도", desc: "재시공 의뢰 및 추천" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.value}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-premium rounded-2xl px-6 py-5 transition-all duration-500 hover:bg-white/[0.08]"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-3xl font-black text-white tabular-nums">{stat.value}</span>
                    <div>
                      <p className="text-sm font-semibold text-white/80">{stat.label}</p>
                      <p className="text-xs text-white/40">{stat.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile: Trust indicators */}
            <motion.div
              custom={1.5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-4 lg:hidden"
            >
              <div className="glass-premium rounded-2xl p-5">
                <div className="flex items-center justify-between gap-4">
                  {[
                    { value: "500+", label: "시공\n완료" },
                    { value: "30년", label: "전문\n경력" },
                    { value: "98%", label: "고객\n만족" },
                  ].map((stat, i) => (
                    <div key={stat.value} className="flex items-center gap-3">
                      {i > 0 && <div className="mr-2 h-8 w-px bg-white/10" />}
                      <span className="text-xl font-bold text-white">{stat.value}</span>
                      <span className="text-[11px] text-white/40 leading-tight whitespace-pre">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[11px] font-light tracking-[0.3em] text-white/30 uppercase">
            Scroll
          </span>
          <div className="h-12 w-[1px] bg-gradient-to-b from-accent/50 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent z-10" />
    </section>
  );
}
