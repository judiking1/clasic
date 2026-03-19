"use client";

import { useEffect, useRef } from "react";

export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const current = useRef({ x: -1000, y: -1000 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      current.current.x += (mouse.current.x - current.current.x) * 0.04;
      current.current.y += (mouse.current.y - current.current.y) * 0.04;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${current.current.x - 350}px, ${current.current.y - 350}px, 0)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 z-[60] hidden h-[700px] w-[700px] rounded-full will-change-transform lg:block"
      style={{
        background:
          "radial-gradient(circle, rgba(184,149,106,0.08) 0%, rgba(184,149,106,0.03) 30%, transparent 65%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
