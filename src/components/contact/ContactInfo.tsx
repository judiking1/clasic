import { SITE_CONFIG } from "@/lib/constants";

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-secondary">
          연락처 정보
        </h3>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-secondary mb-1">주소</p>
              <p className="text-sm text-primary">{SITE_CONFIG.address}</p>
              {SITE_CONFIG.addressDetail && (
                <p className="text-xs text-secondary">{SITE_CONFIG.addressDetail}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-secondary mb-1">전화번호</p>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/-/g, "")}`}
                className="text-sm font-medium text-accent transition-colors hover:text-accent-light"
              >
                {SITE_CONFIG.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-secondary mb-1">이메일</p>
              <p className="text-sm text-primary">{SITE_CONFIG.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours & Map Link */}
      <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
        <h3 className="mb-4 text-sm font-bold text-primary">영업 시간</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary">월 - 금</span>
            <span className="font-medium text-primary">09:00 - 18:00</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary">토요일</span>
            <span className="font-medium text-primary">09:00 - 13:00</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary">일/공휴일</span>
            <span className="font-medium text-destructive">휴무</span>
          </div>
        </div>
        <a
          href={SITE_CONFIG.naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#03C75A] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#02b351] hover:shadow-md"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          네이버 지도에서 길찾기
        </a>
      </div>
    </div>
  );
}
