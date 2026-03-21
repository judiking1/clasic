# 클레식 디자인 시스템

> 인조대리석 전문 시공 업체의 프리미엄 브랜드 아이덴티티를 반영한 디자인 시스템

---

## 1. 브랜드 컨셉

**핵심 키워드**: 프리미엄, 장인 정신, 따뜻한 고급감, 신뢰

**디자인 철학**: 인조대리석의 자연스러운 질감과 온기를 디지털로 표현. 과하지 않으면서도 고급스러운 미니멀 럭셔리 스타일.

**스타일 방향**: Warm Minimalism + Luxury Editorial

---

## 2. Color System

### 2-1. Primitive Tokens (원시 값)

| Token | Hex | 용도 |
|-------|-----|------|
| **Marble 50** | `#fafaf8` | 메인 배경 |
| **Marble 100** | `#f5f5f0` | 뮤트 배경 |
| **Marble 200** | `#f5f0ea` | 따뜻한 배경 (후기 섹션) |
| **Marble 300** | `#faf7f2` | 크림 배경 (서비스 섹션) |
| **Marble 400** | `#e0ddd5` | 보더/구분선 |
| **Gold 300** | `#dfc69a` | 쉬머 하이라이트 |
| **Gold 400** | `#d4b896` | 액센트 라이트 |
| **Gold 500** | `#b8956a` | 메인 액센트 |
| **Gold 600** | `#a07a52` | 액센트 다크 |
| **Charcoal 800** | `#1a1a2e` | 메인 텍스트 |
| **Charcoal 900** | `#0a0a0a` | 다크 배경, 프라이머리 |
| **Gray 500** | `#636e72` | 보조 텍스트 |

### 2-2. Semantic Tokens (의미 기반)

| 역할 | CSS Variable | 값 |
|------|-------------|-----|
| 배경 | `--color-background` | Marble 50 |
| 전경/텍스트 | `--color-foreground` | Charcoal 800 |
| 프라이머리 (다크 BG) | `--color-primary` | Charcoal 900 |
| 액센트 (CTA, 강조) | `--color-accent` | Gold 500 |
| 보조 텍스트 | `--color-secondary` | Gray 500 |
| 보더 | `--color-border` | Marble 400 |
| 성공 | `--color-success` | `#27ae60` |
| 오류 | `--color-destructive` | `#e74c3c` |

### 2-3. 배경 컬러 리듬

랜딩페이지 섹션 순서와 배경색 교대:

```
Hero        → bg-primary (dark)
Marquee     → bg-background (light)
CompanyIntro→ bg-background (light)
Services    → bg-cream (warm light)
Portfolio   → bg-primary (dark)
Process     → bg-primary (dark)
Stats       → bg-background (light)
Testimonials→ bg-stone-warm (warm)
CTA         → bg-primary (dark)
```

**규칙**: 다크↔라이트 교대로 시각적 리듬 형성. 라이트 계열은 배경색을 미세하게 변화시켜 단조로움 방지.

---

## 3. Typography

### 3-1. 폰트 페어링

| 용도 | 폰트 | CSS Variable | 비고 |
|------|------|-------------|------|
| 본문, UI | Noto Sans KR | `--font-sans` | Weight: 300, 400, 500, 700, 900 |
| 장식, 번호 | Playfair Display | `--font-serif` | 섹션 번호, 인용구 장식 |

### 3-2. Type Scale

| 레벨 | 클래스 | 용도 | 예시 |
|------|-------|------|------|
| **Display** | `text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold` | 히어로 제목 | "공간의 품격을 완성하는 대리석" |
| **Heading Large** | `text-4xl sm:text-5xl md:text-6xl font-bold` | CTA 제목 | "품격을 더하세요" |
| **Heading** | `text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight` | 섹션 제목 | "전문 시공 분야" |
| **Subtitle** | `text-lg sm:text-xl font-bold` | 카드 제목 | "주방 상판" |
| **Body Large** | `text-base sm:text-lg leading-relaxed` | 히어로 서브타이틀 | |
| **Body** | `text-base leading-relaxed` | 일반 문단 | |
| **Body Small** | `text-sm leading-relaxed` | 카드 설명 | |
| **Caption** | `text-[11px] font-medium tracking-[0.3em] uppercase` | 섹션 라벨 | "Our Services" |
| **Stat** | `text-6xl sm:text-7xl md:text-8xl font-black` | 통계 숫자 | "500+" |

### 3-3. 타이포그래피 규칙

- 본문 최소 크기: **14px** (text-sm). 12px 미만 사용 금지.
- 행간: 본문 1.5 (`leading-relaxed`), 제목 1.1~1.2
- 자간: 제목 `tracking-tight`, 라벨 `tracking-[0.3em]`
- 색상 대비: 다크 배경 `text-white`, 라이트 배경 `text-primary`
- 보조 텍스트: 다크 배경 `text-white/40~50`, 라이트 배경 `text-secondary`

---

## 4. Spacing System

### 4-1. 기본 스페이싱

Tailwind 기본 4px 단위 기반.

| 용도 | 값 | 비고 |
|------|-----|------|
| 섹션 패딩 | `py-32 sm:py-40` | 128px → 160px |
| 섹션 헤더↔콘텐츠 | `mb-20 sm:mb-24` | 80px → 96px |
| 컨테이너 수평 패딩 | `px-4 sm:px-6 lg:px-8` | 16→24→32px |
| 컨테이너 최대 폭 | `max-w-7xl` | 1280px |
| 카드 내부 | `p-6 sm:p-8` | 24→32px |
| 카드 간격 | `gap-6` | 24px |
| 요소 간 간격 (소) | `gap-4` | 16px |
| 요소 간 간격 (대) | `gap-8` to `gap-16` | 32~64px |

### 4-2. 컨테이너 패턴

```jsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* 콘텐츠 */}
</div>
```

---

## 5. Elevation & Shadows

| 레벨 | CSS 값 | 용도 |
|------|--------|------|
| **None** | 없음 | 기본 상태 |
| **Card** | `--shadow-card` | 카드 기본 |
| **Card Hover** | `--shadow-card-hover` | 카드 호버 |
| **CTA** | `--shadow-cta` | CTA 버튼 호버 |

규칙: 그림자는 accent 컬러(골드) 톤을 미세하게 포함하여 따뜻한 느낌 유지.

---

## 6. Border & Radius

| 요소 | Border Radius | Border Color |
|------|-------------|--------------|
| 카드 | `rounded-2xl` | `border-border/40` |
| 이미지 카드 | `rounded-xl` | - |
| 버튼 | `rounded-full` | - |
| 뱃지 | `rounded-full` | `border-white/10` |
| 아이콘 박스 | `rounded-lg` ~ `rounded-xl` | - |

---

## 7. Animation & Motion

### 7-1. Easing Curves

| 이름 | 값 | 용도 |
|------|-----|------|
| **smooth** | `[0.16, 1, 0.3, 1]` | 콘텐츠 진입, 페이드업 |
| **gentle** | `[0.25, 0.4, 0.25, 1]` | 호버, 카드 애니메이션 |

### 7-2. Duration

| 속도 | 시간 | 용도 |
|------|------|------|
| Fast | 300ms | 호버, 토글 |
| Normal | 500-600ms | 스크롤 트리거 진입 |
| Slow | 700-800ms | 섹션 진입, 카드 스태거 |
| Entrance | 1000ms | 히어로 콘텐츠 |
| Hero | 1500ms | 3D 마블 진입 |

### 7-3. 공통 패턴

**Fade Up (콘텐츠 진입)**
```js
{ opacity: 0, y: 40 } → { opacity: 1, y: 0 }
```

**Scale In (이미지, CTA)**
```js
{ opacity: 0, scale: 0.95 } → { opacity: 1, scale: 1 }
```

**Line Expand (구분선)**
```js
{ scaleX: 0 } → { scaleX: 1 }  (origin-left 또는 origin-center)
```

**Stagger (카드 목록)**
```js
delay: index * 0.15
```

### 7-4. 접근성

- `prefers-reduced-motion: reduce` 시 모든 애니메이션 비활성화
- CSS 애니메이션 duration → 0.01ms
- JS 애니메이션도 reduced-motion 존중

---

## 8. Component Patterns

### 8-1. 섹션 헤더 (센터)

```jsx
<span className="text-[11px] font-medium tracking-[0.3em] uppercase text-accent">
  English Label
</span>
<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
  한글 제목
</h2>
<div className="mx-auto mt-6 h-px w-16 origin-center bg-accent" />
```

### 8-2. 섹션 헤더 (좌측)

```jsx
<div className="flex items-center gap-4">
  <div className="h-px w-12 bg-accent" />
  <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-accent">
    English Label
  </span>
</div>
```

### 8-3. CTA 버튼

```jsx
// Primary (다크 배경용)
<Link className="rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white">

// Secondary (다크 배경용)
<Link className="rounded-full border border-white/15 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white/80 backdrop-blur-sm">
```

### 8-4. 다크 섹션 앰비언트 라이트

```jsx
<div className="absolute inset-0">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(184,149,106,0.12)_0%,transparent_50%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(184,149,106,0.08)_0%,transparent_50%)]" />
</div>
```

---

## 9. 아이콘 규칙

- SVG 아이콘만 사용 (이모지 사용 금지)
- Heroicons 스타일 (stroke-width: 1.2~1.5)
- 아이콘 버튼에는 `aria-label` 필수
- 크기: 아이콘 박스 내 `h-5 w-5` ~ `h-7 w-7`

---

## 10. 접근성 체크리스트

- [x] 색상 대비 4.5:1 이상 (WCAG AA)
- [x] focus-visible 링 스타일 (accent color, 2px)
- [x] 터치 타겟 최소 44x44px (pointer: coarse)
- [x] 이미지 alt 텍스트
- [x] 키보드 네비게이션 지원
- [x] reduced-motion 존중
- [x] lang="ko" 설정
- [x] 프린트 스타일

---

## 11. 파일 구조

```
src/
├── app/globals.css          ← CSS 변수 (색상, 폰트, 그림자, 커스텀 스타일)
├── lib/
│   ├── design-tokens.ts     ← 프로그래밍 토큰 (애니메이션 프리셋, 패턴 클래스)
│   └── constants.ts         ← 업체 정보, 네비게이션, 카테고리
└── components/
    ├── ui/                  ← 공통 UI (MagneticButton, TiltCard, TextScramble 등)
    ├── home/                ← 랜딩페이지 섹션별 컴포넌트
    └── three/               ← 3D 컴포넌트 (MarbleHero, ParticleField)
```
