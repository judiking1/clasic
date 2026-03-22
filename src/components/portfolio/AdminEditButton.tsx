"use client";

import { useRouter } from "next/navigation";

export function AdminEditButton({ portfolioId }: { portfolioId: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/admin/portfolio/${portfolioId}/edit`);
      }}
      className="rounded-full bg-accent px-3 py-1 text-[10px] font-semibold text-white shadow-md hover:bg-accent-light transition-colors"
    >
      수정
    </button>
  );
}
