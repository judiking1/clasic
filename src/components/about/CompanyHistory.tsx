"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function CompanyHistory() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 flex items-center gap-4">
          <div className="h-px w-12 bg-accent" />
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-accent">
            About
          </span>
        </div>
        <h2 className="mb-6 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          회사 소개
        </h2>
        <p className="mb-16 max-w-2xl text-base leading-relaxed text-secondary">
          2000년 10월, 자체 공장 설립과 함께 시작된 클레식은
          인조대리석 가공 및 시공 전문 업체로서 25년 이상의 노하우를 쌓아왔습니다.
        </p>

        {/* Key highlights */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: 설립 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="group rounded-2xl border border-border bg-white p-8 transition-all duration-300 hover:border-accent/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21" />
              </svg>
            </div>
            <p className="mb-1 text-sm font-medium text-secondary">설립</p>
            <p className="text-3xl font-black text-primary">
              2000<span className="text-accent">.10</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              자체 공장 설립과 함께 인조대리석 가공 및 시공 전문 업체로 출발했습니다.
            </p>
          </motion.div>

          {/* Card 2: 시공 실적 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="group rounded-2xl border border-border bg-white p-8 transition-all duration-300 hover:border-accent/30 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <p className="mb-1 text-sm font-medium text-secondary">누적 시공</p>
            <p className="text-3xl font-black text-primary">
              50,000<span className="text-accent">건+</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              주방, 욕실, 카운터 등 다양한 공간에서 시공 경험을 축적해왔습니다.
            </p>
          </motion.div>

          {/* Card 3: 고객 만족 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="group rounded-2xl border border-border bg-white p-8 transition-all duration-300 hover:border-accent/30 hover:shadow-lg sm:col-span-2 lg:col-span-1"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
            </div>
            <p className="mb-1 text-sm font-medium text-secondary">고객 만족도</p>
            <p className="text-3xl font-black text-primary">
              98<span className="text-accent">%</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              꼼꼼한 시공과 사후 관리로 높은 재시공 의뢰 및 추천율을 유지하고 있습니다.
            </p>
          </motion.div>
        </div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center"
        >
          <p className="text-base font-medium text-primary">
            &ldquo;장인의 손끝에서 완성되는 프리미엄 인조대리석&rdquo;
          </p>
          <p className="mt-2 text-sm text-secondary">
            25년간 한 길을 걸어온 클레식이 고객의 공간에 품격을 더합니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
