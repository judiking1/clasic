"use client";

import Image from "next/image";

interface CLSLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}

export default function CLSLogo({
  className = "",
  size = "md",
  variant = "dark",
}: CLSLogoProps) {
  const sizeMap = {
    sm: { width: 36, height: 36 },
    md: { width: 52, height: 52 },
    lg: { width: 100, height: 100 },
  };

  const s = sizeMap[size];
  // light variant (for dark backgrounds) = dark_logo (white marble on dark)
  // dark variant (for light backgrounds) = light_logo (black/gold on light)
  const src = variant === "light" ? "/logo-dark.webp" : "/logo-light.webp";

  return (
    <Image
      src={src}
      alt="클래식 로고"
      width={s.width}
      height={s.height}
      className={`object-contain ${className}`}
      priority
      unoptimized
    />
  );
}
