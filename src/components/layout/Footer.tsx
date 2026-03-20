"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { SITE_CONFIG, NAV_ITEMS } from "@/lib/constants";
import CLSLogo from "@/components/ui/CLSLogo";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="relative bg-primary text-white overflow-hidden">
      {/* Top accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="h-px w-full origin-left bg-gradient-to-r from-accent/40 via-accent/20 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        {/* Top section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-4">
              <CLSLogo size="lg" variant="light" />
              <h2 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                {SITE_CONFIG.name}
                <span className="text-accent">.</span>
              </h2>
            </div>
            <p className="mt-4 max-w-md text-sm text-white/30">
              인조대리석 가공 및 시공 전문 업체
              <br />
              공간의 품격을 완성합니다.
            </p>
          </div>

          {/* Quick CTA */}
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/10 px-6 py-3 text-sm font-medium text-accent transition-all duration-500 hover:bg-accent/20"
          >
            무료 견적 받기
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 h-px w-full origin-left bg-white/[0.06]"
        />

        {/* Grid */}
        <div className="grid gap-12 md:grid-cols-3">
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h3 className="mb-6 text-[10px] font-medium tracking-[0.4em] uppercase text-white/25">
              바로가기
            </h3>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/50 transition-colors duration-300 hover:text-accent"
                  >
                    <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="mb-6 text-[10px] font-medium tracking-[0.4em] uppercase text-white/25">
              연락처
            </h3>
            <ul className="space-y-5 text-sm text-white/50">
              <li>
                <span className="mb-1 block text-[9px] font-medium uppercase tracking-[0.3em] text-accent/50">
                  Address
                </span>
                {SITE_CONFIG.address}
              </li>
              <li>
                <span className="mb-1 block text-[9px] font-medium uppercase tracking-[0.3em] text-accent/50">
                  Phone
                </span>
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/-/g, "")}`}
                  className="transition-colors duration-300 hover:text-accent"
                >
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <span className="mb-1 block text-[9px] font-medium uppercase tracking-[0.3em] text-accent/50">
                  Email
                </span>
                {SITE_CONFIG.email}
              </li>
            </ul>
          </motion.div>

          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 className="mb-6 text-[10px] font-medium tracking-[0.4em] uppercase text-white/25">
              사업자 정보
            </h3>
            <ul className="space-y-3 text-sm text-white/50">
              <li>대표: {SITE_CONFIG.owner}</li>
              <li>사업자등록번호: {SITE_CONFIG.businessNumber}</li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/[0.04] pt-8 sm:flex-row"
        >
          <span className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </span>
          <span className="text-xs text-white/20">
            Premium Artificial Marble Specialist
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
