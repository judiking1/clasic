"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ViewTracker() {
  const pathname = usePathname();
  const lastTracked = useRef("");

  useEffect(() => {
    if (pathname === lastTracked.current) return;
    lastTracked.current = pathname;

    // Fire-and-forget: don't block rendering
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pathname }),
    }).catch(() => {}); // silently ignore errors
  }, [pathname]);

  return null;
}
