"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import type { PortfolioWithImages } from "@/types";

interface FeaturedPortfolioProps {
  portfolios: PortfolioWithImages[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function FeaturedPortfolio({ portfolios }: FeaturedPortfolioProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    skipSnaps: false,
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!portfolios || portfolios.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-stone-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="mb-12 flex flex-col items-start justify-between gap-6 sm:mb-16 sm:flex-row sm:items-end"
        >
          <div>
            <span className="mb-3 inline-block text-sm font-medium tracking-widest text-stone-400">
              PORTFOLIO
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              시공사례
            </h2>
            <p className="mt-3 max-w-md text-base text-stone-500">
              다양한 공간에 시공한 인조대리석 프로젝트를 확인해보세요.
            </p>
          </div>

          {/* Navigation arrows + View all link */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200",
                  canScrollPrev
                    ? "border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50"
                    : "border-stone-200 bg-stone-100 text-stone-300 cursor-not-allowed"
                )}
                aria-label="이전 슬라이드"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200",
                  canScrollNext
                    ? "border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50"
                    : "border-stone-200 bg-stone-100 text-stone-300 cursor-not-allowed"
                )}
                aria-label="다음 슬라이드"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <Link
              href="/portfolio"
              className={cn(
                "group inline-flex items-center gap-1.5",
                "text-sm font-semibold text-stone-700",
                "transition-colors duration-200 hover:text-stone-900"
              )}
            >
              전체 보기
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-5 sm:gap-6">
              {portfolios.map((portfolio, index) => {
                const thumbnail =
                  portfolio.images && portfolio.images.length > 0
                    ? portfolio.images[0].imageUrl
                    : "/images/placeholder.jpg";

                return (
                  <motion.div
                    key={portfolio.id}
                    variants={itemVariants}
                    className="min-w-0 flex-shrink-0 flex-grow-0 basis-[85%] sm:basis-[45%] lg:basis-[31%]"
                  >
                    <Link
                      href={`/portfolio/${portfolio.id}`}
                      className="group block"
                    >
                      <div
                        className={cn(
                          "relative overflow-hidden rounded-xl",
                          "aspect-[4/3]",
                          "bg-stone-200"
                        )}
                      >
                        <Image
                          src={thumbnail}
                          alt={portfolio.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 31vw"
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-stone-900/0 transition-colors duration-300 group-hover:bg-stone-900/20" />

                        {/* Category badge */}
                        {portfolio.category && (
                          <div className="absolute left-3 top-3">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full",
                                "bg-white/90 px-3 py-1 text-xs font-medium text-stone-700",
                                "shadow-sm backdrop-blur-sm"
                              )}
                            >
                              {portfolio.category}
                            </span>
                          </div>
                        )}

                        {/* View icon on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
                            <svg
                              className="h-5 w-5 text-stone-700"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Card content */}
                      <div className="mt-4 px-1">
                        <h3 className="text-base font-semibold text-stone-900 transition-colors duration-200 group-hover:text-stone-700 sm:text-lg">
                          {portfolio.title}
                        </h3>
                        {portfolio.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                            {portfolio.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
