import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CompanyHistory } from "@/components/about/CompanyHistory";
import { ProcessSteps } from "@/components/about/ProcessSteps";
import { NaverMap } from "@/components/about/NaverMap";
import { SITE_CONFIG } from "@/lib/constants";
import PageHero from "@/components/ui/PageHero";

export const metadata = {
  title: "회사소개",
  description: "클래식 회사 소개 - 인조대리석 가공 및 시공 전문 업체",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <PageHero
          label="About Us"
          title="회사소개"
          description={`${SITE_CONFIG.name}은 최고의 품질과 정성으로 인조대리석 가공 및 시공 서비스를 제공합니다`}
        />

        <CompanyHistory />
        <ProcessSteps />

        {/* Map & Contact Section */}
        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-center gap-4">
              <div className="h-px w-12 bg-accent" />
              <span className="text-xs font-medium tracking-[0.3em] uppercase text-accent">
                Location
              </span>
            </div>
            <h2 className="mb-12 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              오시는 길
            </h2>

            <div className="grid gap-10 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-border">
                <NaverMap />
              </div>

              <div className="flex flex-col justify-center">
                <div className="rounded-2xl border border-border bg-muted p-8 sm:p-10">
                  <h3 className="mb-8 text-lg font-bold text-primary">
                    연락처 정보
                  </h3>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-secondary mb-1">주소</p>
                        <p className="text-sm text-primary">{SITE_CONFIG.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-secondary mb-1">전화번호</p>
                        <a
                          href={`tel:${SITE_CONFIG.phone.replace(/-/g, "")}`}
                          className="text-sm text-accent transition-colors hover:text-accent-light"
                        >
                          {SITE_CONFIG.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
