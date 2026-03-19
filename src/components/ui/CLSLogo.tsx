"use client";

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
    sm: { width: 48, height: 32, fontSize: 22 },
    md: { width: 72, height: 48, fontSize: 34 },
    lg: { width: 160, height: 110, fontSize: 76 },
  };

  const s = sizeMap[size];
  const isDark = variant === "dark";
  const uid = `cls-${size}-${variant}`;

  return (
    <svg
      width={s.width}
      height={s.height}
      viewBox="0 0 160 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Marble texture pattern */}
        <linearGradient id={`${uid}-marble`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? "#e8e3db" : "#f5f0e8"} />
          <stop offset="25%" stopColor={isDark ? "#d4cfc7" : "#ede8e0"} />
          <stop offset="40%" stopColor={isDark ? "#c8b99a" : "#d4c4a8"} />
          <stop offset="55%" stopColor={isDark ? "#d8d2c8" : "#f0ebe3"} />
          <stop offset="75%" stopColor={isDark ? "#bfb8ad" : "#ddd6cc"} />
          <stop offset="100%" stopColor={isDark ? "#e0dbd3" : "#f5f0e8"} />
        </linearGradient>

        {/* Vein accent */}
        <linearGradient id={`${uid}-vein`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b8956a" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#c8a878" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#b8956a" stopOpacity="0.25" />
        </linearGradient>

        {/* Shadow filter */}
        <filter id={`${uid}-shadow`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor={isDark ? "#000" : "#8a8078"} floodOpacity="0.15" />
        </filter>

        {/* Inner depth */}
        <filter id={`${uid}-depth`} x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0.5" dy="1" stdDeviation="0.5" floodColor="#000" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* C - left letter */}
      <text
        x="18"
        y="78"
        fontSize={s.fontSize}
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="700"
        fill={`url(#${uid}-marble)`}
        filter={`url(#${uid}-shadow)`}
        letterSpacing="-2"
      >
        C
      </text>

      {/* L - center letter (taller, overlapping) */}
      <text
        x="52"
        y="85"
        fontSize={s.fontSize * 1.15}
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="800"
        fill={`url(#${uid}-marble)`}
        filter={`url(#${uid}-depth)`}
        letterSpacing="-2"
      >
        L
      </text>

      {/* S - right letter */}
      <text
        x="100"
        y="78"
        fontSize={s.fontSize}
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="700"
        fill={`url(#${uid}-marble)`}
        filter={`url(#${uid}-shadow)`}
        letterSpacing="-2"
      >
        S
      </text>

      {/* Vein overlay accent lines */}
      <line
        x1="25"
        y1="35"
        x2="130"
        y2="70"
        stroke={`url(#${uid}-vein)`}
        strokeWidth="0.8"
        opacity="0.5"
      />
      <line
        x1="40"
        y1="55"
        x2="140"
        y2="45"
        stroke={`url(#${uid}-vein)`}
        strokeWidth="0.5"
        opacity="0.3"
      />
    </svg>
  );
}
