"use client";

import { motion, useTransform } from "framer-motion";
import { useElementScroll } from "@/lib/hooks";
import Marquee from "@/components/ui/Marquee";

const services = [
  "싱크대",
  "세면대",
  "카운터",
  "주방 상판",
  "욕실 상판",
  "인조대리석 가공",
  "맞춤 제작",
  "전문 시공",
];

export default function MarqueeSection() {
  const { ref, scrollYProgress } = useElementScroll<HTMLDivElement>({
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div ref={ref} className="relative overflow-hidden bg-background py-12 sm:py-16">
      {/* Top subtle border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[80%] bg-gradient-to-r from-transparent via-border to-transparent" />

      <motion.div style={{ x: x1 }}>
        <Marquee
          items={services}
          separator="  —  "
          speed={40}
          className="text-[3rem] sm:text-[4rem] md:text-[5rem] font-black text-primary/[0.04] leading-none select-none"
        />
      </motion.div>

      <motion.div style={{ x: x2 }} className="mt-2">
        <Marquee
          items={services}
          separator="  —  "
          speed={35}
          reverse
          className="text-lg sm:text-xl font-medium tracking-[0.3em] uppercase text-accent/60"
        />
      </motion.div>

      {/* Bottom subtle border */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-[80%] bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
