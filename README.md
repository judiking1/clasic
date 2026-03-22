# 클레식 (Clasic)

인조대리석 가공 및 시공 전문업체 클레식의 기업 웹사이트.

## 기술 스택

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Runtime**: React 19, TypeScript (strict)
- **Database**: Turso (SQLite) + Drizzle ORM
- **Styling**: Tailwind CSS 4 + Framer Motion
- **3D**: Three.js + @react-three/fiber
- **Auth**: JWT (jose) + bcryptjs
- **Storage**: Vercel Blob (이미지)
- **Deploy**: Vercel

## 시작하기

### 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local`에 아래 값을 채워주세요:

```env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
BLOB_READ_WRITE_TOKEN=vercel_blob_...
JWT_SECRET=your-jwt-secret-at-least-32-characters
NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID=your-naver-maps-id
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 실행

```bash
npm install
npx drizzle-kit migrate   # DB 마이그레이션
npm run dev               # http://localhost:3000
```

### 관리자 접속

첫 실행 시 기본 계정이 자동 생성됩니다:

```
URL: /admin/login
Email: admin@clasic.kr
Password: admin1234
```

> 배포 후 반드시 비밀번호를 변경하세요.

---

## 아키텍처 개요

자세한 내용은 [ARCHITECTURE.md](./ARCHITECTURE.md)를 참고하세요.

### 디렉토리 구조

```
src/
├── app/
│   ├── (public)/          # 공개 페이지 (SSR, Server Components)
│   ├── admin/             # 관리자 페이지 (React Query)
│   └── api/               # API 라우트
├── actions/               # Server Actions (CRUD + 캐시 무효화)
├── components/            # UI 컴포넌트 (feature별 분류)
├── hooks/                 # React Query 훅 (admin 전용)
├── lib/                   # DB, 인증, 유틸리티
└── types/                 # TypeScript 타입
```

### 렌더링 전략

| 영역 | 전략 | 이유 |
|------|------|------|
| 공개 페이지 | Server Component | 클라이언트 fetch 0건, SEO 최적화, 빠른 이미지 로딩 |
| 관리자 페이지 | Client Component + React Query | 실시간 CRUD, 낙관적 업데이트 |
| 3D 마블 | Client Component (Three.js) | WebGL은 브라우저에서만 동작 |

### 데이터 흐름 (공개 페이지)

```
브라우저 ─── Link 클릭 ──→ Vercel 서버
                              │
                              ├─ Server Component 실행
                              ├─ DB 직접 조회 (Drizzle)
                              ├─ unstable_cache 적용
                              └─ HTML 생성 (이미지 URL 포함)
                              │
브라우저 ←── RSC 페이로드 ────┘
  │
  ├─ 즉시 화면 표시
  ├─ 이미지 다운로드 시작 (priority 3개 우선)
  └─ 하이드레이션 (인터랙션 활성화)

※ 클라이언트 fetch 요청: 0건
```

### 데이터 흐름 (관리자 페이지)

```
관리자 ─── 폼 제출 ──→ Server Action
                          │
                          ├─ Zod 유효성 검증
                          ├─ DB 변경 (Drizzle)
                          ├─ 활동 로그 기록
                          ├─ 캐시 무효화 (revalidatePath + updateTag)
                          └─ 결과 반환
                          │
관리자 ←── ActionResult ──┘
  │
  └─ React Query refetch → UI 업데이트
```

### 데이터베이스

```
portfolios (시공사례)
  └─ portfolio_images (시공 이미지, 1:N)

samples (자재 샘플)
inquiries (고객 문의)
admin_users (관리자 계정)
activity_logs (감사 로그)
page_views (조회수)
site_visits (방문자)
```

### 캐싱 레이어

```
unstable_cache ─→ 서버 메모리 (무기한, 태그 기반 무효화)
React.cache ────→ 요청 내 중복 제거
Next.js Image ──→ CDN (avif/webp, 30일)
```

### 인증

```
JWT 기반 (httpOnly 쿠키, 7일 만료)
├─ middleware.ts: /admin/*, /api/admin/* 보호
├─ 역할: superadmin (전체 권한), admin (CRUD 권한)
└─ 활동 로그: 로그인/로그아웃/CRUD 기록
```

---

## 주요 기능

- **시공사례**: 카테고리 필터링, 페이지네이션, 이미지 캐러셀, 조회수 추적
- **자재 샘플**: 색상/패턴 필터링, 갤러리 뷰
- **고객 문의**: 폼 제출, 관리자 읽음 상태 관리
- **관리자 대시보드**: 통계, CRUD 관리, 활동 로그, 다중 사용자
- **3D 마블 애니메이션**: 스크롤 기반 대리석 조각 합체 효과
- **SEO**: 구조화 데이터, OG 메타태그, RSS 피드, 사이트맵

---

## 빌드 & 배포

```bash
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint
```

Vercel에 연결된 Git 리포지토리로 push 시 자동 배포됩니다.

---

## 외부 서비스

| 서비스 | 용도 |
|--------|------|
| [Turso](https://turso.tech) | 클라우드 SQLite 데이터베이스 |
| [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) | 이미지 저장소 |
| [Vercel Analytics](https://vercel.com/analytics) | 웹 분석 |
| [Naver Maps](https://navermaps.github.io/maps.js/) | 위치 지도 |
