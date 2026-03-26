import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { NaverMap } from "@/components/about/NaverMap";
import PageHero from "@/components/ui/PageHero";

export const metadata = {
  title: "문의하기 - 인조대리석 시공 견적 무료 상담",
  description:
    "인조대리석 싱크대, 세면대, 카운터 시공 견적을 무료로 상담받으세요. 클레식에 문의하시면 빠르게 답변드리겠습니다.",
  keywords: [
    "인조대리석 견적",
    "인조대리석 상담",
    "싱크대 견적",
    "세면대 견적",
    "인조대리석 문의",
  ],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <PageHero
        label="Contact"
        title="문의하기"
        description="견적 문의나 궁금한 사항을 남겨주시면 빠르게 연락드리겠습니다"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-bold text-primary">
                문의 남기기
              </h2>
              <ContactForm />
            </div>
          </div>

          <div className="lg:col-span-2">
            <ContactInfo />
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-10 bg-accent" />
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-accent">
              Location
            </span>
          </div>
          <h3 className="mb-6 text-2xl font-bold tracking-tight text-primary">
            오시는 길
          </h3>
          <div className="overflow-hidden rounded-2xl border border-border">
            <NaverMap />
          </div>
        </div>
      </section>
    </main>
  );
}
