"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useElementScroll } from "@/lib/hooks";
import TiltCard from "@/components/ui/TiltCard";

const services = [
  {
    title: "주방 상판",
    titleEn: "Kitchen Countertop",
    description: "주방의 중심이 되는 싱크대 상판을 정밀 가공하여 완벽한 마감을 제공합니다. 내구성과 아름다움을 동시에.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
      </svg>
    ),
  },
  {
    title: "세면대",
    titleEn: "Vanity Top",
    description: "욕실 공간에 고급스러운 분위기를 더하는 세면대 상판. 방수 처리와 정밀 가공으로 오래도록 아름답게.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    title: "카운터",
    titleEn: "Counter",
    description: "상업 공간과 카페, 레스토랑에 어울리는 프리미엄 카운터. 고객의 첫인상을 결정짓는 품격 있는 마감.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />
      </svg>
    ),
  },
  {
    title: "맞춤 시공",
    titleEn: "Custom Work",
    description: "벽면, 계단, 선반 등 어떤 공간이든 고객의 요구에 맞춘 정밀한 맞춤 시공을 진행합니다.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  const sectionInView = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionInView, { once: true, margin: "-100px" });

  const { ref: sectionRef, scrollYProgress } = useElementScroll<HTMLElement>({
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream py-32 sm:py-40">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,149,106,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(184,149,106,0.04)_0%,transparent_60%)]" />
      </motion.div>

      <div ref={sectionInView} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-20 text-center sm:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-6 block text-[11px] font-medium tracking-[0.4em] uppercase text-accent"
          >
            Our Services
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl"
          >
            전문 시공 분야
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 h-px w-16 origin-center bg-accent"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mx-auto mt-6 max-w-lg text-base text-secondary"
          >
            인조대리석의 모든 것, 가공부터 시공까지 원스톱 서비스
          </motion.p>
        </div>

        {/* Service cards with 3D tilt */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <TiltCard
                className="relative"
                tiltAmount={10}
                glareOpacity={0.15}
              >
                <Link href="/contact" className="group block">
                  <div className={cn(
                    "relative overflow-hidden rounded-2xl border border-border/60 bg-white p-8",
                    "transition-all duration-700",
                    "hover:border-accent/30 hover:shadow-xl hover:shadow-accent/[0.04]",
                  )}>
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                    <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-stone-warm text-primary/60 transition-all duration-500 group-hover:bg-accent/10 group-hover:text-accent">
                      {service.icon}
                    </div>

                    <p className="relative mb-2 text-[10px] font-medium tracking-[0.2em] uppercase text-accent/70">
                      {service.titleEn}
                    </p>

                    <h3 className="relative mb-3 text-xl font-bold text-primary">
                      {service.title}
                    </h3>

                    <p className="relative text-sm leading-relaxed text-secondary">
                      {service.description}
                    </p>

                    <div className="relative mt-6 flex items-center gap-2 text-accent opacity-0 transition-all duration-500 group-hover:opacity-100">
                      <span className="text-xs font-medium">견적 문의</span>
                      <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-gradient-to-r from-transparent via-accent to-transparent transition-transform duration-700 origin-center group-hover:scale-x-100" />
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
