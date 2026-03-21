# 클레식 스톤 - 인조대리석 시공업체 홍보 웹사이트

## 프로젝트 개요

소규모 인조대리석 가공/시공 업체의 홍보용 웹사이트입니다.
대기업의 인조대리석 원판을 가공하여 싱크대, 세면대, 카운터 상판 등을 맞춤 제작하고 직접 시공하는 업체를 위한 사이트입니다.

---

## 완료된 작업

### 기술 스택
| 항목 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) + TypeScript | 16.1.6 |
| 스타일링 | Tailwind CSS | v4 |
| 3D 효과 | Three.js (@react-three/fiber + @react-three/drei) | v9 |
| 애니메이션 | Framer Motion | v12 |
| 데이터베이스 | Turso (LibSQL) + Drizzle ORM | - |
| 이미지 저장 | Vercel Blob | - |
| 인증 | JWT (jose + bcryptjs) | - |
| 지도 | 네이버 지도 API v3 | - |
| 유효성 검사 | Zod | v4 |
| 배포 대상 | Vercel | - |

### 구현된 페이지 (총 19개 라우트)

#### 공개 페이지
| 경로 | 설명 | 주요 기능 |
|------|------|-----------|
| `/` | 메인 페이지 | Three.js 3D 대리석 슬랩 히어로, 회사 소개 카드, 주요 시공사례 캐러셀, 통계 카운터, CTA |
| `/portfolio` | 시공사례 목록 | 카테고리 필터(싱크대/세면대/카운터/기타), 반응형 그리드 |
| `/portfolio/[id]` | 시공사례 상세 | 이미지 캐러셀 + 라이트박스, 동적 SEO 메타태그 |
| `/about` | 회사소개 | 연혁 타임라인, 시공 프로세스(5단계), 네이버 지도, 연락처 |
| `/samples` | 인조대리석 샘플 | 색상별 필터, 샘플 그리드 |
| `/contact` | 문의하기 | 문의 폼(Zod 유효성 검사), 연락처 정보 |

#### 관리자 페이지
| 경로 | 설명 | 주요 기능 |
|------|------|-----------|
| `/admin/login` | 관리자 로그인 | 비밀번호 기반 JWT 인증 |
| `/admin` | 대시보드 | 통계 카드(포트폴리오/샘플/문의 수), 최근 문의 목록 |
| `/admin/portfolio` | 시공사례 관리 | 목록, 수정/삭제 |
| `/admin/portfolio/new` | 시공사례 등록 | 다중 이미지 업로드, 카테고리 선택, 대표 이미지 설정 |
| `/admin/portfolio/[id]/edit` | 시공사례 수정 | 기존 데이터 로드 후 수정 |
| `/admin/samples` | 샘플 관리 | 목록, 수정/삭제 |
| `/admin/samples/new` | 샘플 등록 | 이미지 업로드, 브랜드/색상/패턴 분류 |
| `/admin/samples/[id]/edit` | 샘플 수정 | 기존 데이터 로드 후 수정 |
| `/admin/inquiries` | 문의 관리 | 문의 목록, 읽음/안읽음 상태 표시 |
| `/admin/inquiries/[id]` | 문의 상세 | 문의 내용 확인, 읽음 처리, 삭제 |

### 구현된 기능

- **Three.js 3D 효과**: 메인 히어로에 3D 대리석 슬랩 모델 (자동 회전, 마우스 반응, 환경 조명, 파티클 효과)
- **Framer Motion 애니메이션**: 스크롤 트리거 fade-in/slide-up, 통계 카운터 애니메이션, 페이지 전환 효과
- **반응형 디자인**: 모바일/태블릿/데스크톱 대응, 모바일 햄버거 메뉴
- **SEO 최적화**: SSR, 한국어 메타태그, Open Graph, JSON-LD (LocalBusiness), sitemap.xml, robots.txt, 네이버 검증 메타태그
- **관리자 인증**: JWT 기반 로그인, middleware로 /admin/* 보호, HTTP-only 쿠키
- **이미지 업로드**: Vercel Blob 연동 (개발 시 base64 폴백), 드래그앤드롭 지원
- **문의 시스템**: 폼 유효성 검사(Zod), DB 저장, 관리자 읽음 관리

### DB 스키마 (4개 테이블)
- `portfolios` - 시공사례 (제목, 카테고리, 설명, 썸네일, 대표여부)
- `portfolio_images` - 시공사례 이미지 (다중 이미지, 정렬 순서)
- `samples` - 인조대리석 샘플 (이름, 브랜드, 색상, 패턴)
- `inquiries` - 문의 (이름, 연락처, 유형, 내용, 읽음 상태)

### 프로젝트 구조 (65개 소스 파일)
```
src/
├── actions/          # 서버 액션 (auth, portfolio, samples, inquiries, upload)
├── app/              # 라우트 페이지
│   ├── (public)/     # 공개 페이지 (portfolio, about, samples, contact)
│   ├── admin/        # 관리자 페이지
│   └── ...           # 루트 레이아웃, 메인, SEO 파일
├── components/
│   ├── about/        # 회사소개 컴포넌트 (연혁, 프로세스, 네이버 지도)
│   ├── admin/        # 관리자 컴포넌트 (폼, 삭제 버튼)
│   ├── contact/      # 문의 컴포넌트 (폼, 연락처 정보)
│   ├── home/         # 메인 페이지 컴포넌트 (히어로, 소개, 포트폴리오, 통계, CTA)
│   ├── layout/       # 레이아웃 컴포넌트 (Header, Footer, AdminSidebar)
│   ├── portfolio/    # 포트폴리오 컴포넌트 (그리드, 카드, 필터, 캐러셀)
│   ├── samples/      # 샘플 컴포넌트 (그리드, 카드, 필터)
│   ├── three/        # Three.js 컴포넌트 (MarbleHero, ParticleField, MarbleBackground)
│   └── ui/           # 공통 UI 컴포넌트 (ImageUploader)
├── lib/
│   ├── auth/         # 인증 유틸리티
│   ├── db/           # DB 클라이언트 + 스키마
│   └── validations/  # Zod 스키마
├── hooks/            # 커스텀 훅
└── types/            # TypeScript 타입 정의
```

---

## 개발 환경 실행 방법

```bash
# 의존성 설치
npm install

# DB 스키마 적용 (로컬 SQLite)
npx drizzle-kit push

# 개발 서버 실행
npm run dev
```

- 사이트: http://localhost:3000
- 관리자: http://localhost:3000/admin/login
- **개발용 관리자 비밀번호: `admin1234`**

---

## 앞으로 해야 할 작업

### 1단계: 실제 업체 정보 반영 (필수)
- [ ] `src/lib/constants.ts`에서 업체 정보 수정
  - 회사명, 전화번호, 주소, 사업자등록번호, 이메일
  - 위도/경도 좌표 (네이버 지도용)
- [ ] `src/components/about/CompanyHistory.tsx`에서 실제 연혁으로 수정
- [ ] `src/components/home/StatsCounter.tsx`에서 실제 수치로 수정
- [ ] 파비콘(favicon.ico) 및 OG 이미지 교체

### 2단계: 외부 서비스 설정 (필수)
- [ ] **Turso DB 생성 및 연결**
  - `turso db create clasic-stone` (Turso CLI 설치 필요)
  - 생성된 URL과 토큰을 환경변수에 설정
  - `npx drizzle-kit push`로 프로덕션 DB에 스키마 적용
- [ ] **네이버 지도 API 키 발급**
  - Naver Cloud Platform 가입 -> Maps -> Web Dynamic Map 사용 신청
  - 클라이언트 ID를 `NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID`에 설정
- [ ] **관리자 비밀번호 설정** (프로덕션용)
  ```bash
  node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('원하는비밀번호', 12).then(h => console.log(h));"
  ```
  - 출력된 해시를 `ADMIN_PASSWORD_HASH`에 설정
- [ ] **JWT 시크릿 변경** (프로덕션용)
  - 32자 이상의 랜덤 문자열로 `JWT_SECRET` 변경

### 3단계: Vercel 배포 (필수)
- [ ] GitHub 저장소에 코드 푸시
- [ ] Vercel에서 프로젝트 연결 (Import Git Repository)
- [ ] 환경변수 설정 (Vercel 프로젝트 Settings > Environment Variables)
  ```
  TURSO_DATABASE_URL=libsql://...
  TURSO_AUTH_TOKEN=...
  BLOB_READ_WRITE_TOKEN= (Vercel Blob 연결 시 자동 생성)
  ADMIN_PASSWORD_HASH=...
  JWT_SECRET=...
  NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID=...
  NAVER_SITE_VERIFICATION=...
  NEXT_PUBLIC_SITE_URL=https://실제도메인.com
  ```
- [ ] 커스텀 도메인 연결 (선택)

### 4단계: SEO 등록 (권장)
- [ ] 네이버 서치어드바이저에 사이트 등록 및 사이트맵 제출
- [ ] 구글 서치 콘솔에 사이트 등록 및 사이트맵 제출
- [ ] 네이버 플레이스에 업체 등록

### 5단계: 콘텐츠 등록 (운영)
- [ ] 관리자 페이지에서 시공사례 사진 등록
- [ ] 인조대리석 샘플 정보 및 사진 등록

### 개선 사항 (선택)
- [ ] 이메일 알림: 문의 접수 시 업주에게 이메일 발송 (Resend 등 연동)
- [ ] 카카오톡 채널 연동: 실시간 상담 버튼 추가
- [ ] 이미지 최적화: 업로드 시 자동 압축/리사이즈
- [ ] 관리자 모바일 대응: 사이드바 반응형 처리 (현재 데스크톱 최적화)
- [ ] 다국어 지원: 영어 페이지 추가 (필요시)
- [ ] 포트폴리오 페이지네이션: 게시물 많아지면 페이지네이션 또는 무한스크롤 추가

---

## 환경변수 요약

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `TURSO_DATABASE_URL` | Turso DB URL (개발: `file:local.db`) | O |
| `TURSO_AUTH_TOKEN` | Turso 인증 토큰 | 프로덕션만 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob 토큰 | 프로덕션만 |
| `ADMIN_PASSWORD_HASH` | 관리자 비밀번호 bcrypt 해시 | O |
| `JWT_SECRET` | JWT 서명 시크릿 (32자 이상) | O |
| `NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID` | 네이버 지도 API 클라이언트 ID | 지도 사용 시 |
| `NAVER_SITE_VERIFICATION` | 네이버 웹마스터 인증 코드 | SEO 등록 시 |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL | O |
