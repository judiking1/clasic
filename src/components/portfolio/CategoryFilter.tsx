"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";

interface CategoryFilterProps {
  currentCategory: string;
}

function buildCategoryHref(value: string) {
  return value === "all" ? "/portfolio" : `/portfolio?category=${value}`;
}

export function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  return (
    <div className="mb-12 flex flex-wrap justify-center gap-2">
      {PORTFOLIO_CATEGORIES.map((category) => (
        <Link
          key={category.value}
          href={buildCategoryHref(category.value)}
          scroll={false}
          className={cn(
            "relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
            currentCategory === category.value
              ? "bg-primary text-white"
              : "bg-transparent text-secondary hover:text-primary border border-border hover:border-primary/30"
          )}
        >
          {currentCategory === category.value && (
            <motion.div
              layoutId="filter-bg"
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{category.label}</span>
        </Link>
      ))}
    </div>
  );
}
