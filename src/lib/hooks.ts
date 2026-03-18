"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, type UseScrollOptions } from "framer-motion";

/**
 * Wrapper around Framer Motion's useScroll that safely handles SSR/hydration.
 * Delays attaching the target ref until after mount to avoid the
 * "Target ref is defined but not hydrated" error.
 */
export function useElementScroll<T extends HTMLElement = HTMLElement>(
  options?: Omit<UseScrollOptions, "target">
) {
  const ref = useRef<T>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const result = useScroll({
    ...options,
    ...(isMounted && ref.current ? { target: ref } : {}),
  });

  return { ref, ...result };
}
