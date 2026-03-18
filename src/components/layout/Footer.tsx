"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { SITE_CONFIG, NAV_ITEMS } from "@/lib/constants";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="relative bg-primary text-white overflow-hidden">
      {/* Top accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
        className="h-px w-full origin-left bg-accent/30"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Top section - big company name */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">
            {SITE_CONFIG.name}
            <span className="text-accent">.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm text-white/40">
            인조대리석 가공 및 시공 전문 업체
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-12 md:grid-cols-3">
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h3 className="mb-6 text-xs font-medium tracking-[0.3em] uppercase text-white/30">
              바로가기
            </h3>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors duration-300 hover:text-accent"
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
            <h3 className="mb-6 text-xs font-medium tracking-[0.3em] uppercase text-white/30">
              연락처
            </h3>
            <ul className="space-y-4 text-sm text-white/60">
              <li>
                <span className="block text-[10px] font-medium uppercase tracking-widest text-white/30 mb-1">
                  Address
                </span>
                {SITE_CONFIG.address}
              </li>
              <li>
                <span className="block text-[10px] font-medium uppercase tracking-widest text-white/30 mb-1">
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
                <span className="block text-[10px] font-medium uppercase tracking-widest text-white/30 mb-1">
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
            <h3 className="mb-6 text-xs font-medium tracking-[0.3em] uppercase text-white/30">
              사업자 정보
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
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
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row"
        >
          <span className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </span>
          <span className="text-xs text-white/25">
            인조대리석 전문 시공
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
