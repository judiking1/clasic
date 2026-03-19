"use client";

import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { useElementScroll } from "@/lib/hooks";
import MagneticButton from "@/components/ui/MagneticButton";

export default function CTASection() {
  const phone = SITE_CONFIG?.phone ?? "031-000-0000";

  const { ref: sectionRef, scrollYProgress } = useElementScroll<HTMLElement>({
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1.05, 1]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Dark background with animated scale */}
      <motion.div className="absolute inset-0 bg-primary" style={{ scale: bgScale }}>
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(184,149,106,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(184,149,106,0.10)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(184,149,106,0.08)_0%,transparent_50%)]" />
      </motion.div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 sm:py-40 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-white/60">
                Contact Us
              </span>
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            당신의 공간에
            <br />
            <span className="text-accent-gradient">품격</span>
            <span>을 더하세요</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base leading-relaxed text-white/50 sm:text-lg"
          >
            무료 방문 상담과 정확한 견적을 제공해드립니다.
            <br className="hidden sm:block" />
            전화 한 통으로 프리미엄 인조대리석 시공을 시작하세요.
          </motion.p>

          {/* Phone number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12"
          >
            <a
              href={`tel:${phone.replace(/-/g, "")}`}
              className="group inline-flex items-center gap-5 transition-colors duration-300"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/10 transition-all duration-500 group-hover:border-accent/50 group-hover:bg-accent/20 group-hover:scale-110">
                <svg className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </span>
              <span className="text-4xl font-bold tracking-wider text-white transition-colors duration-300 group-hover:text-accent sm:text-5xl">
                {phone}
              </span>
            </a>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5"
          >
            <MagneticButton strength={0.15}>
              <Link
                href="/contact"
                className={cn(
                  "group relative inline-flex items-center justify-center gap-3",
                  "rounded-full bg-accent px-10 py-4",
                  "text-sm font-semibold text-white",
                  "overflow-hidden transition-all duration-700",
                  "hover:shadow-2xl hover:shadow-accent/25"
                )}
              >
                <span className="relative z-10">온라인 견적 문의</span>
                <svg className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                  "rounded-full border border-white/15 bg-white/[0.03] px-10 py-4",
                  "text-sm font-semibold text-white/70 backdrop-blur-sm",
                  "transition-all duration-700",
                  "hover:border-accent/40 hover:text-white"
                )}
              >
                시공사례 보기
                <svg className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
