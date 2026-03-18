"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MarbleHero = dynamic(
  () => import("@/components/three/MarbleHero"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-stone-950">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-stone-700 border-t-stone-300" />
        </div>
      </div>
    ),
  }
);

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.15,
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-stone-950">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <MarbleHero />
      </div>

      {/* Dark gradient overlay for text readability */}
      <div
        className={cn(
          "absolute inset-0 z-10",
          "bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent"
        )}
      />

      {/* Top subtle gradient */}
      <div className="absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-stone-950/40 to-transparent" />

      {/* Content overlay */}
      <motion.div
        className="relative z-20 flex h-full flex-col items-center justify-end pb-20 sm:pb-28 md:pb-32"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Company badge */}
        <motion.div
          custom={0}
          variants={fadeInUp}
          className="mb-4 rounded-full border border-stone-500/30 bg-stone-900/50 px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="text-xs font-medium tracking-widest text-stone-300 sm:text-sm">
            인조대리석 전문
          </span>
        </motion.div>

        {/* Company name */}
        <motion.h1
          custom={1}
          variants={fadeInUp}
          className="mb-4 text-center text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
        >
          클래식
        </motion.h1>

        {/* Tagline */}
        <motion.p
          custom={2}
          variants={fadeInUp}
          className="mb-10 max-w-lg text-center text-base font-light leading-relaxed text-stone-300 sm:text-lg md:text-xl"
        >
          인조대리석 전문 가공 및 시공
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          custom={3}
          variants={fadeInUp}
          className="flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <Link
            href="/portfolio"
            className={cn(
              "group relative inline-flex items-center justify-center gap-2",
              "rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-stone-900",
              "transition-all duration-300",
              "hover:bg-stone-100 hover:shadow-lg hover:shadow-white/10",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            )}
          >
            시공사례 보기
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          <Link
            href="/contact"
            className={cn(
              "group inline-flex items-center justify-center gap-2",
              "rounded-lg border border-stone-500/40 bg-stone-900/40 px-7 py-3.5",
              "text-sm font-semibold text-white backdrop-blur-sm",
              "transition-all duration-300",
              "hover:border-stone-400/60 hover:bg-stone-800/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            )}
          >
            무료 견적 문의
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] font-light tracking-widest text-stone-500">
              SCROLL
            </span>
            <svg
              className="h-4 w-4 text-stone-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
