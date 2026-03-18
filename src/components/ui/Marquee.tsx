"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  separator?: string;
  className?: string;
  speed?: number;
  reverse?: boolean;
}

export default function Marquee({
  items,
  separator = "  /  ",
  className = "",
  speed = 30,
  reverse = false,
}: MarqueeProps) {
  const text = items.join(separator) + separator;

  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <motion.div
        className="inline-flex"
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        <span className="inline-block pr-0">{text}</span>
        <span className="inline-block pr-0">{text}</span>
      </motion.div>
    </div>
  );
}
