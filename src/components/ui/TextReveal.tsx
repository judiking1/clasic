"use client";

import { motion, useTransform } from "framer-motion";
import { useElementScroll } from "@/lib/hooks";

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function TextReveal({ children, className = "", as: Tag = "p" }: TextRevealProps) {
  const { ref, scrollYProgress } = useElementScroll<HTMLDivElement>({
    offset: ["start 0.9", "start 0.25"],
  });

  const words = children.split(" ");

  return (
    <div ref={ref}>
      <Tag className={className} style={{ display: "flex", flexWrap: "wrap" }}>
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Word key={i} range={[start, end]} progress={scrollYProgress}>
              {word}
            </Word>
          );
        })}
      </Tag>
    </div>
  );
}

function Word({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: ReturnType<typeof useElementScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [8, 0]);

  return (
    <span style={{ position: "relative", marginRight: "0.3em" }}>
      <motion.span style={{ opacity, y, display: "inline-block" }}>
        {children}
      </motion.span>
    </span>
  );
}
