"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function CTASection() {
  const phone = SITE_CONFIG?.phone ?? "031-000-0000";

  return (
    <section className="relative overflow-hidden">
      {/* Dark marble-textured background */}
      <div className="absolute inset-0 bg-stone-950">
        {/* Marble texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 60% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)
            `,
          }}
        />
        {/* Vein-like decorative lines */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.04]"
          preserveAspectRatio="none"
          viewBox="0 0 1200 400"
        >
          <path
            d="M0,200 C200,180 400,220 600,190 C800,160 1000,210 1200,200"
            stroke="white"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M0,250 C300,230 500,270 700,240 C900,210 1100,260 1200,250"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
          />
          <path
            d="M0,150 C250,170 450,130 650,160 C850,190 1050,140 1200,150"
            stroke="white"
            strokeWidth="0.8"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center rounded-full border border-stone-700/50 bg-stone-800/50 px-4 py-1.5 text-xs font-medium tracking-widest text-stone-400 backdrop-blur-sm">
              CONTACT US
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            무료 견적 문의
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mt-4 text-base leading-relaxed text-stone-400 sm:text-lg"
          >
            인조대리석 시공에 대해 궁금한 점이 있으시면 언제든 연락주세요.
            <br className="hidden sm:block" />
            전문 상담원이 친절하게 안내해드립니다.
          </motion.p>

          {/* Phone number */}
          <motion.div variants={itemVariants} className="mt-10">
            <a
              href={`tel:${phone.replace(/-/g, "")}`}
              className={cn(
                "group inline-flex items-center gap-3",
                "text-3xl font-bold text-white sm:text-4xl md:text-5xl",
                "transition-colors duration-300 hover:text-stone-300"
              )}
            >
              <span
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full",
                  "bg-white/10 backdrop-blur-sm",
                  "transition-all duration-300",
                  "group-hover:bg-white/20 group-hover:scale-110"
                )}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
              </span>
              <span className="tracking-wider">{phone}</span>
            </a>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="mt-10">
            <Link
              href="/contact"
              className={cn(
                "group inline-flex items-center justify-center gap-2.5",
                "rounded-xl bg-white px-8 py-4",
                "text-base font-semibold text-stone-900",
                "shadow-lg shadow-black/20",
                "transition-all duration-300",
                "hover:bg-stone-100 hover:shadow-xl hover:shadow-black/30",
                "hover:-translate-y-0.5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              )}
            >
              문의하기
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
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
          </motion.div>

          {/* Supplementary info */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-sm text-stone-600"
          >
            평일 09:00 - 18:00 &middot; 토요일 09:00 - 13:00
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
