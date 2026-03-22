# 클레식 (Clasic) - 기술 아키텍처 문서

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [디렉토리 구조](#디렉토리-구조)
4. [데이터 흐름](#데이터-흐름)
5. [페이지별 렌더링 전략](#페이지별-렌더링-전략)
6. [데이터베이스 설계](#데이터베이스-설계)
7. [인증 시스템](#인증-시스템)
8. [캐싱 전략](#캐싱-전략)
9. [이미지 파이프라인](#이미지-파이프라인)
10. [3D 렌더링 시스템](#3d-렌더링-시스템)
11. [개발자 관리 포인트](#개발자-관리-포인트)

---

## 프로젝트 개요

인조대리석 가공/시공 전문업체 "클레식"의 기업 웹사이트.
시공사례 포트폴리오, 자재 샘플 갤러리, 고객 문의, 관리자 대시보드를 포함한 풀스택 애플리케이션.

---

## 기술 스택

| 레이어 | 기술 | 버전 |
|--------|------|------|
| 프레임워크 | Next.js (App Router) | 16.1.6 |
| UI 런타임 | React | 19.2.3 |
| 언어 | TypeScript (strict) | 5.x |
| 스타일링 | Tailwind CSS | 4.x |
| 애니메이션 | Framer Motion | 12.x |
| 3D 그래픽 | Three.js + @react-three/fiber | 0.183 |
| ORM | Drizzle ORM | 0.45 |
| 데이터베이스 | Turso (SQLite) | - |
| 인증 | JWT (jose) + bcryptjs | - |
| 이미지 저장소 | Vercel Blob | - |
| 유효성 검증 | Zod | 4.x |
| 상태 관리 (admin) | TanStack React Query | 5.x |
| 배포 | Vercel | - |

---

## 디렉토리 구조

```
src/
├── app/                          # App Router
│   ├── (public)/                 # 공개 페이지 (layout: Header + Footer)
│   │   ├── page.tsx              #   / 랜딩 페이지
│   │   ├── portfolio/
│   │   │   ├── page.tsx          #   /portfolio 시공사례 목록
│   │   │   └── [id]/page.tsx     #   /portfolio/:id 시공사례 상세
│   │   ├── samples/page.tsx      #   /samples 자재 샘플
│   │   ├── about/page.tsx        #   /about 회사소개
│   │   └── contact/page.tsx      #   /contact 문의하기
│   ├── admin/                    # 관리자 페이지 (layout: Sidebar + QueryProvider)
│   │   ├── login/page.tsx        #   /admin/login
│   │   ├── portfolio/            #   CRUD 페이지들
│   │   ├── samples/              #   CRUD 페이지들
│   │   ├── inquiries/            #   문의 관리
│   │   └── activity-logs/        #   활동 로그
│   └── api/                      # API 라우트
│       ├── views/route.ts        #   조회수/방문자 추적 (public)
│       └── admin/                #   관리자 전용 API (JWT 보호)
│
├── actions/                      # Server Actions
│   ├── auth.ts                   #   로그인/로그아웃
│   ├── portfolio.ts              #   포트폴리오 CRUD + 캐시
│   ├── samples.ts                #   샘플 CRUD
│   ├── inquiries.ts              #   문의 관리
│   └── upload.ts                 #   이미지 업로드/삭제
│
├── components/
│   ├── home/                     # 랜딩 페이지 섹션들
│   ├── portfolio/                # 시공사례 관련
│   │   ├── PortfolioCard.tsx     #   서버 컴포넌트 (카드)
│   │   ├── CategoryFilter.tsx    #   클라이언트 (Link + motion)
│   │   ├── Pagination.tsx        #   서버 컴포넌트 (Link)
│   │   ├── AdminEditButton.tsx   #   클라이언트 (어드민 전용)
│   │   ├── ImageCarousel.tsx     #   클라이언트 (Embla)
│   │   └── PortfolioViewCount.tsx#   클라이언트 (조회수)
│   ├── three/                    # Three.js 3D 컴포넌트
│   ├── admin/                    # 관리자 UI 컴포넌트
│   ├── analytics/                # 추적 컴포넌트
│   └── ui/                       # 공통 UI 컴포넌트
│
├── hooks/                        # React Query 훅 (admin 전용)
├── lib/                          # 유틸리티, 설정, DB
│   ├── db/schema.ts              #   Drizzle 스키마
│   ├── auth/index.ts             #   JWT + bcrypt 유틸
│   ├── constants.ts              #   사이트 설정, 카테고리
│   └── validations/              #   Zod 스키마
└── types/index.ts                # TypeScript 타입 정의
```

### 서버/클라이언트 컴포넌트 구분 원칙

```
서버 컴포넌트 (기본값)              클라이언트 컴포넌트 ("use client")
─────────────────────             ──────────────────────────────
• 데이터 조회 (DB 직접 접근)        • 이벤트 핸들러 (onClick 등)
• HTML 생성                        • 브라우저 API (sessionStorage 등)
• 이미지 URL을 HTML에 포함          • 애니메이션 (framer-motion)
• 페이지네이션 (Link)              • 폼 상태 관리
• 예: PortfolioCard, Pagination    • 예: CategoryFilter, ContactForm
```

---

## 데이터 흐름

### 공개 페이지: Server Component First

```
브라우저 요청
    │
    ▼
서버 컴포넌트 (async)
    ├─ DB 직접 조회 (Drizzle ORM)
    ├─ unstable_cache로 결과 캐싱
    └─ 완성된 HTML 생성
        ├─ 이미지 URL이 <img> 태그에 포함
        └─ Link 컴포넌트로 내비게이션 준비
    │
    ▼
브라우저
    ├─ HTML 수신 → 즉시 화면 표시
    ├─ 이미지 다운로드 시작 (HTML 파싱과 동시)
    └─ JS 하이드레이션 (인터랙션 활성화)

※ 공개 페이지에서 클라이언트 fetch: 0건
※ React Query: 사용 안 함
※ API 라우트 호출: 없음 (서버에서 DB 직접 조회)
```

### 관리자 페이지: Server Action + React Query

```
브라우저 (관리자)
    │
    ├─ 데이터 조회: React Query → API 라우트 → DB
    │   └─ 실시간 refetch, 낙관적 업데이트
    │
    └─ 데이터 변경: Server Action → DB → revalidate
        ├─ FormData → Zod 검증
        ├─ Drizzle ORM으로 DB 변경
        ├─ 활동 로그 기록
        └─ revalidatePath() + updateTag()
```

---

## 페이지별 렌더링 전략

### `GET /` (랜딩 페이지)

```
서버:
  └─ getFeaturedPortfolios() → DB 2회 (캐시)
      → 추천 시공사례 6개 + 이미지

클라이언트 (하이드레이션 후):
  ├─ VisitTracker → POST /api/visits (세션 1회)
  └─ MarbleScrollCanvas → Three.js 3D 초기화
```

### `GET /portfolio?category=kitchen&page=2` (시공사례 목록)

```
서버:
  └─ Promise.all([
       getPortfoliosPublic("kitchen", 2, 12),  → DB 4회 (캐시)
       checkIsAdmin(),                          → 쿠키 확인
     ])
      → 12개 카드 HTML 생성
      → 첫 3개 이미지 priority preload

클라이언트 fetch: 0건
```

### `GET /portfolio/:id` (시공사례 상세)

```
서버:
  └─ Promise.all([
       getPortfolio(id),    → DB 2회 (캐시, React.cache 중복 제거)
       checkIsAdmin(),      → 쿠키 확인
     ])
      → 이미지 캐러셀 + 설명 HTML 생성

클라이언트 (하이드레이션 후):
  ├─ ViewTracker → POST /api/views (세션 최초 1회)
  └─ PortfolioViewCount → GET /api/views?portfolio=id
```

---

## 데이터베이스 설계

```
portfolios ──────┐
  id (PK)        │  1:N
  title          │
  category       │
  description    ├──→ portfolio_images
  thumbnailUrl   │      id (PK)
  isFeatured     │      portfolioId (FK, CASCADE)
  createdAt      │      imageUrl
  updatedAt      │      altText
                 │      sortOrder
                 │
samples          │  page_views
  id (PK)        │    id (PK)
  name           │    page (경로, e.g. "/portfolio/abc")
  brand          │    viewedAt
  colorCategory  │
  patternType    │  site_visits
  imageUrl       │    id (PK)
  description    │    visitedAt
  createdAt      │
                 │  admin_users
inquiries        │    id (PK)
  id (PK)        │    email (UNIQUE)
  name           │    name
  phone          │    passwordHash
  email          │    role ("superadmin" | "admin")
  inquiryType    │    isActive
  message        │    lastLoginAt
  isRead         │    createdAt, updatedAt
  createdAt      │
                 │  activity_logs
                 │    id (PK)
                 │    userId, userName
                 │    action, resource, resourceId
                 │    details (JSON), ipAddress
                 │    createdAt
```

---

## 인증 시스템

```
로그인 흐름:
  POST loginAction(email, password)
    → bcrypt.compare(password, hash)
    → jose.SignJWT({ userId, role })
    → Set-Cookie: admin-token (httpOnly, 7일)

요청 보호:
  middleware.ts
    → /admin/*, /api/admin/* 경로 가로채기
    → jose.jwtVerify(token, secret)
    → 실패 시 /admin/login 리디렉트

역할:
  superadmin → 모든 권한 + 사용자 관리
  admin      → CRUD 권한 (사용자 관리 제외)
```

---

## 캐싱 전략

| 레이어 | 대상 | TTL | 무효화 방법 |
|--------|------|-----|------------|
| `unstable_cache` | 포트폴리오 목록/상세, 추천 | 무기한 | `updateTag("portfolios")` |
| `React.cache` | 같은 요청 내 중복 제거 | 요청 범위 | 자동 |
| `Cache-Control` 헤더 | Next.js 클라이언트 캐시 | dynamic 5분, static 10분 | 자동 |
| Next.js Image | 이미지 최적화 (avif/webp) | 30일 | URL 변경 시 |

### 무효화 흐름

```
관리자가 포트폴리오 수정
  → updatePortfolio() 서버 액션
    → DB UPDATE
    → updateTag("portfolios")     ← 목록 캐시 무효화
    → revalidatePath("/portfolio") ← 페이지 캐시 무효화
    → revalidatePath("/portfolio/[id]")
    → revalidatePath("/")          ← 추천 목록 무효화
```

---

## 이미지 파이프라인

```
업로드:
  관리자 → ImageUploader 컴포넌트
    → POST /api/admin/upload
      → Vercel Blob에 원본 저장 (JPEG/PNG/WebP, 최대 4MB)
      → Blob URL 반환

서빙:
  브라우저 → /_next/image?url=blob-url&w=640&q=75
    → Next.js Image Optimization API
      → 원본 Blob에서 fetch
      → avif/webp로 변환 + 리사이징
      → CDN 캐시 (30일)
      → 응답

삭제:
  포트폴리오/샘플 삭제 시
    → deleteImage(blobUrl) → Vercel Blob에서 삭제
```

---

## 3D 렌더링 시스템

```
MarbleScrollScene.tsx
  ├─ InstancedMesh (12개 조각, 단일 draw call)
  │   ├─ 커스텀 GLSL 셰이더
  │   │   ├─ Simplex Noise + FBM → 대리석 무늬
  │   │   ├─ Wrap Diffuse Lighting → 회전 시 어두운 면 방지
  │   │   └─ Gold Fresnel Glow → 떠있는 조각 강조
  │   ├─ Per-instance opacity attribute
  │   └─ depthWrite: true (투명도 z-ordering 문제 방지)
  │
  ├─ CompleteSlab (조립 완료 시 단일 메시로 교체)
  │
  └─ 스크롤 키프레임 시스템
      └─ 스크롤 0% ~ 100%에 따라 위치/회전/스케일/투명도 보간
```

---

## 개발자 관리 포인트

### 1. 캐시 무효화 누락 주의

포트폴리오 또는 샘플의 CRUD 작업 시 반드시 관련 캐시를 무효화해야 합니다.

```typescript
// actions/portfolio.ts 에서 변경 후 반드시 호출:
updateTag("portfolios");           // unstable_cache 태그 무효화
revalidatePath("/portfolio");      // 목록 페이지
revalidatePath(`/portfolio/${id}`); // 상세 페이지
revalidatePath("/");                // 랜딩 페이지 (추천 목록)
```

**놓치기 쉬운 경우**: 새 카테고리를 추가하거나, `isFeatured` 상태만 변경할 때도 무효화 필요.

### 2. `unstable_cache` → `use cache` 마이그레이션

현재 `unstable_cache`를 사용 중이나, Next.js 16에서는 `"use cache"` 디렉티브가 권장됩니다.
향후 마이그레이션 시 아래 파일들을 확인:

- `src/actions/portfolio.ts` → `getPortfoliosPublic`, `getPortfolio`, `getFeaturedPortfolios`
- `src/actions/samples.ts` → 샘플 관련 캐시 함수

### 3. 서버/클라이언트 경계

PortfolioCard는 **서버 컴포넌트**입니다. 여기에 `onClick`, `useState`, `useEffect`를 추가하면 에러가 발생합니다.
인터랙티브 기능이 필요하면 별도의 클라이언트 컴포넌트를 만들어 합성하세요 (AdminEditButton 패턴 참조).

```
서버 컴포넌트에 인터랙션 추가할 때:
  ✗ PortfolioCard에 직접 onClick 추가
  ✓ 별도 클라이언트 컴포넌트를 만들어 PortfolioCard 안에 배치
```

### 4. 환경 변수

| 변수 | 용도 | 누락 시 영향 |
|------|------|-------------|
| `TURSO_DATABASE_URL` | DB 연결 | 앱 전체 작동 불가 |
| `TURSO_AUTH_TOKEN` | DB 인증 | 앱 전체 작동 불가 |
| `BLOB_READ_WRITE_TOKEN` | 이미지 업로드 | 업로드 실패 (조회는 가능) |
| `JWT_SECRET` | 토큰 서명 | 관리자 로그인 불가 |
| `NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID` | 네이버 지도 | 지도 표시 안 됨 |
| `NEXT_PUBLIC_SITE_URL` | SEO 메타데이터 | OG 이미지 경로 오류 |

### 5. 이미지 업로드 제한

- 허용 형식: JPEG, PNG, WebP
- 최대 크기: 4MB
- Server Actions body 제한: 10MB (`next.config.ts`)
- 이미지 삭제는 포트폴리오/샘플 삭제 시 자동으로 Blob에서도 삭제됨

### 6. DB 마이그레이션

```bash
# 스키마 변경 후:
npx drizzle-kit generate   # 마이그레이션 SQL 생성
npx drizzle-kit migrate    # 마이그레이션 실행

# 주의: Turso는 ALTER TABLE에 제약이 있음 (SQLite 기반)
# 컬럼 삭제/이름 변경은 테이블 재생성 필요
```

### 7. 관리자 초기 계정

첫 실행 시 `admin@clasic.kr / admin1234`로 자동 생성됩니다.
**반드시 배포 후 비밀번호를 변경하세요.**

### 8. 공개 페이지에서 React Query 사용 금지

공개 레이아웃 (`src/app/(public)/layout.tsx`)에서 `QueryProvider`를 제거했습니다.
공개 페이지에 React Query 훅을 사용하면 에러가 발생합니다.
React Query는 관리자 페이지 전용입니다.

### 9. Three.js 셰이더 수정 시 주의

`MarbleScrollScene.tsx`의 GLSL 셰이더는 문자열 템플릿으로 작성되어 있습니다.
- 컴파일 에러가 런타임에만 나타남 (콘솔에서 확인)
- `depthWrite: true` 설정을 제거하면 조각 합체 시 검은 면 재발
- `wrap` 값 (현재 0.5)을 올리면 더 균일한 조명, 내리면 더 극적인 명암

### 10. Pagination과 CategoryFilter의 href 구조

카테고리 필터와 페이지네이션이 서로의 파라미터를 보존해야 합니다.

```
CategoryFilter: 카테고리 변경 시 page 파라미터를 제거 (1페이지로 리셋)
Pagination: 페이지 변경 시 category 파라미터를 유지
```

새 필터 파라미터 추가 시 두 컴포넌트 모두 수정 필요.
