"use client";

import { useEffect } from "react";

/**
 * Tracks a single portfolio detail page view.
 * Deduplicates within the same browser session (sessionStorage).
 */
export function ViewTracker({ portfolioId }: { portfolioId: string }) {
  useEffect(() => {
    const key = `viewed:${portfolioId}`;
    if (sessionStorage.getItem(key)) return; // already viewed this session
    sessionStorage.setItem(key, "1");

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: `/portfolio/${portfolioId}` }),
    }).catch(() => {});
  }, [portfolioId]);

  return null;
}
