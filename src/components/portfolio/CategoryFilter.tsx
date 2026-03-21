"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";

interface CategoryFilterProps {
  currentCategory: string;
}

export function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    // Reset to page 1 when changing category
    params.delete("page");
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    const query = params.toString();
    router.push(query ? `/portfolio?${query}` : "/portfolio");
  };

  return (
    <div className="mb-12 flex flex-wrap justify-center gap-2">
      {PORTFOLIO_CATEGORIES.map((category) => (
        <button
          key={category.value}
          onClick={() => handleCategoryChange(category.value)}
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
        </button>
      ))}
    </div>
  );
}
