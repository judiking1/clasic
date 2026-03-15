import { SITE_CONFIG } from "@/lib/constants";

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-gray-900">연락처 정보</h3>

        <div className="space-y-5">
          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">주소</p>
              <p className="mt-0.5 text-sm text-gray-600">{SITE_CONFIG.address}</p>
              {SITE_CONFIG.addressDetail && (
                <p className="text-xs text-gray-400">{SITE_CONFIG.addressDetail}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">전화번호</p>
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="mt-0.5 block text-sm text-amber-600 transition-colors hover:text-amber-700"
              >
                {SITE_CONFIG.phone}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">이메일</p>
              <p className="mt-0.5 text-sm text-gray-600">{SITE_CONFIG.email}</p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">영업시간</p>
              <p className="mt-0.5 text-sm text-gray-600">
                {SITE_CONFIG.businessHours}
              </p>
              <p className="text-xs text-gray-400">일요일 및 공휴일 휴무</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Link Card */}
      <div className="rounded-2xl bg-amber-50 p-6">
        <h3 className="mb-2 text-sm font-bold text-amber-900">
          네이버 지도에서 보기
        </h3>
        <p className="mb-4 text-xs text-amber-700">
          길찾기 및 상세 위치를 확인하세요
        </p>
        <a
          href={`https://map.naver.com/v5/search/${encodeURIComponent(SITE_CONFIG.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          지도 열기
        </a>
      </div>
    </div>
  );
}
