"use client";

import { motion, useTransform } from "framer-motion";
import { useElementScroll } from "@/lib/hooks";

interface PageHeroProps {
  label: string;
  title: string;
  description?: string;
}

export default function PageHero({ label, title, description }: PageHeroProps) {
  const { ref, scrollYProgress } = useElementScroll<HTMLElement>({
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-primary pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,149,106,0.1)_0%,transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center gap-4"
        >
          <div className="h-px w-12 bg-accent" />
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-accent">
            {label}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          {title}
        </motion.h1>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 max-w-lg text-base text-white/40 sm:text-lg"
          >
            {description}
          </motion.p>
        )}
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
