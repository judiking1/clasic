"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]" style={{ position: "fixed" }}>
      <motion.div
        className="h-[2px] origin-left bg-accent"
        style={{ scaleX }}
      />
    </div>
  );
}
