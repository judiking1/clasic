"use client";

import Link from "next/link";
import Image from "next/image";
import { SAMPLE_COLORS, SAMPLE_PATTERNS } from "@/lib/constants";
import type { Sample } from "@/types";

interface SampleCardProps {
  sample: Sample;
  isAdmin?: boolean;
}

export function SampleCard({ sample, isAdmin }: SampleCardProps) {
  const colorLabel =
    SAMPLE_COLORS.find((c) => c.value === sample.colorCategory)?.label ||
    sample.colorCategory;
  const patternLabel =
    SAMPLE_PATTERNS.find((p) => p.value === sample.patternType)?.label ||
    sample.patternType;

  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        {isAdmin && (
          <Link
            href={`/admin/samples/${sample.id}/edit`}
            className="absolute right-2 top-2 z-10 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
          >
            수정
          </Link>
        )}
        {sample.imageUrl ? (
          <Image
            src={sample.imageUrl}
            alt={sample.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <svg
              className="h-10 w-10 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
          {sample.name}
        </h3>
        {sample.brand && (
          <p className="mt-0.5 text-xs text-gray-500">{sample.brand}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
            {colorLabel}
          </span>
          <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            {patternLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
