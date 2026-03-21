/**
 * 클레식 디자인 시스템 토큰
 *
 * 모든 디자인 값의 단일 진실 원천(Single Source of Truth).
 * CSS 변수는 globals.css @theme에서, 프로그래밍 값은 여기서 관리.
 */

// ─── Color Palette ───────────────────────────────────────────
export const colors = {
  // Primitive tokens (raw values)
  primitive: {
    marble: {
      50: "#fafaf8",
      100: "#f5f5f0",
      200: "#f5f0ea",
      300: "#faf7f2",
      400: "#e0ddd5",
    },
    gold: {
      300: "#dfc69a",
      400: "#d4b896",
      500: "#b8956a",
      600: "#a07a52",
    },
    charcoal: {
      800: "#1a1a2e",
      900: "#0a0a0a",
    },
    gray: {
      500: "#636e72",
    },
  },

  // Semantic tokens (purpose-driven aliases)
  semantic: {
    background: "var(--color-background)",       // #fafaf8
    foreground: "var(--color-foreground)",        // #1a1a2e
    primary: "var(--color-primary)",              // #0a0a0a
    primaryForeground: "var(--color-primary-foreground)", // #fafaf8
    secondary: "var(--color-secondary)",          // #636e72
    accent: "var(--color-accent)",                // #b8956a
    accentLight: "var(--color-accent-light)",     // #d4b896
    muted: "var(--color-muted)",                  // #f5f5f0
    mutedForeground: "var(--color-muted-foreground)", // #636e72
    border: "var(--color-border)",                // #e0ddd5
    destructive: "var(--color-destructive)",      // #e74c3c
    success: "var(--color-success)",              // #27ae60
    stoneWarm: "var(--color-stone-warm)",         // #f5f0ea
    cream: "var(--color-cream)",                  // #faf7f2
  },
} as const;

// ─── Typography ──────────────────────────────────────────────
export const typography = {
  // Font families
  fontFamily: {
    sans: "var(--font-sans)",      // Noto Sans KR - 본문, UI
    serif: "var(--font-serif)",    // Playfair Display - 장식, 번호
  },

  // Type scale (mobile → desktop)
  // 각 단계는 명확한 용도를 가짐
  scale: {
    // 라벨/캡션 - 섹션 라벨, 카테고리 태그
    caption: "text-[11px] font-medium tracking-[0.3em] uppercase",
    // 소형 본문 - 카드 설명, 부가 정보
    bodySmall: "text-sm leading-relaxed",
    // 기본 본문 - 일반 문단
    body: "text-base leading-relaxed",
    // 대형 본문 - 히어로 서브타이틀
    bodyLarge: "text-base sm:text-lg leading-relaxed",
    // 소제목 - 카드 제목
    subtitle: "text-lg sm:text-xl font-bold",
    // 섹션 제목
    heading: "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight",
    // 대형 제목 - 히어로, CTA
    headingLarge: "text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight",
    // 히어로 제목
    display: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight",
    // 통계 숫자
    stat: "text-6xl sm:text-7xl md:text-8xl font-black tracking-tight",
  },
} as const;

// ─── Spacing ─────────────────────────────────────────────────
export const spacing = {
  // 섹션 간 패딩 (수직)
  section: "py-32 sm:py-40",
  // 섹션 헤더와 콘텐츠 사이
  sectionGap: "mb-20 sm:mb-24",
  // 컨테이너 패딩 (수평)
  container: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
  // 카드 내부 패딩
  card: "p-6 sm:p-8",
  // 카드 간 간격
  cardGap: "gap-6",
} as const;

// ─── Elevation (Shadows) ────────────────────────────────────
export const elevation = {
  none: "shadow-none",
  sm: "shadow-sm",
  card: "shadow-lg shadow-accent/[0.03]",
  cardHover: "shadow-xl shadow-accent/[0.06]",
  cta: "shadow-2xl shadow-accent/25",
} as const;

// ─── Border Radius ───────────────────────────────────────────
export const radii = {
  badge: "rounded-full",
  button: "rounded-full",
  card: "rounded-2xl",
  cardSmall: "rounded-xl",
  icon: "rounded-lg",
  image: "rounded-xl",
} as const;

// ─── Animation ───────────────────────────────────────────────
export const animation = {
  // Easing curves
  ease: {
    smooth: [0.16, 1, 0.3, 1] as [number, number, number, number],
    gentle: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    spring: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number],
  },

  // Duration presets
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 0.8,
    entrance: 1.0,
    hero: 1.5,
  },

  // Framer Motion 프리셋
  fadeUp: (delay = 0) => ({
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay, duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  }),

  fadeIn: (delay = 0) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  }),

  scaleIn: (delay = 0) => ({
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  }),

  lineExpand: (delay = 0) => ({
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  }),

  staggerDelay: 0.15,

  // CSS transition presets
  transition: {
    fast: "transition-all duration-300",
    normal: "transition-all duration-500",
    slow: "transition-all duration-700",
  },
} as const;

// ─── Section Background Pattern ─────────────────────────────
// 페이지 흐름: dark → light → light → cream → dark → dark → light → warm → dark
// 개선: 더 명확한 리듬감을 위한 배경 설정
export const sectionBg = {
  dark: "bg-primary",
  light: "bg-background",
  cream: "bg-cream",
  warm: "bg-stone-warm",
} as const;

// ─── Component Patterns ─────────────────────────────────────
// 반복되는 UI 패턴의 클래스 조합
export const patterns = {
  // 섹션 라벨 (영문 + 라인)
  sectionLabel: "flex items-center gap-4",
  sectionLabelLine: "h-px w-12 bg-accent",
  sectionLabelText: "text-[11px] font-medium tracking-[0.3em] uppercase text-accent",

  // 센터 정렬 섹션 라벨
  sectionLabelCenter: "mb-6 block text-[11px] font-medium tracking-[0.3em] uppercase text-accent",

  // 액센트 구분선
  accentDivider: "h-px w-16 origin-center bg-accent",
  accentDividerLeft: "h-px w-20 origin-left bg-accent/40",

  // 뱃지 (히어로, CTA)
  badge: "inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 backdrop-blur-sm",
  badgeDot: "h-1.5 w-1.5 rounded-full bg-accent",
  badgeText: "text-[11px] font-medium tracking-[0.3em] text-white/60 uppercase",

  // CTA 버튼
  buttonPrimary: "group relative inline-flex items-center justify-center gap-3 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-accent/25",
  buttonSecondary: "group inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all duration-700 hover:border-accent/40 hover:text-white hover:bg-white/[0.06]",

  // 카드
  card: "rounded-2xl border border-border/40 bg-white transition-all duration-700 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/[0.03]",

  // 앰비언트 라이트 (다크 섹션 배경)
  ambientGold: "bg-[radial-gradient(ellipse_at_30%_20%,rgba(184,149,106,0.12)_0%,transparent_50%)]",
  ambientGoldSoft: "bg-[radial-gradient(ellipse_at_70%_80%,rgba(184,149,106,0.08)_0%,transparent_50%)]",
  ambientVignette: "bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.4)_100%)]",

  // 그리드 패턴 오버레이
  gridPattern: (size = 120, opacity = 0.015) =>
    ({
      backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      opacity,
    } as const),
} as const;
