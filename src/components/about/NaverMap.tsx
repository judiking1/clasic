import { SITE_CONFIG } from "@/lib/constants";

export function NaverMap() {
  return (
    <div className="flex h-80 w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 p-8 text-center">
      {/* Map Icon */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
        <svg
          className="h-8 w-8 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
      </div>

      {/* Address */}
      <p className="mb-1 text-lg font-bold text-stone-900">{SITE_CONFIG.name}</p>
      <p className="mb-6 text-sm text-stone-600">{SITE_CONFIG.address}</p>

      {/* Naver Map Button */}
      <a
        href={SITE_CONFIG.naverMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-[#03C75A] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#02b351] hover:shadow-lg"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
        </svg>
        네이버 지도에서 보기
      </a>
    </div>
  );
}
