"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import TiltCard from "@/components/ui/TiltCard";

const testimonials = [
  {
    name: "김지연",
    role: "아파트 주방 리모델링",
    content: "싱크대 상판 교체를 했는데, 기존 업체와는 차원이 다른 마감 품질이었습니다. 이음새가 거의 보이지 않아 정말 만족스러웠어요.",
    rating: 5,
  },
  {
    name: "박성호",
    role: "카페 인테리어",
    content: "카페 카운터와 테이블을 맞춤 제작했습니다. 디자인 상담부터 시공까지 꼼꼼하게 진행해주셔서 손님들도 카운터가 멋지다고 칭찬해주세요.",
    rating: 5,
  },
  {
    name: "이미영",
    role: "욕실 세면대 시공",
    content: "욕실 세면대를 교체했는데 깔끔한 마감에 감탄했습니다. 가격도 합리적이고 사장님이 직접 시공해주셔서 믿음이 갔습니다.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative z-30 overflow-hidden section-unified py-32 sm:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,106,0.04)_0%,transparent_70%)]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center sm:mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 block text-[11px] font-medium tracking-[0.4em] uppercase text-accent"
          >
            Testimonials
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl"
          >
            고객의 <span className="text-accent">신뢰</span>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 h-px w-16 origin-center bg-accent"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.2 + index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <TiltCard className="relative h-full" tiltAmount={6} glareOpacity={0.1}>
                <div className={cn(
                  "relative h-full rounded-2xl glass-card p-8 sm:p-10",
                  "transition-all duration-700",
                  "hover:border-accent/20 hover:shadow-lg hover:shadow-accent/[0.06]"
                )}>
                  <div className="mb-6 text-5xl leading-none text-accent/20">&ldquo;</div>

                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="mb-8 text-sm leading-relaxed text-secondary sm:text-base">
                    {testimonial.content}
                  </p>

                  <div className="flex items-center gap-4 border-t border-border/40 pt-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <span className="text-sm font-bold text-accent">
                        {testimonial.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">{testimonial.name}</p>
                      <p className="text-xs text-secondary">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
