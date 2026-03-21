"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const MarbleScrollScene = dynamic(
  () => import("@/components/three/MarbleScrollScene"),
  { ssr: false }
);

export default function MarbleScrollCanvas() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const scrollProgressRef = useRef(0);
  const assemblyProgressRef = useRef(0);

  const { scrollYProgress } = useScroll();

  // Ultra-slow assembly: planets orbit throughout most of the page, complete near Stats section
  const assembly = useTransform(scrollYProgress, [0.03, 0.72], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollProgressRef.current = v;
  });

  useMotionValueEvent(assembly, "change", (v) => {
    assemblyProgressRef.current = Math.min(1, Math.max(0, v));
  });

  // Detect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isReducedMotion) return null;

  return (
    <div
      className="fixed inset-0 z-10"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <MarbleScrollScene
        scrollProgress={scrollProgressRef}
        assemblyProgress={assemblyProgressRef}
      />
    </div>
  );
}
