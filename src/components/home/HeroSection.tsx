"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useElementScroll } from "@/lib/hooks";
import MagneticButton from "@/components/ui/MagneticButton";

const MarbleBackground = dynamic(
  () => import("@/components/three/MarbleBackground"),
  { ssr: false }
);

const charVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      delay: 0.8 + i * 0.05,
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const lineExpand = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      delay: 1.5,
      duration: 1,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function HeroSection() {
  const { ref: sectionRef, scrollYProgress } = useElementScroll<HTMLElement>({
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const title = "클래식";

  return (
    <section
      ref={sectionRef}
      className="relative h-[110vh] w-full overflow-hidden bg-primary"
    >
      {/* Animated marble shader background */}
      <motion.div className="absolute inset-0 opacity-30" style={{ y }}>
        <MarbleBackground />
      </motion.div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.7)_70%,rgba(10,10,10,0.95)_100%)]" />

      {/* Accent glow */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[40vh] w-[40vh] rounded-full bg-accent/10 blur-[120px]" />

      {/* Content */}
      <motion.div
        className="relative z-20 flex h-full flex-col items-center justify-center"
        style={{ opacity, scale }}
      >
        {/* Badge */}
        <motion.div
          custom={0.5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
            <span className="text-xs font-medium tracking-[0.3em] text-white/70 uppercase">
              Artificial Marble Specialist
            </span>
          </span>
        </motion.div>

        {/* Main title - character split animation */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            className="flex text-[15vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] font-black leading-[0.9] tracking-tighter text-white"
            initial="hidden"
            animate="visible"
          >
            {title.split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={charVariants}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Horizontal accent line */}
        <motion.div
          className="my-6 h-px w-24 origin-center bg-accent sm:w-32"
          variants={lineExpand}
          initial="hidden"
          animate="visible"
        />

        {/* Subtitle */}
        <motion.p
          custom={1.8}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-12 max-w-md text-center text-sm font-light tracking-[0.2em] uppercase text-white/50 sm:text-base"
        >
          인조대리석 전문 가공 및 시공
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          custom={2.1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 sm:flex-row sm:gap-6"
        >
          <MagneticButton strength={0.2}>
            <Link
              href="/portfolio"
              className={cn(
                "group relative inline-flex items-center justify-center gap-3",
                "rounded-full bg-white px-8 py-4 text-sm font-semibold text-primary",
                "overflow-hidden transition-all duration-500",
                "hover:shadow-2xl hover:shadow-white/20"
              )}
            >
              <span className="relative z-10">시공사례 보기</span>
              <svg
                className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              {/* Hover fill */}
              <div className="absolute inset-0 bg-accent scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
              <span className="absolute inset-0 flex items-center justify-center gap-3 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                시공사례 보기
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </MagneticButton>

          <MagneticButton strength={0.2}>
            <Link
              href="/contact"
              className={cn(
                "group inline-flex items-center justify-center gap-3",
                "rounded-full border border-white/20 bg-white/5 px-8 py-4",
                "text-sm font-semibold text-white backdrop-blur-sm",
                "transition-all duration-500",
                "hover:border-accent/50 hover:bg-accent/10"
              )}
            >
              무료 견적 문의
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[9px] font-light tracking-[0.4em] text-white/30 uppercase">
            Scroll to explore
          </span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
