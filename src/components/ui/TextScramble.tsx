"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

interface TextScrambleProps {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  delay?: number;
  speed?: number;
}

export default function TextScramble({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
  speed = 35,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(() =>
    text.replace(/[^\s\n]/g, "\u00A0")
  );
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const timeout = setTimeout(() => {
      let frame = 0;
      const totalFrames = Math.max(text.length * 1.5, 25);

      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;

        const result = text
          .split("")
          .map((char, i) => {
            if (char === " " || char === "\n") return char;
            const charThreshold = i / text.length;
            if (progress > charThreshold + 0.3) return char;
            if (progress > charThreshold)
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            return "\u00A0";
          })
          .join("");

        setDisplayText(result);

        if (frame >= totalFrames) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, text, delay, speed]);

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={className}
      aria-label={text}
    >
      {displayText}
    </Tag>
  );
}
