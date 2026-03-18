"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SAMPLE_COLORS } from "@/lib/constants";

interface SampleFilterProps {
  currentColor: string;
}

export function SampleFilter({ currentColor }: SampleFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleColorChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("color");
    } else {
      params.set("color", value);
    }
    const query = params.toString();
    router.push(query ? `/samples?${query}` : "/samples");
  };

  const allItems = [{ value: "all", label: "전체" }, ...SAMPLE_COLORS];

  return (
    <div className="mb-12 flex flex-wrap justify-center gap-2">
      {allItems.map((color) => (
        <button
          key={color.value}
          onClick={() => handleColorChange(color.value)}
          className={cn(
            "relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
            currentColor === color.value
              ? "bg-primary text-white"
              : "bg-transparent text-secondary hover:text-primary border border-border hover:border-primary/30"
          )}
        >
          {currentColor === color.value && (
            <motion.div
              layoutId="sample-filter-bg"
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{color.label}</span>
        </button>
      ))}
    </div>
  );
}
