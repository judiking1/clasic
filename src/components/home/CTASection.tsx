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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(184,149,106,0.18)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(184,149,106,0.12)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(184,149,106,0.10)_0%,transparent_50%)]" />

        {/* Decorative lines */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.03]" preserveAspectRatio="none" viewBox="0 0 1200 600">
          <path d="M0,300 C200,280 400,320 600,290 C800,260 1000,310 1200,300" stroke="white" strokeWidth="1" fill="none" />
          <path d="M0,350 C300,330 500,370 700,340 C900,310 1100,360 1200,350" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M0,250 C250,270 450,230 650,260 C850,290 1050,240 1200,250" stroke="white" strokeWidth="0.8" fill="none" />
        </svg>
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
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-xs font-medium tracking-[0.3em] uppercase text-white/80">
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
            프로젝트를
            <br />
            <span className="text-accent-gradient">시작하세요</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg"
          >
            인조대리석 시공에 대해 궁금한 점이 있으시면 언제든 연락주세요.
          </motion.p>

          {/* Phone number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12"
          >
            <a
              href={`tel:${phone.replace(/-/g, "")}`}
              className="group inline-flex items-center gap-4 text-4xl font-black tracking-wider text-white transition-colors duration-300 hover:text-accent sm:text-5xl md:text-6xl"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/10 transition-all duration-500 group-hover:border-accent/50 group-hover:bg-accent/20 group-hover:scale-110">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </span>
              <span>{phone}</span>
            </a>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12"
          >
            <MagneticButton strength={0.2}>
              <Link
                href="/contact"
                className={cn(
                  "group relative inline-flex items-center justify-center gap-3",
                  "rounded-full bg-accent px-10 py-5",
                  "text-base font-semibold text-white",
                  "overflow-hidden transition-all duration-500",
                  "hover:shadow-2xl hover:shadow-accent/30",
                  "animate-pulse-glow"
                )}
              >
                <span className="relative z-10">온라인 문의하기</span>
                <svg className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                {/* Hover shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Hours */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 text-sm text-white/50"
          >
            평일 09:00 - 18:00 &middot; 토요일 09:00 - 13:00
          </motion.p>
        </div>
      </div>
    </section>
  );
}
