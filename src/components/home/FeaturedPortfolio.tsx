"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useTransform, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { useElementScroll } from "@/lib/hooks";
import type { PortfolioWithImages } from "@/types";
import MagneticButton from "@/components/ui/MagneticButton";

interface FeaturedPortfolioProps {
  portfolios: PortfolioWithImages[];
}

export default function FeaturedPortfolio({ portfolios }: FeaturedPortfolioProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });

  const { ref: sectionRef, scrollYProgress } = useElementScroll<HTMLElement>({
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  if (!portfolios || portfolios.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative z-30 overflow-hidden section-unified py-32 sm:py-40">
      {/* Subtle glow */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,149,106,0.06)_0%,transparent_60%)]" />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="mb-16 flex flex-col gap-8 sm:mb-20 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="h-px w-12 bg-accent" />
              <span className="text-xs font-medium tracking-[0.3em] uppercase text-accent">
                Portfolio
              </span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              시공사례
            </h2>
            <p className="mt-4 max-w-md text-base text-white/40">
              다양한 공간에 시공한 인조대리석 프로젝트를 확인해보세요.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <MagneticButton strength={0.15}>
              <Link
                href="/portfolio"
                className={cn(
                  "group inline-flex items-center gap-3",
                  "glass-premium rounded-full px-6 py-3",
                  "text-sm font-medium text-white/80",
                  "transition-all duration-500",
                  "hover:border-accent/50 hover:text-white"
                )}
              >
                전체 보기
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Portfolio grid - asymmetric layout */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {portfolios.slice(0, 6).map((portfolio, index) => {
            const thumbnail =
              portfolio.images && portfolio.images.length > 0
                ? portfolio.images[0].imageUrl
                : "/images/placeholder.jpg";

            const isLarge = index === 0 || index === 3;

            return (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                thumbnail={thumbnail}
                index={index}
                isLarge={isLarge}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PortfolioCard({
  portfolio,
  thumbnail,
  index,
  isLarge,
}: {
  portfolio: PortfolioWithImages;
  thumbnail: string;
  index: number;
  isLarge: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={cn(isLarge && "sm:col-span-2 lg:col-span-2")}
    >
      <Link href={`/portfolio/${portfolio.id}`} className="group relative block">
        <div
          className={cn(
            "relative overflow-hidden rounded-xl",
            isLarge ? "aspect-[16/9]" : "aspect-[4/3]",
            "bg-primary/50"
          )}
        >
          <Image
            src={thumbnail}
            alt={portfolio.title}
            fill
            className="object-cover transition-all duration-[1.2s] group-hover:scale-110"
            sizes={isLarge
              ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 transition-opacity duration-500 group-hover:opacity-80" />

          {/* Content at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            {portfolio.category && (
              <span className="mb-2 inline-block text-[11px] font-medium tracking-[0.2em] uppercase text-accent">
                {portfolio.category}
              </span>
            )}

            <h3 className="text-lg font-bold text-white sm:text-xl">
              {portfolio.title}
            </h3>

            {portfolio.description && (
              <p className="mt-1 line-clamp-1 text-sm text-white/50 transition-colors duration-300 group-hover:text-white/70">
                {portfolio.description}
              </p>
            )}

            <div className="mt-3 flex items-center gap-2 opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
              <span className="text-xs font-medium text-accent">자세히 보기</span>
              <svg className="h-3 w-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>

          {/* Corner accent */}
          <div className="absolute top-4 right-4 h-8 w-8 border-t border-r border-white/0 transition-all duration-500 group-hover:border-white/30 group-hover:h-12 group-hover:w-12" />
        </div>
      </Link>
    </motion.div>
  );
}
