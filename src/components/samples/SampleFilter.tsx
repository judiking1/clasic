"use client";

import { useRouter, useSearchParams } from "next/navigation";
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

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-2">
      <button
        onClick={() => handleColorChange("all")}
        className={cn(
          "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
          currentColor === "all"
            ? "bg-amber-500 text-white shadow-md shadow-amber-200"
            : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        전체
      </button>
      {SAMPLE_COLORS.map((color) => (
        <button
          key={color.value}
          onClick={() => handleColorChange(color.value)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
            currentColor === color.value
              ? "bg-amber-500 text-white shadow-md shadow-amber-200"
              : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          {color.label}
        </button>
      ))}
    </div>
  );
}
