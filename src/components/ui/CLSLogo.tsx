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
    sm: { width: 52, height: 52 },
    md: { width: 80, height: 80 },
    lg: { width: 120, height: 120 },
  };

  const s = sizeMap[size];
  // light variant (for dark backgrounds) = light_logo (밝은 대리석)
  // dark variant (for light backgrounds) = dark_logo (어두운 대리석)
  const src = variant === "light" ? "/logo-light.webp" : "/logo-dark.webp";

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
