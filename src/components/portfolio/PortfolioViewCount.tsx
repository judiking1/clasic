"use client";

import { useEffect, useState } from "react";

export function PortfolioViewCount({ portfolioId }: { portfolioId: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/views?portfolio=${portfolioId}`)
      .then((r) => r.json())
      .then((d) => setViews(d.views))
      .catch(() => {});
  }, [portfolioId]);

  if (views === null) return null;

  return (
    <span className="flex items-center gap-1 text-xs text-secondary">
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      {views.toLocaleString()}
    </span>
  );
}
