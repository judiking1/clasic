"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
  glareOpacity?: number;
  scale?: number;
}

export default function TiltCard({
  children,
  className = "",
  tiltAmount = 8,
  glareOpacity = 0.12,
  scale = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setTilt({
        x: (y - 0.5) * -tiltAmount,
        y: (x - 0.5) * tiltAmount,
      });
      setGlarePos({ x: x * 100, y: y * 100 });
    },
    [tiltAmount]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovered ? scale : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
    >
      {children}
      {/* Glare highlight */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${isHovered ? glareOpacity : 0}), transparent 55%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {/* Edge light */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-500"
        style={{
          boxShadow: isHovered
            ? `inset 0 0 30px rgba(184,149,106,0.05), 0 20px 60px rgba(184,149,106,0.08)`
            : "none",
          opacity: isHovered ? 1 : 0,
        }}
      />
    </motion.div>
  );
}
