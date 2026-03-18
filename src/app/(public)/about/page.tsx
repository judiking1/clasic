import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CompanyHistory } from "@/components/about/CompanyHistory";
import { ProcessSteps } from "@/components/about/ProcessSteps";
import { NaverMap } from "@/components/about/NaverMap";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: "회사소개",
  description: "클래식 회사 소개 - 인조대리석 가공 및 시공 전문 업체",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 lg:pt-24">
        {/* Hero Banner */}
        <section className="bg-gray-900 py-16 text-center text-white sm:py-20">
          <div className="mx-auto max-w-3xl px-4">
            <h1 className="text-3xl font-bold sm:text-4xl">회사소개</h1>
            <p className="mt-4 text-lg text-gray-300">
              {SITE_CONFIG.name}은 최고의 품질과 정성으로
              <br className="hidden sm:inline" />
              인조대리석 가공 및 시공 서비스를 제공합니다
            </p>
          </div>
        </section>

        {/* Company History */}
        <CompanyHistory />

        {/* Process Steps */}
        <ProcessSteps />

        {/* Map & Contact Section */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
              오시는 길
            </h2>

            <div className="grid gap-10 lg:grid-cols-2">
              {/* Map */}
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <NaverMap />
              </div>

              {/* Contact Info */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="rounded-2xl bg-gray-50 p-6 sm:p-8">
                  <h3 className="mb-6 text-xl font-bold text-gray-900">
                    연락처 정보
                  </h3>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">주소</p>
                        <p className="mt-1 text-gray-600">
                          {SITE_CONFIG.address}
                        </p>
                        {SITE_CONFIG.addressDetail && (
                          <p className="text-sm text-gray-500">
                            {SITE_CONFIG.addressDetail}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">전화번호</p>
                        <a
                          href={`tel:${SITE_CONFIG.phone}`}
                          className="mt-1 block text-amber-600 transition-colors hover:text-amber-700"
                        >
                          {SITE_CONFIG.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">이메일</p>
                        <p className="mt-1 text-gray-600">
                          {SITE_CONFIG.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
