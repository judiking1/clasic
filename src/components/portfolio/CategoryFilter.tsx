"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    const query = params.toString();
    router.push(query ? `/portfolio?${query}` : "/portfolio");
  };

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-2">
      {PORTFOLIO_CATEGORIES.map((category) => (
        <button
          key={category.value}
          onClick={() => handleCategoryChange(category.value)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
            currentCategory === category.value
              ? "bg-amber-500 text-white shadow-md shadow-amber-200"
              : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
