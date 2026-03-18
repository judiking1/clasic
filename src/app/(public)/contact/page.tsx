import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import PageHero from "@/components/ui/PageHero";

export const metadata = {
  title: "문의하기",
  description: "인조대리석 시공 관련 문의를 남겨주시면 빠르게 답변드리겠습니다.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
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
        </section>
      </main>
      <Footer />
    </>
  );
}
