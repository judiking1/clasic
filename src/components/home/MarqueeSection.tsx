"use client";

import { motion, useTransform } from "framer-motion";
import { useElementScroll } from "@/lib/hooks";
import Marquee from "@/components/ui/Marquee";

const services = [
  "주방 상판",
  "세면대",
  "카운터",
  "인조대리석 가공",
  "맞춤 제작",
  "전문 시공",
  "욕실 상판",
  "벽면 시공",
];

export default function MarqueeSection() {
  const { ref, scrollYProgress } = useElementScroll<HTMLDivElement>({
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div ref={ref} className="relative overflow-hidden bg-background py-16 sm:py-20">
      {/* Dividers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[80%] bg-gradient-to-r from-transparent via-border to-transparent" />

      <motion.div style={{ x: x1 }}>
        <Marquee
          items={services}
          separator={"  \u2014  "}
          speed={45}
          className="text-[3rem] sm:text-[4rem] md:text-[5rem] font-black text-primary/[0.03] leading-none select-none"
        />
      </motion.div>

      <motion.div style={{ x: x2 }} className="mt-3">
        <Marquee
          items={services}
          separator={"  \u00b7  "}
          speed={35}
          reverse
          className="text-sm sm:text-base font-medium tracking-[0.4em] uppercase text-accent/40"
        />
      </motion.div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-[80%] bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
